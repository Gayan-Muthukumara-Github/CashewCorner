package com.example.cashewcorner.service;

import com.example.cashewcorner.dto.*;
import com.example.cashewcorner.entity.RawCashew;
import com.example.cashewcorner.entity.RawCashewInventory;
import com.example.cashewcorner.entity.RawCashewStockMovement;
import com.example.cashewcorner.exception.ResourceNotFoundException;
import com.example.cashewcorner.repository.RawCashewInventoryRepository;
import com.example.cashewcorner.repository.RawCashewRepository;
import com.example.cashewcorner.repository.RawCashewStockMovementRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class RawCashewInventoryService {

    private final RawCashewInventoryRepository inventoryRepository;
    private final RawCashewStockMovementRepository movementRepository;
    private final RawCashewRepository rawCashewRepository;

    private static final BigDecimal LOW_STOCK_THRESHOLD = new BigDecimal("100");

    public RawCashewInventoryService(RawCashewInventoryRepository inventoryRepository,
                                      RawCashewStockMovementRepository movementRepository,
                                      RawCashewRepository rawCashewRepository) {
        this.inventoryRepository = inventoryRepository;
        this.movementRepository = movementRepository;
        this.rawCashewRepository = rawCashewRepository;
    }

    public RawCashewInventoryDto receiveStock(ReceiveRawCashewStockRequestDto request) {
        log.info("Receiving raw cashew stock - [cashewTypeId={}, quantity={}, location={}]",
                request.getCashewTypeId(), request.getQuantity(), request.getLocation());

        RawCashew rawCashew = rawCashewRepository.findByCashewTypeIdAndIsActiveTrue(request.getCashewTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Raw cashew not found with id: " + request.getCashewTypeId()));

        // Find or create inventory record
        RawCashewInventory inventory = inventoryRepository
                .findByRawCashewCashewTypeIdAndLocation(request.getCashewTypeId(), request.getLocation())
                .orElse(RawCashewInventory.builder()
                        .rawCashew(rawCashew)
                        .location(request.getLocation())
                        .quantityOnHand(BigDecimal.ZERO)
                        .reservedQuantity(BigDecimal.ZERO)
                        .build());

        // Update quantity
        BigDecimal newQuantity = inventory.getQuantityOnHand().add(request.getQuantity());
        inventory.setQuantityOnHand(newQuantity);
        inventory = inventoryRepository.save(inventory);

        // Record stock movement
        RawCashewStockMovement movement = RawCashewStockMovement.builder()
                .rawCashew(rawCashew)
                .movementType("RECEIVE")
                .relatedType(request.getPurchaseOrderId() != null ? "PURCHASE_ORDER" : null)
                .relatedId(request.getPurchaseOrderId())
                .quantity(request.getQuantity())
                .balanceAfter(newQuantity)
                .notes(request.getNotes())
                .build();
        movementRepository.save(movement);

        log.info("Raw cashew stock received successfully - [cashewTypeId={}, newQuantity={}]",
                request.getCashewTypeId(), newQuantity);

        return mapToDto(inventory);
    }

    public RawCashewInventoryDto adjustStock(AdjustRawCashewStockRequestDto request) {
        log.info("Adjusting raw cashew stock - [cashewTypeId={}, quantity={}, type={}]",
                request.getCashewTypeId(), request.getQuantity(), request.getAdjustmentType());

        RawCashew rawCashew = rawCashewRepository.findByCashewTypeIdAndIsActiveTrue(request.getCashewTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Raw cashew not found with id: " + request.getCashewTypeId()));

        RawCashewInventory inventory = inventoryRepository
                .findByRawCashewCashewTypeIdAndLocation(request.getCashewTypeId(), request.getLocation())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Inventory not found for cashew type: " + request.getCashewTypeId() + " at location: " + request.getLocation()));

        String movementType = request.getAdjustmentType().toUpperCase();
        BigDecimal adjustmentQty = request.getQuantity();
        BigDecimal newQuantity;

        if ("ADD".equals(movementType) || "CORRECTION_ADD".equals(movementType)) {
            newQuantity = inventory.getQuantityOnHand().add(adjustmentQty);
        } else {
            newQuantity = inventory.getQuantityOnHand().subtract(adjustmentQty);
            if (newQuantity.compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalArgumentException("Insufficient stock. Available: " + inventory.getQuantityOnHand());
            }
        }

        inventory.setQuantityOnHand(newQuantity);
        inventory = inventoryRepository.save(inventory);

        // Record stock movement
        RawCashewStockMovement movement = RawCashewStockMovement.builder()
                .rawCashew(rawCashew)
                .movementType(movementType)
                .quantity(adjustmentQty)
                .balanceAfter(newQuantity)
                .notes(request.getNotes())
                .build();
        movementRepository.save(movement);

        log.info("Raw cashew stock adjusted successfully - [cashewTypeId={}, newQuantity={}]",
                request.getCashewTypeId(), newQuantity);

        return mapToDto(inventory);
    }

    @Transactional(readOnly = true)
    public List<RawCashewInventoryDto> getAllInventory() {
        log.info("Fetching all raw cashew inventory");
        return inventoryRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RawCashewInventoryDto> getInventoryWithStock() {
        log.info("Fetching raw cashew inventory with stock");
        return inventoryRepository.findAllWithStock().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RawCashewInventoryDto> getInventoryByCashewType(Long cashewTypeId) {
        log.info("Fetching inventory for cashew type - [cashewTypeId={}]", cashewTypeId);
        return inventoryRepository.findByRawCashewCashewTypeId(cashewTypeId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RawCashewInventoryDto> getLowStockItems() {
        log.info("Fetching low stock raw cashew items");
        return inventoryRepository.findLowStockItems(LOW_STOCK_THRESHOLD).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RawCashewInventoryDto> searchInventory(String cashewType, String cashewQuality, String location) {
        log.info("Searching raw cashew inventory - [cashewType={}, cashewQuality={}, location={}]",
                cashewType, cashewQuality, location);
        // Convert null to empty string for native query compatibility
        String safeCashewType = cashewType != null ? cashewType : "";
        String safeCashewQuality = cashewQuality != null ? cashewQuality : "";
        String safeLocation = location != null ? location : "";
        return inventoryRepository.searchInventory(safeCashewType, safeCashewQuality, safeLocation).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RawCashewInventorySummaryDto getInventorySummary() {
        log.info("Generating raw cashew inventory summary");

        List<RawCashewInventory> allInventory = inventoryRepository.findAll();
        List<RawCashewInventory> lowStockItems = inventoryRepository.findLowStockItems(LOW_STOCK_THRESHOLD);

        long totalCashewTypes = allInventory.stream()
                .map(inv -> inv.getRawCashew().getCashewTypeId())
                .distinct()
                .count();

        long locationsCount = allInventory.stream()
                .map(RawCashewInventory::getLocation)
                .filter(loc -> loc != null)
                .distinct()
                .count();

        BigDecimal totalQuantity = allInventory.stream()
                .map(RawCashewInventory::getQuantityOnHand)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return RawCashewInventorySummaryDto.builder()
                .totalCashewTypes(totalCashewTypes)
                .lowStockItems((long) lowStockItems.size())
                .totalQuantityOnHand(totalQuantity)
                .locationsCount(locationsCount)
                .build();
    }

    @Transactional(readOnly = true)
    public List<RawCashewStockMovementDto> getStockMovements(Long cashewTypeId) {
        log.info("Fetching stock movements - [cashewTypeId={}]", cashewTypeId);

        if (cashewTypeId != null) {
            return movementRepository.findByRawCashewCashewTypeIdOrderByMovementDateDesc(cashewTypeId).stream()
                    .map(this::mapMovementToDto)
                    .collect(Collectors.toList());
        }

        return movementRepository.findAll().stream()
                .map(this::mapMovementToDto)
                .collect(Collectors.toList());
    }

    private RawCashewInventoryDto mapToDto(RawCashewInventory inventory) {
        return RawCashewInventoryDto.builder()
                .rawCashewInventoryId(inventory.getRawCashewInventoryId())
                .cashewTypeId(inventory.getRawCashew().getCashewTypeId())
                .cashewType(inventory.getRawCashew().getCashewType())
                .cashewQuality(inventory.getRawCashew().getCashewQuality())
                .location(inventory.getLocation())
                .quantityOnHand(inventory.getQuantityOnHand())
                .reservedQuantity(inventory.getReservedQuantity())
                .availableQuantity(inventory.getAvailableQuantity())
                .lastUpdated(inventory.getLastUpdated())
                .build();
    }

    private RawCashewStockMovementDto mapMovementToDto(RawCashewStockMovement movement) {
        return RawCashewStockMovementDto.builder()
                .movementId(movement.getMovementId())
                .cashewTypeId(movement.getRawCashew().getCashewTypeId())
                .cashewType(movement.getRawCashew().getCashewType())
                .cashewQuality(movement.getRawCashew().getCashewQuality())
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

