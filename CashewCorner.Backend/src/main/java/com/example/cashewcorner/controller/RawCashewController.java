package com.example.cashewcorner.controller;

import com.example.cashewcorner.dto.*;
import com.example.cashewcorner.service.RawCashewService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for raw cashew type management endpoints.
 * Handles raw cashew CRUD operations.
 */
@Slf4j
@RestController
@RequestMapping("/api/raw-cashew")
@CrossOrigin(origins = "*", maxAge = 3600)
public class RawCashewController {

    private final RawCashewService rawCashewService;

    public RawCashewController(RawCashewService rawCashewService) {
        this.rawCashewService = rawCashewService;
    }

    /**
     * Create a new raw cashew type.
     * Accessible by ADMIN and MANAGER roles.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<RawCashewDto> createRawCashew(@Valid @RequestBody CreateRawCashewRequestDto request) {
        log.info("Raw cashew creation request - [cashewType={}]", request.getCashewType());
        RawCashewDto rawCashew = rawCashewService.createRawCashew(request);
        return new ResponseEntity<>(rawCashew, HttpStatus.CREATED);
    }

    /**
     * Update raw cashew type information.
     * Accessible by ADMIN and MANAGER roles.
     */
    @PutMapping("/{cashewTypeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<RawCashewDto> updateRawCashew(@PathVariable Long cashewTypeId,
                                                         @Valid @RequestBody UpdateRawCashewRequestDto request) {
        log.info("Raw cashew update request - [cashewTypeId={}]", cashewTypeId);
        RawCashewDto rawCashew = rawCashewService.updateRawCashew(cashewTypeId, request);
        return ResponseEntity.ok(rawCashew);
    }

    /**
     * Delete (deactivate) a raw cashew type.
     * Only accessible by ADMIN role.
     */
    @DeleteMapping("/{cashewTypeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRawCashew(@PathVariable Long cashewTypeId) {
        log.info("Raw cashew deletion request - [cashewTypeId={}]", cashewTypeId);
        rawCashewService.deleteRawCashew(cashewTypeId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get all active raw cashew types.
     * Accessible by all authenticated users.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<RawCashewDto>> getAllRawCashews() {
        log.info("Fetching all raw cashews");
        List<RawCashewDto> rawCashews = rawCashewService.getAllRawCashews();
        return ResponseEntity.ok(rawCashews);
    }

    /**
     * Get raw cashew type by ID.
     * Accessible by all authenticated users.
     */
    @GetMapping("/{cashewTypeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<RawCashewDto> getRawCashewById(@PathVariable Long cashewTypeId) {
        log.info("Fetching raw cashew - [cashewTypeId={}]", cashewTypeId);
        RawCashewDto rawCashew = rawCashewService.getRawCashewById(cashewTypeId);
        return ResponseEntity.ok(rawCashew);
    }

    /**
     * Search raw cashew types by type and/or quality.
     * Accessible by all authenticated users.
     */
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<RawCashewDto>> searchRawCashews(
            @RequestParam(required = false) String cashewType,
            @RequestParam(required = false) String cashewQuality) {
        log.info("Searching raw cashews - [cashewType={}, cashewQuality={}]", cashewType, cashewQuality);
        List<RawCashewDto> rawCashews = rawCashewService.searchRawCashews(cashewType, cashewQuality);
        return ResponseEntity.ok(rawCashews);
    }
}

