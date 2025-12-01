package com.example.cashewcorner.service;

import com.example.cashewcorner.dto.*;
import com.example.cashewcorner.entity.Product;
import com.example.cashewcorner.entity.PurchaseOrder;
import com.example.cashewcorner.entity.PurchaseOrderItem;
import com.example.cashewcorner.entity.Supplier;
import com.example.cashewcorner.exception.ResourceNotFoundException;
import com.example.cashewcorner.repository.ProductRepository;
import com.example.cashewcorner.repository.PurchaseOrderRepository;
import com.example.cashewcorner.repository.SupplierRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Year;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;

    public PurchaseOrderService(PurchaseOrderRepository purchaseOrderRepository,
                               SupplierRepository supplierRepository,
                               ProductRepository productRepository) {
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.supplierRepository = supplierRepository;
        this.productRepository = productRepository;
    }

    public PurchaseOrderDto createPurchaseOrder(CreatePurchaseOrderRequestDto request) {
        log.info("Creating purchase order - [supplierId={}]", request.getSupplierId());

        Supplier supplier = supplierRepository.findBySupplierIdAndIsActiveTrue(request.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + request.getSupplierId()));

        PurchaseOrder purchaseOrder = PurchaseOrder.builder()
                .poNumber(generatePoNumber())
                .supplier(supplier)
                .orderDate(request.getOrderDate())
                .expectedDate(request.getExpectedDate())
                .status("pending")
                .isActive(true)
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (PurchaseOrderItemRequestDto itemRequest : request.getItems()) {
            Product product = productRepository.findByProductIdAndIsActiveTrue(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemRequest.getProductId()));

            PurchaseOrderItem item = PurchaseOrderItem.builder()
                    .purchaseOrder(purchaseOrder)
                    .product(product)
                    .quantity(itemRequest.getQuantity())
                    .unitPrice(itemRequest.getUnitPrice())
                    .receivedQuantity(BigDecimal.ZERO)
                    .build();

            purchaseOrder.getItems().add(item);
            totalAmount = totalAmount.add(item.getLineTotal());
        }

        purchaseOrder.setTotalAmount(totalAmount);
        purchaseOrder = purchaseOrderRepository.save(purchaseOrder);

        log.info("Purchase order created successfully - [poNumber={}, totalAmount={}]", 
                purchaseOrder.getPoNumber(), purchaseOrder.getTotalAmount());

        return mapToDto(purchaseOrder);
    }

    @Transactional(readOnly = true)
    public List<PurchaseOrderDto> getAllPurchaseOrders() {
        log.info("Fetching all active purchase orders");
        return purchaseOrderRepository.findByIsActiveTrue().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PurchaseOrderDto getPurchaseOrderById(Long purchaseOrderId) {
        log.info("Fetching purchase order - [purchaseOrderId={}]", purchaseOrderId);
        PurchaseOrder purchaseOrder = purchaseOrderRepository.findByPurchaseOrderIdAndIsActiveTrue(purchaseOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase order not found with id: " + purchaseOrderId));
        return mapToDto(purchaseOrder);
    }

    @Transactional(readOnly = true)
    public List<PurchaseOrderDto> searchByOrderNumber(String orderNo) {
        log.info("Searching purchase orders - [orderNo={}]", orderNo);
        List<PurchaseOrder> orders = purchaseOrderRepository.findByIsActiveTrue().stream()
                .filter(po -> po.getPoNumber().toLowerCase().contains(orderNo.toLowerCase()))
                .collect(Collectors.toList());
        return orders.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private String generatePoNumber() {
        String year = String.valueOf(Year.now().getValue());
        String latestPoNumber = purchaseOrderRepository.findLatestPoNumberForYear(year);

        int nextNumber = 1;
        if (latestPoNumber != null) {
            String numberPart = latestPoNumber.substring(6);
            nextNumber = Integer.parseInt(numberPart) + 1;
        }

        return String.format("PO%s%04d", year, nextNumber);
    }

    private PurchaseOrderDto mapToDto(PurchaseOrder order) {
        return PurchaseOrderDto.builder()
                .purchaseOrderId(order.getPurchaseOrderId())
                .poNumber(order.getPoNumber())
                .supplierId(order.getSupplier().getSupplierId())
                .supplierName(order.getSupplier().getName())
                .orderDate(order.getOrderDate())
                .expectedDate(order.getExpectedDate())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .items(order.getItems().stream()
                        .map(item -> PurchaseOrderItemDto.builder()
                                .purchaseOrderItemId(item.getPurchaseOrderItemId())
                                .productId(item.getProduct().getProductId())
                                .productName(item.getProduct().getName())
                                .productSku(item.getProduct().getSku())
                                .quantity(item.getQuantity())
                                .unitPrice(item.getUnitPrice())
                                .lineTotal(item.getLineTotal())
                                .receivedQuantity(item.getReceivedQuantity())
                                .build())
                        .collect(Collectors.toList()))
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
