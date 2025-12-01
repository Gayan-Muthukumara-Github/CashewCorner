package com.example.cashewcorner.controller;

import com.example.cashewcorner.dto.*;
import com.example.cashewcorner.service.SupplierService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * REST Controller for supplier management endpoints.
 * Handles supplier CRUD operations and supplier-related queries.
 */
@Slf4j
@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    /**
     * Create a new supplier.
     * Accessible by ADMIN and MANAGER roles.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<SupplierDto> createSupplier(@Valid @RequestBody CreateSupplierRequestDto request) {
        log.info("Supplier creation request - [name={}]", request.getName());
        SupplierDto supplier = supplierService.createSupplier(request);
        return new ResponseEntity<>(supplier, HttpStatus.CREATED);
    }

    /**
     * Update supplier information.
     * Accessible by ADMIN and MANAGER roles.
     */
    @PutMapping("/{supplierId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<SupplierDto> updateSupplier(@PathVariable Long supplierId,
                                                      @Valid @RequestBody UpdateSupplierRequestDto request) {
        log.info("Supplier update request - [supplierId={}]", supplierId);
        SupplierDto supplier = supplierService.updateSupplier(supplierId, request);
        return ResponseEntity.ok(supplier);
    }

    /**
     * Delete (deactivate) a supplier.
     * Only accessible by ADMIN role.
     */
    @DeleteMapping("/{supplierId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long supplierId) {
        log.info("Supplier deletion request - [supplierId={}]", supplierId);
        supplierService.deleteSupplier(supplierId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get all active suppliers.
     * Accessible by authenticated users.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<SupplierDto>> getAllSuppliers() {
        log.info("Fetching all suppliers");
        List<SupplierDto> suppliers = supplierService.getAllSuppliers();
        return ResponseEntity.ok(suppliers);
    }

    /**
     * Get supplier by ID.
     * Accessible by authenticated users.
     */
    @GetMapping("/{supplierId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<SupplierDto> getSupplierById(@PathVariable Long supplierId) {
        log.info("Fetching supplier - [supplierId={}]", supplierId);
        SupplierDto supplier = supplierService.getSupplierById(supplierId);
        return ResponseEntity.ok(supplier);
    }

    /**
     * Search suppliers by name or phone.
     * Accessible by authenticated users.
     */
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<SupplierDto>> searchSuppliers(@RequestParam String name) {
        log.info("Searching suppliers - [name={}]", name);
        List<SupplierDto> suppliers = supplierService.searchSuppliers(name);
        return ResponseEntity.ok(suppliers);
    }

    /**
     * Get approved suppliers only.
     * Accessible by authenticated users.
     */
    @GetMapping("/approved")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<SupplierDto>> getApprovedSuppliers() {
        log.info("Fetching approved suppliers");
        List<SupplierDto> suppliers = supplierService.getApprovedSuppliers();
        return ResponseEntity.ok(suppliers);
    }

    /**
     * Get all purchase orders for a specific supplier.
     * Accessible by authenticated users.
     */
    @GetMapping("/{supplierId}/orders")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<PurchaseOrderDto>> getSupplierOrders(@PathVariable Long supplierId) {
        log.info("Fetching purchase orders for supplier - [supplierId={}]", supplierId);
        List<PurchaseOrderDto> orders = supplierService.getSupplierOrders(supplierId);
        return ResponseEntity.ok(orders);
    }

    /**
     * Get supplier ranking by cost and reliability.
     * Accessible by authenticated users.
     *
     * @param cashewType Optional filter by cashew type (e.g., W320, W240)
     * @param quantity Optional quantity parameter (for future use)
     */
    @GetMapping("/ranking")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<SupplierRankingDto>> getSupplierRanking(
            @RequestParam(required = false) String cashewType,
            @RequestParam(required = false) BigDecimal quantity) {
        log.info("Fetching supplier ranking - [cashewType={}, quantity={}]", cashewType, quantity);
        List<SupplierRankingDto> rankings = supplierService.getSupplierRanking(cashewType, quantity);
        return ResponseEntity.ok(rankings);
    }
}
