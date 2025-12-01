package com.example.cashewcorner.controller;

import com.example.cashewcorner.dto.*;
import com.example.cashewcorner.service.CustomerService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for customer management endpoints.
 * Handles customer CRUD operations.
 */
@Slf4j
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    /**
     * Create a new customer.
     * Accessible by ADMIN and MANAGER roles.
     */
    @PostMapping("/customers")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<CustomerDto> createCustomer(@Valid @RequestBody CreateCustomerRequestDto request) {
        log.info("Customer creation request - [name={}]", request.getName());
        CustomerDto customer = customerService.createCustomer(request);
        return new ResponseEntity<>(customer, HttpStatus.CREATED);
    }

    /**
     * Update customer information.
     * Accessible by ADMIN and MANAGER roles.
     */
    @PutMapping("/customers/{customerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<CustomerDto> updateCustomer(@PathVariable Long customerId, 
                                                      @Valid @RequestBody UpdateCustomerRequestDto request) {
        log.info("Customer update request - [customerId={}]", customerId);
        CustomerDto customer = customerService.updateCustomer(customerId, request);
        return ResponseEntity.ok(customer);
    }

    /**
     * Delete (deactivate) a customer.
     * Only accessible by ADMIN role.
     */
    @DeleteMapping("/customers/{customerId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long customerId) {
        log.info("Customer deletion request - [customerId={}]", customerId);
        customerService.deleteCustomer(customerId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get all active customers.
     * Accessible by all authenticated users.
     */
    @GetMapping("/customers")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<CustomerDto>> getAllCustomers() {
        log.info("Fetching all customers");
        List<CustomerDto> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(customers);
    }

    /**
     * Get customer by ID.
     * Accessible by all authenticated users.
     */
    @GetMapping("/customers/{customerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<CustomerDto> getCustomerById(@PathVariable Long customerId) {
        log.info("Fetching customer - [customerId={}]", customerId);
        CustomerDto customer = customerService.getCustomerById(customerId);
        return ResponseEntity.ok(customer);
    }

    /**
     * Search customers by name or phone.
     * Accessible by all authenticated users.
     */
    @GetMapping("/customers/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<CustomerDto>> searchCustomers(@RequestParam String name) {
        log.info("Searching customers - [name={}]", name);
        List<CustomerDto> customers = customerService.searchCustomers(name);
        return ResponseEntity.ok(customers);
    }

    /**
     * Get all orders for a specific customer.
     * Accessible by all authenticated users.
     */
    @GetMapping("/customers/{customerId}/orders")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<SalesOrderDto>> getCustomerOrders(@PathVariable Long customerId) {
        log.info("Fetching customer orders - [customerId={}]", customerId);
        List<SalesOrderDto> orders = customerService.getCustomerOrders(customerId);
        return ResponseEntity.ok(orders);
    }

    /**
     * Get order status for a specific customer.
     * Accessible by all authenticated users.
     */
    @GetMapping("/customers/{customerId}/orders/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<OrderStatusDto>> getCustomerOrderStatus(@PathVariable Long customerId) {
        log.info("Fetching customer order status - [customerId={}]", customerId);
        List<OrderStatusDto> statuses = customerService.getCustomerOrderStatus(customerId);
        return ResponseEntity.ok(statuses);
    }
}
