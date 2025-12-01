package com.example.cashewcorner.service;

import com.example.cashewcorner.dto.*;
import com.example.cashewcorner.entity.Inventory;
import com.example.cashewcorner.entity.Product;
import com.example.cashewcorner.entity.StockMovement;
import com.example.cashewcorner.exception.ResourceNotFoundException;
import com.example.cashewcorner.repository.InventoryRepository;
import com.example.cashewcorner.repository.ProductRepository;
import com.example.cashewcorner.repository.StockMovementRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final StockMovementRepository stockMovementRepository;

    public InventoryService(InventoryRepository inventoryRepository,
                           ProductRepository productRepository,
                           StockMovementRepository stockMovementRepository) {
        this.inventoryRepository = inventoryRepository;
        this.productRepository = productRepository;
        this.stockMovementRepository = stockMovementRepository;
    }

    public InventoryDto receiveStock(ReceiveStockRequestDto request) {
        log.info("Receiving stock - [productId={}, quantity={}, location={}]", 
                request.getProductId(), request.getQuantity(), request.getLocation());

        Product product = productRepository.findByProductIdAndIsActiveTrue(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        // Find or create inventory record
        Inventory inventory = inventoryRepository
                .findByProductProductIdAndLocation(request.getProductId(), request.getLocation())
                .orElse(Inventory.builder()
                        .product(product)
                        .location(request.getLocation())
                        .quantityOnHand(BigDecimal.ZERO)
                        .reservedQuantity(BigDecimal.ZERO)
                        .build());

        // Update quantity
        BigDecimal newQuantity = inventory.getQuantityOnHand().add(request.getQuantity());
        inventory.setQuantityOnHand(newQuantity);
        inventory = inventoryRepository.save(inventory);

        // Record stock movement
        StockMovement movement = StockMovement.builder()
                .product(product)
                .movementType("RECEIVE")
                .relatedType(request.getPurchaseOrderId() != null ? "PURCHASE_ORDER" : null)
                .relatedId(request.getPurchaseOrderId())
                .quantity(request.getQuantity())
                .balanceAfter(newQuantity)
                .notes(request.getNotes())
                .build();
        stockMovementRepository.save(movement);

        log.info("Stock received successfully - [productId={}, newQuantity={}]", 
                request.getProductId(), newQuantity);

        return mapToDto(inventory);
    }

    public InventoryDto adjustStock(AdjustStockRequestDto request) {
        log.info("Adjusting stock - [productId={}, quantity={}, type={}]", 
                request.getProductId(), request.getQuantity(), request.getAdjustmentType());

        Product product = productRepository.findByProductIdAndIsActiveTrue(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        Inventory inventory = inventoryRepository
                .findByProductProductIdAndLocation(request.getProductId(), request.getLocation())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Inventory not found for product " + request.getProductId() + " at location " + request.getLocation()));

        BigDecimal newQuantity;
        String movementType;

        if ("ADD".equalsIgnoreCase(request.getAdjustmentType())) {
            newQuantity = inventory.getQuantityOnHand().add(request.getQuantity());
            movementType = "ADJUSTMENT_IN";
        } else if ("REMOVE".equalsIgnoreCase(request.getAdjustmentType())) {
            newQuantity = inventory.getQuantityOnHand().subtract(request.getQuantity());
            if (newQuantity.compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalArgumentException("Insufficient stock. Available: " + inventory.getQuantityOnHand());
            }
            movementType = "ADJUSTMENT_OUT";
        } else {
            throw new IllegalArgumentException("Invalid adjustment type. Use ADD or REMOVE");
        }

        inventory.setQuantityOnHand(newQuantity);
        inventory = inventoryRepository.save(inventory);

        // Record stock movement
        StockMovement movement = StockMovement.builder()
                .product(product)
                .movementType(movementType)
                .quantity(request.getQuantity())
                .balanceAfter(newQuantity)
                .notes(request.getNotes())
                .build();
        stockMovementRepository.save(movement);

        log.info("Stock adjusted successfully - [productId={}, newQuantity={}]", 
                request.getProductId(), newQuantity);

        return mapToDto(inventory);
    }

    @Transactional(readOnly = true)
    public List<InventoryDto> getAllInventory() {
        log.info("Fetching all inventory");
        return inventoryRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InventoryDto> getInventoryWithStock() {
        log.info("Fetching inventory with available stock");
        return inventoryRepository.findAllWithStock().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InventoryDto> getLowStockItems() {
        log.info("Fetching low stock items");
        return inventoryRepository.findLowStockItems().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InventoryDto> getInventoryByProduct(Long productId) {
        log.info("Fetching inventory for product - [productId={}]", productId);
        return inventoryRepository.findByProductProductId(productId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InventoryDto> getInventoryByLocation(String location) {
        log.info("Fetching inventory for location - [location={}]", location);
        return inventoryRepository.findByLocation(location).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InventoryDto> searchInventory(String variety, Long supplierId, String location, String productName) {
        log.info("Searching inventory - [variety={}, supplierId={}, location={}, productName={}]", 
                variety, supplierId, location, productName);

        // Use productName or variety for search
        String searchTerm = productName != null ? productName : variety;
        
        return inventoryRepository.searchInventory(searchTerm, location).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public InventorySummaryDto getInventorySummary() {
        log.info("Generating inventory summary");

        List<Inventory> allInventory = inventoryRepository.findAll();
        List<Inventory> lowStockItems = inventoryRepository.findLowStockItems();

        long totalProducts = allInventory.stream()
                .map(inv -> inv.getProduct().getProductId())
                .distinct()
                .count();

        long locationsCount = allInventory.stream()
                .map(Inventory::getLocation)
                .distinct()
                .count();

        BigDecimal totalValue = allInventory.stream()
                .map(inv -> inv.getQuantityOnHand().multiply(inv.getProduct().getCostPrice()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return InventorySummaryDto.builder()
                .totalProducts(totalProducts)
                .lowStockItems((long) lowStockItems.size())
                .totalInventoryValue(totalValue)
                .locationsCount(locationsCount)
                .build();
    }

    @Transactional(readOnly = true)
    public List<StockMovementDto> getStockMovements(Long productId) {
        log.info("Fetching stock movements - [productId={}]", productId);
        
        if (productId != null) {
            return stockMovementRepository.findByProductProductIdOrderByMovementDateDesc(productId).stream()
                    .map(this::mapMovementToDto)
                    .collect(Collectors.toList());
        }
        
        return stockMovementRepository.findAll().stream()
                .map(this::mapMovementToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StockMovementDto> searchStockMovements(String productName, String movementType, 
                                                        LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Searching stock movements - [productName={}, movementType={}, startDate={}, endDate={}]", 
                productName, movementType, startDate, endDate);

        return stockMovementRepository.searchMovements(productName, movementType, startDate, endDate).stream()
                .map(this::mapMovementToDto)
                .collect(Collectors.toList());
    }

    private InventoryDto mapToDto(Inventory inventory) {
        return InventoryDto.builder()
                .inventoryId(inventory.getInventoryId())
                .productId(inventory.getProduct().getProductId())
                .productName(inventory.getProduct().getName())
                .productSku(inventory.getProduct().getSku())
                .location(inventory.getLocation())
                .quantityOnHand(inventory.getQuantityOnHand())
                .reservedQuantity(inventory.getReservedQuantity())
                .availableQuantity(inventory.getAvailableQuantity())
                .unit(inventory.getProduct().getUnit())
                .lastUpdated(inventory.getLastUpdated())
                .build();
    }

    private StockMovementDto mapMovementToDto(StockMovement movement) {
        return StockMovementDto.builder()
                .movementId(movement.getMovementId())
                .productId(movement.getProduct().getProductId())
                .productName(movement.getProduct().getName())
                .productSku(movement.getProduct().getSku())
                .movementType(movement.getMovementType())
                .relatedType(movement.getRelatedType())
                .relatedId(movement.getRelatedId())
                .quantity(movement.getQuantity())
                .balanceAfter(movement.getBalanceAfter())
                .movementDate(movement.getMovementDate())
                .notes(movement.getNotes())
                .build();
    }
}
