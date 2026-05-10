package com.example.cashewcorner.service;

import com.example.cashewcorner.dto.*;
import com.example.cashewcorner.entity.Customer;
import com.example.cashewcorner.entity.Product;
import com.example.cashewcorner.entity.SalesOrder;
import com.example.cashewcorner.entity.SalesOrderItem;
import com.example.cashewcorner.exception.ResourceNotFoundException;
import com.example.cashewcorner.repository.CustomerRepository;
import com.example.cashewcorner.repository.ProductRepository;
import com.example.cashewcorner.repository.SalesOrderRepository;
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
public class SalesOrderService {

    private final SalesOrderRepository salesOrderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    public SalesOrderService(SalesOrderRepository salesOrderRepository,
                            CustomerRepository customerRepository,
                            ProductRepository productRepository) {
        this.salesOrderRepository = salesOrderRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
    }

    public SalesOrderDto createSalesOrder(CreateSalesOrderRequestDto request) {
        log.info("Creating sales order - [customerId={}]", request.getCustomerId());

        Customer customer = customerRepository.findByCustomerIdAndIsActiveTrue(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + request.getCustomerId()));

        SalesOrder salesOrder = SalesOrder.builder()
                .soNumber(generateSoNumber())
                .customer(customer)
                .orderDate(request.getOrderDate())
                .deliveryDate(request.getDeliveryDate())
                .status("pending")
                .isActive(true)
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (SalesOrderItemRequestDto itemRequest : request.getItems()) {
            Product product = productRepository.findByProductIdAndIsActiveTrue(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemRequest.getProductId()));

            SalesOrderItem item = SalesOrderItem.builder()
                    .product(product)
                    .quantity(itemRequest.getQuantity())
                    .unitPrice(itemRequest.getUnitPrice())
                    .build();

            salesOrder.addItem(item);
            totalAmount = totalAmount.add(item.getLineTotal());
        }

        salesOrder.setTotalAmount(totalAmount);
        salesOrder = salesOrderRepository.save(salesOrder);

        log.info("Sales order created successfully - [soNumber={}, totalAmount={}]", 
                salesOrder.getSoNumber(), salesOrder.getTotalAmount());

        return mapToDto(salesOrder);
    }

    @Transactional(readOnly = true)
    public List<SalesOrderDto> getAllSalesOrders() {
        log.info("Fetching all active sales orders");
        return salesOrderRepository.findByIsActiveTrue().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SalesOrderDto getSalesOrderById(Long salesOrderId) {
        log.info("Fetching sales order - [salesOrderId={}]", salesOrderId);
        SalesOrder salesOrder = salesOrderRepository.findBySalesOrderIdAndIsActiveTrue(salesOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sales order not found with id: " + salesOrderId));
        return mapToDto(salesOrder);
    }

    @Transactional(readOnly = true)
    public List<SalesOrderDto> searchByOrderNumber(String orderNo) {
        log.info("Searching sales orders - [orderNo={}]", orderNo);
        return salesOrderRepository.searchByOrderNumber(orderNo).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private String generateSoNumber() {
        String year = String.valueOf(Year.now().getValue());
        String latestSoNumber = salesOrderRepository.findLatestSoNumberForYear(year);

        int nextNumber = 1;
        if (latestSoNumber != null) {
            String numberPart = latestSoNumber.substring(6);
            nextNumber = Integer.parseInt(numberPart) + 1;
        }

        return String.format("SO%s%04d", year, nextNumber);
    }

    private SalesOrderDto mapToDto(SalesOrder order) {
        return SalesOrderDto.builder()
                .salesOrderId(order.getSalesOrderId())
                .soNumber(order.getSoNumber())
                .customerId(order.getCustomer().getCustomerId())
                .customerName(order.getCustomer().getName())
                .orderDate(order.getOrderDate())
                .deliveryDate(order.getDeliveryDate())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .items(order.getItems().stream()
                        .map(item -> SalesOrderItemDto.builder()
                                .salesOrderItemId(item.getSalesOrderItemId())
                                .productId(item.getProduct().getProductId())
                                .productName(item.getProduct().getName())
                                .productSku(item.getProduct().getSku())
                                .quantity(item.getQuantity())
                                .unitPrice(item.getUnitPrice())
                                .lineTotal(item.getLineTotal())
                                .build())
                        .collect(Collectors.toList()))
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
