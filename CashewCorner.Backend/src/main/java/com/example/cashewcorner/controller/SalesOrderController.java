package com.example.cashewcorner.controller;

import com.example.cashewcorner.dto.CreateSalesOrderRequestDto;
import com.example.cashewcorner.dto.SalesOrderDto;
import com.example.cashewcorner.service.SalesOrderService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for sales order management endpoints.
 * Handles sales order CRUD operations and sales order-related queries.
 */
@Slf4j
@RestController
@RequestMapping("/api/sales-orders")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SalesOrderController {

    private final SalesOrderService salesOrderService;

    public SalesOrderController(SalesOrderService salesOrderService) {
        this.salesOrderService = salesOrderService;
    }

    /**
     * Create a new sales order.
     * Accessible by ADMIN and MANAGER roles.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<SalesOrderDto> createSalesOrder(@Valid @RequestBody CreateSalesOrderRequestDto request) {
        log.info("Sales order creation request - [customerId={}]", request.getCustomerId());
        SalesOrderDto salesOrder = salesOrderService.createSalesOrder(request);
        return new ResponseEntity<>(salesOrder, HttpStatus.CREATED);
    }

    /**
     * Get all active sales orders.
     * Accessible by authenticated users.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<SalesOrderDto>> getAllSalesOrders() {
        log.info("Fetching all sales orders");
        List<SalesOrderDto> salesOrders = salesOrderService.getAllSalesOrders();
        return ResponseEntity.ok(salesOrders);
    }

    /**
     * Get sales order by ID.
     * Accessible by authenticated users.
     */
    @GetMapping("/{salesOrderId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<SalesOrderDto> getSalesOrderById(@PathVariable Long salesOrderId) {
        log.info("Fetching sales order - [salesOrderId={}]", salesOrderId);
        SalesOrderDto salesOrder = salesOrderService.getSalesOrderById(salesOrderId);
        return ResponseEntity.ok(salesOrder);
    }

    /**
     * Search sales orders by order number.
     * Accessible by authenticated users.
     */
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<SalesOrderDto>> searchSalesOrders(@RequestParam String orderNo) {
        log.info("Searching sales orders - [orderNo={}]", orderNo);
        List<SalesOrderDto> salesOrders = salesOrderService.searchByOrderNumber(orderNo);
        return ResponseEntity.ok(salesOrders);
    }
}
