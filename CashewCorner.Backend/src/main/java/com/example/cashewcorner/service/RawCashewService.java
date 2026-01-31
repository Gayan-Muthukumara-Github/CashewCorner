package com.example.cashewcorner.service;

import com.example.cashewcorner.dto.*;
import com.example.cashewcorner.entity.RawCashew;
import com.example.cashewcorner.exception.DuplicateResourceException;
import com.example.cashewcorner.exception.ResourceNotFoundException;
import com.example.cashewcorner.repository.RawCashewRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class RawCashewService {

    private final RawCashewRepository rawCashewRepository;

    public RawCashewService(RawCashewRepository rawCashewRepository) {
        this.rawCashewRepository = rawCashewRepository;
    }

    public RawCashewDto createRawCashew(CreateRawCashewRequestDto request) {
        log.info("Creating raw cashew - [cashewType={}]", request.getCashewType());

        // Check for duplicate cashew type
        rawCashewRepository.findByCashewTypeAndIsActiveTrue(request.getCashewType()).ifPresent(r -> {
            throw new DuplicateResourceException("Raw cashew with type " + request.getCashewType() + " already exists");
        });

        RawCashew rawCashew = RawCashew.builder()
                .cashewType(request.getCashewType())
                .cashewQuality(request.getCashewQuality())
                .isActive(true)
                .build();

        rawCashew = rawCashewRepository.save(rawCashew);
        log.info("Raw cashew created successfully - [cashewTypeId={}, cashewType={}]", 
                rawCashew.getCashewTypeId(), rawCashew.getCashewType());

        return mapToDto(rawCashew);
    }

    public RawCashewDto updateRawCashew(Long cashewTypeId, UpdateRawCashewRequestDto request) {
        log.info("Updating raw cashew - [cashewTypeId={}]", cashewTypeId);

        RawCashew rawCashew = rawCashewRepository.findByCashewTypeIdAndIsActiveTrue(cashewTypeId)
                .orElseThrow(() -> new ResourceNotFoundException("Raw cashew not found with id: " + cashewTypeId));

        if (request.getCashewType() != null) {
            // Check for duplicate if changing type
            rawCashewRepository.findByCashewTypeAndIsActiveTrue(request.getCashewType()).ifPresent(r -> {
                if (!r.getCashewTypeId().equals(cashewTypeId)) {
                    throw new DuplicateResourceException("Raw cashew with type " + request.getCashewType() + " already exists");
                }
            });
            rawCashew.setCashewType(request.getCashewType());
        }
        if (request.getCashewQuality() != null) {
            rawCashew.setCashewQuality(request.getCashewQuality());
        }

        rawCashew = rawCashewRepository.save(rawCashew);
        log.info("Raw cashew updated successfully - [cashewTypeId={}]", cashewTypeId);

        return mapToDto(rawCashew);
    }

    public void deleteRawCashew(Long cashewTypeId) {
        log.info("Deleting raw cashew - [cashewTypeId={}]", cashewTypeId);

        RawCashew rawCashew = rawCashewRepository.findByCashewTypeIdAndIsActiveTrue(cashewTypeId)
                .orElseThrow(() -> new ResourceNotFoundException("Raw cashew not found with id: " + cashewTypeId));

        rawCashew.setIsActive(false);
        rawCashewRepository.save(rawCashew);

        log.info("Raw cashew deleted successfully - [cashewTypeId={}]", cashewTypeId);
    }

    @Transactional(readOnly = true)
    public List<RawCashewDto> getAllRawCashews() {
        log.info("Fetching all active raw cashews");
        return rawCashewRepository.findByIsActiveTrue().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RawCashewDto getRawCashewById(Long cashewTypeId) {
        log.info("Fetching raw cashew - [cashewTypeId={}]", cashewTypeId);
        RawCashew rawCashew = rawCashewRepository.findByCashewTypeIdAndIsActiveTrue(cashewTypeId)
                .orElseThrow(() -> new ResourceNotFoundException("Raw cashew not found with id: " + cashewTypeId));
        return mapToDto(rawCashew);
    }

    @Transactional(readOnly = true)
    public List<RawCashewDto> searchRawCashews(String cashewType, String cashewQuality) {
        log.info("Searching raw cashews - [cashewType={}, cashewQuality={}]", cashewType, cashewQuality);
        // Convert null to empty string for proper JPQL handling
        String typeParam = cashewType != null ? cashewType.trim() : "";
        String qualityParam = cashewQuality != null ? cashewQuality.trim() : "";
        return rawCashewRepository.searchRawCashew(typeParam, qualityParam).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private RawCashewDto mapToDto(RawCashew rawCashew) {
        return RawCashewDto.builder()
                .cashewTypeId(rawCashew.getCashewTypeId())
                .cashewType(rawCashew.getCashewType())
                .cashewQuality(rawCashew.getCashewQuality())
                .isActive(rawCashew.getIsActive())
                .createdAt(rawCashew.getCreatedAt())
                .updatedAt(rawCashew.getUpdatedAt())
                .build();
    }
}

