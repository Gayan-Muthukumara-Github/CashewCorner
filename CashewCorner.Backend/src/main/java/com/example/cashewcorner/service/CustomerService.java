package com.example.cashewcorner.service;

import com.example.cashewcorner.dto.*;
import com.example.cashewcorner.entity.Customer;
import com.example.cashewcorner.entity.SalesOrder;
import com.example.cashewcorner.exception.DuplicateResourceException;
import com.example.cashewcorner.exception.ResourceNotFoundException;
import com.example.cashewcorner.repository.CustomerRepository;
import com.example.cashewcorner.repository.SalesOrderRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final SalesOrderRepository salesOrderRepository;

    public CustomerService(CustomerRepository customerRepository,
                          SalesOrderRepository salesOrderRepository) {
        this.customerRepository = customerRepository;
        this.salesOrderRepository = salesOrderRepository;
    }

    public CustomerDto createCustomer(CreateCustomerRequestDto request) {
        log.info("Creating customer - [name={}]", request.getName());

        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            customerRepository.findByEmail(request.getEmail()).ifPresent(c -> {
                throw new DuplicateResourceException("Customer with email " + request.getEmail() + " already exists");
            });
        }

        if (request.getPhone() != null && !request.getPhone().isEmpty()) {
            customerRepository.findByPhone(request.getPhone()).ifPresent(c -> {
                throw new DuplicateResourceException("Customer with phone " + request.getPhone() + " already exists");
            });
        }

        Customer customer = Customer.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .type(request.getType())
                .isActive(true)
                .build();

        customer = customerRepository.save(customer);
        log.info("Customer created successfully - [customerId={}]", customer.getCustomerId());

        return mapToDto(customer);
    }

    public CustomerDto updateCustomer(Long customerId, UpdateCustomerRequestDto request) {
        log.info("Updating customer - [customerId={}]", customerId);

        Customer customer = customerRepository.findByCustomerIdAndIsActiveTrue(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));

        if (request.getName() != null) {
            customer.setName(request.getName());
        }
        if (request.getEmail() != null) {
            customerRepository.findByEmail(request.getEmail()).ifPresent(c -> {
                if (!c.getCustomerId().equals(customerId)) {
                    throw new DuplicateResourceException("Customer with email " + request.getEmail() + " already exists");
                }
            });
            customer.setEmail(request.getEmail());
        }
        if (request.getPhone() != null) {
            customerRepository.findByPhone(request.getPhone()).ifPresent(c -> {
                if (!c.getCustomerId().equals(customerId)) {
                    throw new DuplicateResourceException("Customer with phone " + request.getPhone() + " already exists");
                }
            });
            customer.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            customer.setAddress(request.getAddress());
        }
        if (request.getType() != null) {
            customer.setType(request.getType());
        }

        customer = customerRepository.save(customer);
        log.info("Customer updated successfully - [customerId={}]", customerId);

        return mapToDto(customer);
    }

    public void deleteCustomer(Long customerId) {
        log.info("Deleting customer - [customerId={}]", customerId);

        Customer customer = customerRepository.findByCustomerIdAndIsActiveTrue(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));

        customer.setIsActive(false);
        customerRepository.save(customer);

        log.info("Customer deleted successfully - [customerId={}]", customerId);
    }

    @Transactional(readOnly = true)
    public List<CustomerDto> getAllCustomers() {
        log.info("Fetching all active customers");
        return customerRepository.findByIsActiveTrue().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CustomerDto getCustomerById(Long customerId) {
        log.info("Fetching customer - [customerId={}]", customerId);
        Customer customer = customerRepository.findByCustomerIdAndIsActiveTrue(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));
        return mapToDto(customer);
    }

    @Transactional(readOnly = true)
    public List<CustomerDto> searchCustomers(String searchTerm) {
        log.info("Searching customers - [searchTerm={}]", searchTerm);
        return customerRepository.searchByNameOrPhone(searchTerm).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SalesOrderDto> getCustomerOrders(Long customerId) {
        log.info("Fetching orders for customer - [customerId={}]", customerId);

        customerRepository.findByCustomerIdAndIsActiveTrue(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));

        List<SalesOrder> orders = salesOrderRepository.findByCustomerIdAndIsActiveTrue(customerId);
        return orders.stream()
                .map(this::mapSalesOrderToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderStatusDto> getCustomerOrderStatus(Long customerId) {
        log.info("Fetching order status for customer - [customerId={}]", customerId);

        customerRepository.findByCustomerIdAndIsActiveTrue(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));

        List<SalesOrder> orders = salesOrderRepository.findByCustomerIdAndIsActiveTrue(customerId);
        return orders.stream()
                .map(this::mapToOrderStatusDto)
                .collect(Collectors.toList());
    }

    private CustomerDto mapToDto(Customer customer) {
        return CustomerDto.builder()
                .customerId(customer.getCustomerId())
                .name(customer.getName())
                .email(customer.getEmail())
                .phone(customer.getPhone())
                .address(customer.getAddress())
                .type(customer.getType())
                .isActive(customer.getIsActive())
                .createdAt(customer.getCreatedAt())
                .updatedAt(customer.getUpdatedAt())
                .build();
    }

    private SalesOrderDto mapSalesOrderToDto(SalesOrder order) {
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

    private OrderStatusDto mapToOrderStatusDto(SalesOrder order) {
        return OrderStatusDto.builder()
                .salesOrderId(order.getSalesOrderId())
                .soNumber(order.getSoNumber())
                .orderDate(order.getOrderDate())
                .deliveryDate(order.getDeliveryDate())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .itemCount(order.getItems().size())
                .build();
    }
}
