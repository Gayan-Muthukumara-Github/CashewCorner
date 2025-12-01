package com.example.cashewcorner.controller;

import com.example.cashewcorner.dto.*;
import com.example.cashewcorner.service.InventoryService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * REST Controller for inventory management endpoints.
 * Handles stock receiving, adjustments, and inventory tracking.
 */
@Slf4j
@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*", maxAge = 3600)
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    /**
     * Receive stock into inventory (from purchase orders).
     * Accessible by ADMIN and MANAGER roles.
     */
    @PostMapping("/receive")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<InventoryDto> receiveStock(@Valid @RequestBody ReceiveStockRequestDto request) {
        log.info("Stock receive request - [productId={}, quantity={}, location={}]", 
                request.getProductId(), request.getQuantity(), request.getLocation());
        InventoryDto inventory = inventoryService.receiveStock(request);
        return new ResponseEntity<>(inventory, HttpStatus.CREATED);
    }

    /**
     * Adjust stock levels (manual adjustments).
     * Accessible by ADMIN and MANAGER roles.
     */
    @PostMapping("/adjust")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<InventoryDto> adjustStock(@Valid @RequestBody AdjustStockRequestDto request) {
        log.info("Stock adjustment request - [productId={}, quantity={}, type={}]", 
                request.getProductId(), request.getQuantity(), request.getAdjustmentType());
        InventoryDto inventory = inventoryService.adjustStock(request);
        return ResponseEntity.ok(inventory);
    }

    /**
     * Get all inventory records.
     * Accessible by authenticated users.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<InventoryDto>> getAllInventory() {
        log.info("Fetching all inventory");
        List<InventoryDto> inventory = inventoryService.getAllInventory();
        return ResponseEntity.ok(inventory);
    }

    /**
     * Get inventory with available stock only.
     * Accessible by authenticated users.
     */
    @GetMapping("/available")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<InventoryDto>> getAvailableInventory() {
        log.info("Fetching available inventory");
        List<InventoryDto> inventory = inventoryService.getInventoryWithStock();
        return ResponseEntity.ok(inventory);
    }

    /**
     * Get low stock items (below reorder level).
     * Accessible by ADMIN and MANAGER roles.
     */
    @GetMapping("/low-stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<InventoryDto>> getLowStockItems() {
        log.info("Fetching low stock items");
        List<InventoryDto> inventory = inventoryService.getLowStockItems();
        return ResponseEntity.ok(inventory);
    }

    /**
     * Get inventory for a specific product.
     * Accessible by authenticated users.
     */
    @GetMapping("/product/{productId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<InventoryDto>> getInventoryByProduct(@PathVariable Long productId) {
        log.info("Fetching inventory for product - [productId={}]", productId);
        List<InventoryDto> inventory = inventoryService.getInventoryByProduct(productId);
        return ResponseEntity.ok(inventory);
    }

    /**
     * Get inventory for a specific location.
     * Accessible by authenticated users.
     */
    @GetMapping("/location/{location}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<InventoryDto>> getInventoryByLocation(@PathVariable String location) {
        log.info("Fetching inventory for location - [location={}]", location);
        List<InventoryDto> inventory = inventoryService.getInventoryByLocation(location);
        return ResponseEntity.ok(inventory);
    }

    /**
     * Search inventory by various criteria.
     * Accessible by authenticated users.
     */
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<InventoryDto>> searchInventory(
            @RequestParam(required = false) String variety,
            @RequestParam(required = false) Long supplierId,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String productName) {
        log.info("Searching inventory - [variety={}, supplierId={}, location={}, productName={}]", 
                variety, supplierId, location, productName);
        List<InventoryDto> inventory = inventoryService.searchInventory(variety, supplierId, location, productName);
        return ResponseEntity.ok(inventory);
    }

    /**
     * Get inventory summary for dashboard.
     * Accessible by ADMIN and MANAGER roles.
     */
    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<InventorySummaryDto> getInventorySummary() {
        log.info("Fetching inventory summary");
        InventorySummaryDto summary = inventoryService.getInventorySummary();
        return ResponseEntity.ok(summary);
    }

    /**
     * Get stock movements (history).
     * Accessible by ADMIN and MANAGER roles.
     */
    @GetMapping("/movements")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<StockMovementDto>> getStockMovements(
            @RequestParam(required = false) Long productId) {
        log.info("Fetching stock movements - [productId={}]", productId);
        List<StockMovementDto> movements = inventoryService.getStockMovements(productId);
        return ResponseEntity.ok(movements);
    }

    /**
     * Search stock movements by criteria.
     * Accessible by ADMIN and MANAGER roles.
     */
    @GetMapping("/movements/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<StockMovementDto>> searchStockMovements(
            @RequestParam(required = false) String productName,
            @RequestParam(required = false) String movementType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        log.info("Searching stock movements - [productName={}, movementType={}, startDate={}, endDate={}]", 
                productName, movementType, startDate, endDate);
        List<StockMovementDto> movements = inventoryService.searchStockMovements(productName, movementType, startDate, endDate);
        return ResponseEntity.ok(movements);
    }
}
