package com.example.cashewcorner.service;

import com.example.cashewcorner.dto.*;
import com.example.cashewcorner.entity.PurchaseOrder;
import com.example.cashewcorner.entity.PurchaseOrderItem;
import com.example.cashewcorner.entity.RawCashew;
import com.example.cashewcorner.entity.Supplier;
import com.example.cashewcorner.exception.ResourceNotFoundException;
import com.example.cashewcorner.repository.PurchaseOrderRepository;
import com.example.cashewcorner.repository.RawCashewRepository;
import com.example.cashewcorner.repository.SupplierRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final RawCashewRepository rawCashewRepository;

    public SupplierService(SupplierRepository supplierRepository,
                          PurchaseOrderRepository purchaseOrderRepository,
                          RawCashewRepository rawCashewRepository) {
        this.supplierRepository = supplierRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.rawCashewRepository = rawCashewRepository;
    }

    public SupplierDto createSupplier(CreateSupplierRequestDto request) {
        log.info("Creating supplier - [name={}]", request.getName());

        Supplier supplier = Supplier.builder()
                .name(request.getName())
                .address(request.getAddress())
                .phone(request.getPhone())
                .email(request.getEmail())
                .contactPerson(request.getContactPerson())
                .paymentTerms(request.getPaymentTerms())
                .isApproved(false)
                .isActive(true)
                .quantity(request.getQuantity())
                .quality(request.getQuality())
                .costPerUnit(request.getCostPerUnit())
                .season(request.getSeason())
                .paymentMethod(request.getPaymentMethod())
                .distance(request.getDistance())
                .deliveryMethod(request.getDeliveryMethod())
                .deliveryCost(request.getDeliveryCost())
                .timeTakenToReceive(request.getTimeTakenToReceive())
                .averageCostPerUnit(request.getAverageCostPerUnit())
                .averageDeliveryTime(request.getAverageDeliveryTime())
                .averageDeliveryCost(request.getAverageDeliveryCost())
                .performances(request.getPerformances())
                .build();

        // Set cashew type if provided
        if (request.getCashewTypeId() != null) {
            RawCashew cashewType = rawCashewRepository.findByCashewTypeIdAndIsActiveTrue(request.getCashewTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Raw cashew type not found with id: " + request.getCashewTypeId()));
            supplier.setCashewType(cashewType);
        }

        supplier = supplierRepository.save(supplier);
        log.info("Supplier created successfully - [supplierId={}, name={}]",
                supplier.getSupplierId(), supplier.getName());

        return mapToDto(supplier);
    }

    public SupplierDto updateSupplier(Long supplierId, UpdateSupplierRequestDto request) {
        log.info("Updating supplier - [supplierId={}]", supplierId);

        Supplier supplier = supplierRepository.findBySupplierIdAndIsActiveTrue(supplierId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + supplierId));

        if (request.getName() != null) {
            supplier.setName(request.getName());
        }
        if (request.getAddress() != null) {
            supplier.setAddress(request.getAddress());
        }
        if (request.getPhone() != null) {
            supplier.setPhone(request.getPhone());
        }
        if (request.getEmail() != null) {
            supplier.setEmail(request.getEmail());
        }
        if (request.getContactPerson() != null) {
            supplier.setContactPerson(request.getContactPerson());
        }
        if (request.getPaymentTerms() != null) {
            supplier.setPaymentTerms(request.getPaymentTerms());
        }
        if (request.getIsApproved() != null) {
            supplier.setIsApproved(request.getIsApproved());
        }

        // Handle new cashew-related fields
        if (request.getCashewTypeId() != null) {
            RawCashew cashewType = rawCashewRepository.findByCashewTypeIdAndIsActiveTrue(request.getCashewTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Raw cashew type not found with id: " + request.getCashewTypeId()));
            supplier.setCashewType(cashewType);
        }
        if (request.getQuantity() != null) {
            supplier.setQuantity(request.getQuantity());
        }
        if (request.getQuality() != null) {
            supplier.setQuality(request.getQuality());
        }
        if (request.getCostPerUnit() != null) {
            supplier.setCostPerUnit(request.getCostPerUnit());
        }
        if (request.getSeason() != null) {
            supplier.setSeason(request.getSeason());
        }
        if (request.getPaymentMethod() != null) {
            supplier.setPaymentMethod(request.getPaymentMethod());
        }
        if (request.getDistance() != null) {
            supplier.setDistance(request.getDistance());
        }
        if (request.getDeliveryMethod() != null) {
            supplier.setDeliveryMethod(request.getDeliveryMethod());
        }
        if (request.getDeliveryCost() != null) {
            supplier.setDeliveryCost(request.getDeliveryCost());
        }
        if (request.getTimeTakenToReceive() != null) {
            supplier.setTimeTakenToReceive(request.getTimeTakenToReceive());
        }
        if (request.getAverageCostPerUnit() != null) {
            supplier.setAverageCostPerUnit(request.getAverageCostPerUnit());
        }
        if (request.getAverageDeliveryTime() != null) {
            supplier.setAverageDeliveryTime(request.getAverageDeliveryTime());
        }
        if (request.getAverageDeliveryCost() != null) {
            supplier.setAverageDeliveryCost(request.getAverageDeliveryCost());
        }
        if (request.getPerformances() != null) {
            supplier.setPerformances(request.getPerformances());
        }

        supplier = supplierRepository.save(supplier);
        log.info("Supplier updated successfully - [supplierId={}]", supplierId);

        return mapToDto(supplier);
    }

    public void deleteSupplier(Long supplierId) {
        log.info("Deleting supplier - [supplierId={}]", supplierId);

        Supplier supplier = supplierRepository.findBySupplierIdAndIsActiveTrue(supplierId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + supplierId));

        supplier.setIsActive(false);
        supplierRepository.save(supplier);

        log.info("Supplier deleted successfully - [supplierId={}]", supplierId);
    }

    @Transactional(readOnly = true)
    public List<SupplierDto> getAllSuppliers() {
        log.info("Fetching all active suppliers");
        return supplierRepository.findByIsActiveTrue().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SupplierDto getSupplierById(Long supplierId) {
        log.info("Fetching supplier - [supplierId={}]", supplierId);
        Supplier supplier = supplierRepository.findBySupplierIdAndIsActiveTrue(supplierId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + supplierId));
        return mapToDto(supplier);
    }

    @Transactional(readOnly = true)
    public List<SupplierDto> searchSuppliers(String searchTerm) {
        log.info("Searching suppliers - [searchTerm={}]", searchTerm);
        return supplierRepository.searchSuppliers(searchTerm).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SupplierDto> getApprovedSuppliers() {
        log.info("Fetching approved suppliers");
        return supplierRepository.findApprovedSuppliers().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SupplierDto> advancedSearchSuppliers(
            String name, String address, String phone, String email,
            String contactPerson, String paymentTerms, String quality,
            String season, String paymentMethod, String deliveryMethod,
            String performances, Long cashewTypeId, Boolean isApproved,
            BigDecimal minQuantity, BigDecimal maxQuantity,
            BigDecimal minCostPerUnit, BigDecimal maxCostPerUnit,
            BigDecimal minDistance, BigDecimal maxDistance,
            BigDecimal minDeliveryCost, BigDecimal maxDeliveryCost,
            Integer minTimeTakenToReceive, Integer maxTimeTakenToReceive,
            BigDecimal minAverageCostPerUnit, BigDecimal maxAverageCostPerUnit,
            Integer minAverageDeliveryTime, Integer maxAverageDeliveryTime,
            BigDecimal minAverageDeliveryCost, BigDecimal maxAverageDeliveryCost) {

        log.info("Advanced supplier search - [name={}, cashewTypeId={}, isApproved={}]",
                 name, cashewTypeId, isApproved);

        // Convert null string parameters to empty strings for native query compatibility
        return supplierRepository.advancedSearch(
                name != null ? name.trim() : "",
                address != null ? address.trim() : "",
                phone != null ? phone.trim() : "",
                email != null ? email.trim() : "",
                contactPerson != null ? contactPerson.trim() : "",
                paymentTerms != null ? paymentTerms.trim() : "",
                quality != null ? quality.trim() : "",
                season != null ? season.trim() : "",
                paymentMethod != null ? paymentMethod.trim() : "",
                deliveryMethod != null ? deliveryMethod.trim() : "",
                performances != null ? performances.trim() : "",
                cashewTypeId, isApproved,
                minQuantity, maxQuantity, minCostPerUnit, maxCostPerUnit,
                minDistance, maxDistance, minDeliveryCost, maxDeliveryCost,
                minTimeTakenToReceive, maxTimeTakenToReceive,
                minAverageCostPerUnit, maxAverageCostPerUnit,
                minAverageDeliveryTime, maxAverageDeliveryTime,
                minAverageDeliveryCost, maxAverageDeliveryCost
        ).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PurchaseOrderDto> getSupplierOrders(Long supplierId) {
        log.info("Fetching purchase orders for supplier - [supplierId={}]", supplierId);

        // Verify supplier exists
        supplierRepository.findBySupplierIdAndIsActiveTrue(supplierId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + supplierId));

        List<PurchaseOrder> orders = purchaseOrderRepository.findBySupplierIdAndIsActiveTrue(supplierId);

        log.info("Found {} purchase orders for supplier - [supplierId={}]", orders.size(), supplierId);

        return orders.stream()
                .map(this::mapToPurchaseOrderDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SupplierRankingDto> getSupplierRanking(String cashewType, BigDecimal quantity) {
        log.info("Calculating supplier ranking - [cashewType={}, quantity={}]", cashewType, quantity);

        List<Supplier> approvedSuppliers = supplierRepository.findApprovedSuppliers();

        List<SupplierRankingDto> rankings = new ArrayList<>();

        for (Supplier supplier : approvedSuppliers) {
            List<PurchaseOrder> orders = purchaseOrderRepository.findBySupplierIdAndIsActiveTrue(supplier.getSupplierId());

            if (orders.isEmpty()) {
                continue;
            }

            // Calculate metrics
            BigDecimal totalPurchaseAmount = orders.stream()
                    .map(PurchaseOrder::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            int totalOrders = orders.size();
            int completedOrders = (int) orders.stream()
                    .filter(po -> "completed".equalsIgnoreCase(po.getStatus()))
                    .count();

            // Calculate average unit price for the specific cashew type if provided
            BigDecimal averageUnitPrice = calculateAverageUnitPrice(orders, cashewType);

            // Calculate reliability score (percentage of completed orders)
            BigDecimal reliabilityScore = totalOrders > 0
                    ? BigDecimal.valueOf(completedOrders)
                            .divide(BigDecimal.valueOf(totalOrders), 4, RoundingMode.HALF_UP)
                            .multiply(BigDecimal.valueOf(100))
                    : BigDecimal.ZERO;

            SupplierRankingDto ranking = SupplierRankingDto.builder()
                    .supplierId(supplier.getSupplierId())
                    .name(supplier.getName())
                    .contactPerson(supplier.getContactPerson())
                    .phone(supplier.getPhone())
                    .email(supplier.getEmail())
                    .averageUnitPrice(averageUnitPrice)
                    .totalOrders(totalOrders)
                    .completedOrders(completedOrders)
                    .reliabilityScore(reliabilityScore)
                    .totalPurchaseAmount(totalPurchaseAmount)
                    .build();

            rankings.add(ranking);
        }

        // Sort by reliability score (descending) and then by average unit price (ascending)
        rankings.sort(Comparator
                .comparing(SupplierRankingDto::getReliabilityScore, Comparator.reverseOrder())
                .thenComparing(SupplierRankingDto::getAverageUnitPrice, Comparator.nullsLast(Comparator.naturalOrder())));

        // Assign ranks
        for (int i = 0; i < rankings.size(); i++) {
            rankings.get(i).setRank(i + 1);
        }

        log.info("Supplier ranking calculated - [totalSuppliers={}]", rankings.size());

        return rankings;
    }

    private BigDecimal calculateAverageUnitPrice(List<PurchaseOrder> orders, String cashewType) {
        List<BigDecimal> prices = new ArrayList<>();

        for (PurchaseOrder order : orders) {
            for (PurchaseOrderItem item : order.getItems()) {
                // If cashewType is specified, filter by raw cashew type name
                if (cashewType == null || cashewType.isEmpty() ||
                    item.getRawCashew().getCashewType().toUpperCase().contains(cashewType.toUpperCase())) {
                    prices.add(item.getUnitPrice());
                }
            }
        }

        if (prices.isEmpty()) {
            return null;
        }

        BigDecimal sum = prices.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        return sum.divide(BigDecimal.valueOf(prices.size()), 2, RoundingMode.HALF_UP);
    }

    private SupplierDto mapToDto(Supplier supplier) {
        return SupplierDto.builder()
                .supplierId(supplier.getSupplierId())
                .name(supplier.getName())
                .address(supplier.getAddress())
                .phone(supplier.getPhone())
                .email(supplier.getEmail())
                .contactPerson(supplier.getContactPerson())
                .paymentTerms(supplier.getPaymentTerms())
                .isApproved(supplier.getIsApproved())
                .isActive(supplier.getIsActive())
                .createdAt(supplier.getCreatedAt())
                .updatedAt(supplier.getUpdatedAt())
                // New cashew-related fields
                .cashewTypeId(supplier.getCashewType() != null ? supplier.getCashewType().getCashewTypeId() : null)
                .cashewTypeName(supplier.getCashewType() != null ? supplier.getCashewType().getCashewType() : null)
                .quantity(supplier.getQuantity())
                .quality(supplier.getQuality())
                .costPerUnit(supplier.getCostPerUnit())
                .season(supplier.getSeason())
                .paymentMethod(supplier.getPaymentMethod())
                .distance(supplier.getDistance())
                .deliveryMethod(supplier.getDeliveryMethod())
                .deliveryCost(supplier.getDeliveryCost())
                .timeTakenToReceive(supplier.getTimeTakenToReceive())
                .averageCostPerUnit(supplier.getAverageCostPerUnit())
                .averageDeliveryTime(supplier.getAverageDeliveryTime())
                .averageDeliveryCost(supplier.getAverageDeliveryCost())
                .performances(supplier.getPerformances())
                .build();
    }

    private PurchaseOrderDto mapToPurchaseOrderDto(PurchaseOrder purchaseOrder) {
        List<PurchaseOrderItemDto> itemDtos = purchaseOrder.getItems().stream()
                .map(this::mapToPurchaseOrderItemDto)
                .collect(Collectors.toList());

        return PurchaseOrderDto.builder()
                .purchaseOrderId(purchaseOrder.getPurchaseOrderId())
                .poNumber(purchaseOrder.getPoNumber())
                .supplierId(purchaseOrder.getSupplier().getSupplierId())
                .supplierName(purchaseOrder.getSupplier().getName())
                .orderDate(purchaseOrder.getOrderDate())
                .expectedDate(purchaseOrder.getExpectedDate())
                .status(purchaseOrder.getStatus())
                .totalAmount(purchaseOrder.getTotalAmount())
                .items(itemDtos)
                .createdAt(purchaseOrder.getCreatedAt())
                .updatedAt(purchaseOrder.getUpdatedAt())
                .build();
    }

    private PurchaseOrderItemDto mapToPurchaseOrderItemDto(PurchaseOrderItem item) {
        return PurchaseOrderItemDto.builder()
                .purchaseOrderItemId(item.getPurchaseOrderItemId())
                .cashewTypeId(item.getRawCashew().getCashewTypeId())
                .cashewType(item.getRawCashew().getCashewType())
                .cashewQuality(item.getRawCashew().getCashewQuality())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .lineTotal(item.getLineTotal())
                .receivedQuantity(item.getReceivedQuantity())
                .build();
    }
}
