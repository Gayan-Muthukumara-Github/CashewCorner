package com.example.cashewcorner.controller;

import com.example.cashewcorner.dto.*;
import com.example.cashewcorner.service.RawCashewInventoryService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for raw cashew inventory management endpoints.
 * Handles stock receiving, adjustments, and inventory tracking for raw cashews.
 */
@Slf4j
@RestController
@RequestMapping("/api/raw-cashew-inventory")
@CrossOrigin(origins = "*", maxAge = 3600)
public class RawCashewInventoryController {

    private final RawCashewInventoryService inventoryService;

    public RawCashewInventoryController(RawCashewInventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    /**
     * Receive raw cashew stock into inventory (from purchase orders).
     * Accessible by ADMIN and MANAGER roles.
     */
    @PostMapping("/receive")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<RawCashewInventoryDto> receiveStock(@Valid @RequestBody ReceiveRawCashewStockRequestDto request) {
        log.info("Raw cashew stock receive request - [cashewTypeId={}, quantity={}, location={}]",
                request.getCashewTypeId(), request.getQuantity(), request.getLocation());
        RawCashewInventoryDto inventory = inventoryService.receiveStock(request);
        return new ResponseEntity<>(inventory, HttpStatus.CREATED);
    }

    /**
     * Adjust raw cashew stock (add, remove, usage, damage, correction).
     * Accessible by ADMIN and MANAGER roles.
     */
    @PostMapping("/adjust")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<RawCashewInventoryDto> adjustStock(@Valid @RequestBody AdjustRawCashewStockRequestDto request) {
        log.info("Raw cashew stock adjustment request - [cashewTypeId={}, quantity={}, type={}]",
                request.getCashewTypeId(), request.getQuantity(), request.getAdjustmentType());
        RawCashewInventoryDto inventory = inventoryService.adjustStock(request);
        return ResponseEntity.ok(inventory);
    }

    /**
     * Get all raw cashew inventory records.
     * Accessible by authenticated users.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<RawCashewInventoryDto>> getAllInventory() {
        log.info("Fetching all raw cashew inventory");
        List<RawCashewInventoryDto> inventory = inventoryService.getAllInventory();
        return ResponseEntity.ok(inventory);
    }

    /**
     * Get raw cashew inventory with available stock only.
     * Accessible by authenticated users.
     */
    @GetMapping("/available")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<RawCashewInventoryDto>> getAvailableInventory() {
        log.info("Fetching available raw cashew inventory");
        List<RawCashewInventoryDto> inventory = inventoryService.getInventoryWithStock();
        return ResponseEntity.ok(inventory);
    }

    /**
     * Get low stock raw cashew items.
     * Accessible by authenticated users.
     */
    @GetMapping("/low-stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<RawCashewInventoryDto>> getLowStockItems() {
        log.info("Fetching low stock raw cashew items");
        List<RawCashewInventoryDto> inventory = inventoryService.getLowStockItems();
        return ResponseEntity.ok(inventory);
    }

    /**
     * Get inventory for a specific raw cashew type.
     * Accessible by authenticated users.
     */
    @GetMapping("/cashew-type/{cashewTypeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<RawCashewInventoryDto>> getInventoryByCashewType(@PathVariable Long cashewTypeId) {
        log.info("Fetching inventory for cashew type - [cashewTypeId={}]", cashewTypeId);
        List<RawCashewInventoryDto> inventory = inventoryService.getInventoryByCashewType(cashewTypeId);
        return ResponseEntity.ok(inventory);
    }

    /**
     * Get raw cashew inventory summary.
     * Accessible by authenticated users.
     */
    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<RawCashewInventorySummaryDto> getInventorySummary() {
        log.info("Fetching raw cashew inventory summary");
        RawCashewInventorySummaryDto summary = inventoryService.getInventorySummary();
        return ResponseEntity.ok(summary);
    }

    /**
     * Search raw cashew inventory by various criteria.
     * Accessible by authenticated users.
     */
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<RawCashewInventoryDto>> searchInventory(
            @RequestParam(required = false) String cashewType,
            @RequestParam(required = false) String cashewQuality,
            @RequestParam(required = false) String location) {
        log.info("Searching raw cashew inventory - [cashewType={}, cashewQuality={}, location={}]",
                cashewType, cashewQuality, location);
        List<RawCashewInventoryDto> inventory = inventoryService.searchInventory(cashewType, cashewQuality, location);
        return ResponseEntity.ok(inventory);
    }

    /**
     * Get stock movements for raw cashews.
     * Accessible by authenticated users.
     */
    @GetMapping("/movements")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<RawCashewStockMovementDto>> getStockMovements(
            @RequestParam(required = false) Long cashewTypeId) {
        log.info("Fetching raw cashew stock movements - [cashewTypeId={}]", cashewTypeId);
        List<RawCashewStockMovementDto> movements = inventoryService.getStockMovements(cashewTypeId);
        return ResponseEntity.ok(movements);
    }
}

