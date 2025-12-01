package com.example.cashewcorner.controller;

import com.example.cashewcorner.dto.CreatePurchaseOrderRequestDto;
import com.example.cashewcorner.dto.PurchaseOrderDto;
import com.example.cashewcorner.service.PurchaseOrderService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for purchase order management endpoints.
 * Handles purchase order CRUD operations and purchase order-related queries.
 */
@Slf4j
@RestController
@RequestMapping("/api/purchase-orders")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    public PurchaseOrderController(PurchaseOrderService purchaseOrderService) {
        this.purchaseOrderService = purchaseOrderService;
    }

    /**
     * Create a new purchase order.
     * Accessible by ADMIN and MANAGER roles.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<PurchaseOrderDto> createPurchaseOrder(@Valid @RequestBody CreatePurchaseOrderRequestDto request) {
        log.info("Purchase order creation request - [supplierId={}]", request.getSupplierId());
        PurchaseOrderDto purchaseOrder = purchaseOrderService.createPurchaseOrder(request);
        return new ResponseEntity<>(purchaseOrder, HttpStatus.CREATED);
    }

    /**
     * Get all active purchase orders.
     * Accessible by authenticated users.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<PurchaseOrderDto>> getAllPurchaseOrders() {
        log.info("Fetching all purchase orders");
        List<PurchaseOrderDto> purchaseOrders = purchaseOrderService.getAllPurchaseOrders();
        return ResponseEntity.ok(purchaseOrders);
    }

    /**
     * Get purchase order by ID.
     * Accessible by authenticated users.
     */
    @GetMapping("/{purchaseOrderId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<PurchaseOrderDto> getPurchaseOrderById(@PathVariable Long purchaseOrderId) {
        log.info("Fetching purchase order - [purchaseOrderId={}]", purchaseOrderId);
        PurchaseOrderDto purchaseOrder = purchaseOrderService.getPurchaseOrderById(purchaseOrderId);
        return ResponseEntity.ok(purchaseOrder);
    }

    /**
     * Search purchase orders by order number.
     * Accessible by authenticated users.
     */
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<PurchaseOrderDto>> searchPurchaseOrders(@RequestParam String orderNo) {
        log.info("Searching purchase orders - [orderNo={}]", orderNo);
        List<PurchaseOrderDto> purchaseOrders = purchaseOrderService.searchByOrderNumber(orderNo);
        return ResponseEntity.ok(purchaseOrders);
    }
}
