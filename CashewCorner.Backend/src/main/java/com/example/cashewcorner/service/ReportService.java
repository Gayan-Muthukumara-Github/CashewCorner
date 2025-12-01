package com.example.cashewcorner.service;

import com.example.cashewcorner.dto.*;
import com.example.cashewcorner.entity.*;
import com.example.cashewcorner.exception.ResourceNotFoundException;
import com.example.cashewcorner.repository.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class ReportService {

    private final ReportRepository reportRepository;
    private final InventoryRepository inventoryRepository;
    private final SalesOrderRepository salesOrderRepository;
    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public ReportService(ReportRepository reportRepository,
                        InventoryRepository inventoryRepository,
                        SalesOrderRepository salesOrderRepository,
                        PayrollRepository payrollRepository,
                        EmployeeRepository employeeRepository,
                        UserRepository userRepository,
                        ObjectMapper objectMapper) {
        this.reportRepository = reportRepository;
        this.inventoryRepository = inventoryRepository;
        this.salesOrderRepository = salesOrderRepository;
        this.payrollRepository = payrollRepository;
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    public ReportDto generateReport(GenerateReportRequestDto request, String username) {
        log.info("Generating report - [type={}, user={}]", request.getReportType(), username);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Map<String, Object> reportData = new HashMap<>();

        switch (request.getReportType().toUpperCase()) {
            case "INVENTORY_SUMMARY":
                reportData = generateInventorySummary(request.getParameters());
                break;
            case "SALES_PERFORMANCE":
                reportData = generateSalesPerformance(request.getParameters());
                break;
            case "PAYROLL_SUMMARY":
                reportData = generatePayrollSummary(request.getParameters());
                break;
            case "LOW_STOCK_ALERT":
                reportData = generateLowStockAlert();
                break;
            default:
                throw new IllegalArgumentException("Unknown report type: " + request.getReportType());
        }

        // Save report metadata
        String parametersJson = null;
        try {
            parametersJson = objectMapper.writeValueAsString(request.getParameters());
        } catch (JsonProcessingException e) {
            log.warn("Failed to serialize parameters", e);
        }

        Report report = Report.builder()
                .reportType(request.getReportType())
                .parameters(parametersJson)
                .generatedBy(user)
                .build();

        report = reportRepository.save(report);
        log.info("Report generated successfully - [reportId={}, type={}]", 
                report.getReportId(), report.getReportType());

        return ReportDto.builder()
                .reportId(report.getReportId())
                .reportType(report.getReportType())
                .parameters(request.getParameters())
                .generatedBy(user.getUsername())
                .generatedAt(report.getGeneratedAt())
                .data(reportData)
                .build();
    }

    private Map<String, Object> generateInventorySummary(Map<String, Object> parameters) {
        log.info("Generating inventory summary report");

        List<Inventory> allInventory = inventoryRepository.findAll();
        List<Inventory> lowStockItems = inventoryRepository.findLowStockItems();

        long totalProducts = allInventory.stream()
                .map(inv -> inv.getProduct().getProductId())
                .distinct()
                .count();

        long locationsCount = allInventory.stream()
                .map(Inventory::getLocation)
                .distinct()
                .count();

        BigDecimal totalValue = allInventory.stream()
                .map(inv -> inv.getQuantityOnHand().multiply(inv.getProduct().getCostPrice()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> data = new HashMap<>();
        data.put("totalProducts", totalProducts);
        data.put("lowStockItems", lowStockItems.size());
        data.put("totalInventoryValue", totalValue);
        data.put("locationsCount", locationsCount);
        data.put("inventoryItems", allInventory.stream()
                .map(this::mapInventoryToDto)
                .collect(Collectors.toList()));
        data.put("lowStockList", lowStockItems.stream()
                .map(this::mapInventoryToDto)
                .collect(Collectors.toList()));

        return data;
    }

    private Map<String, Object> generateSalesPerformance(Map<String, Object> parameters) {
        log.info("Generating sales performance report");

        LocalDate startDate = parameters != null && parameters.containsKey("startDate") 
                ? LocalDate.parse(parameters.get("startDate").toString()) 
                : LocalDate.now().minusMonths(1);
        LocalDate endDate = parameters != null && parameters.containsKey("endDate") 
                ? LocalDate.parse(parameters.get("endDate").toString()) 
                : LocalDate.now();

        List<SalesOrder> orders = salesOrderRepository.findByIsActiveTrue().stream()
                .filter(order -> !order.getOrderDate().isBefore(startDate) && !order.getOrderDate().isAfter(endDate))
                .collect(Collectors.toList());

        long totalOrders = orders.size();
        BigDecimal totalRevenue = orders.stream()
                .map(SalesOrder::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal averageOrderValue = totalOrders > 0 
                ? totalRevenue.divide(BigDecimal.valueOf(totalOrders), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        // Top customers by sales
        Map<Customer, BigDecimal> customerSales = new HashMap<>();
        for (SalesOrder order : orders) {
            customerSales.merge(order.getCustomer(), order.getTotalAmount(), BigDecimal::add);
        }

        List<Map<String, Object>> topCustomers = customerSales.entrySet().stream()
                .sorted(Map.Entry.<Customer, BigDecimal>comparingByValue().reversed())
                .limit(10)
                .map(entry -> {
                    Map<String, Object> customerData = new HashMap<>();
                    customerData.put("customerId", entry.getKey().getCustomerId());
                    customerData.put("customerName", entry.getKey().getName());
                    customerData.put("totalSales", entry.getValue());
                    customerData.put("orderCount", orders.stream()
                            .filter(o -> o.getCustomer().equals(entry.getKey()))
                            .count());
                    return customerData;
                })
                .collect(Collectors.toList());

        Map<String, Object> data = new HashMap<>();
        data.put("totalOrders", totalOrders);
        data.put("totalRevenue", totalRevenue);
        data.put("averageOrderValue", averageOrderValue);
        data.put("topCustomers", topCustomers);
        data.put("periodStart", startDate);
        data.put("periodEnd", endDate);

        return data;
    }

    private Map<String, Object> generatePayrollSummary(Map<String, Object> parameters) {
        log.info("Generating payroll summary report");

        LocalDate startDate = parameters != null && parameters.containsKey("periodStart") 
                ? LocalDate.parse(parameters.get("periodStart").toString()) 
                : LocalDate.now().withDayOfMonth(1);
        LocalDate endDate = parameters != null && parameters.containsKey("periodEnd") 
                ? LocalDate.parse(parameters.get("periodEnd").toString()) 
                : LocalDate.now();

        List<Payroll> payrolls = payrollRepository.findByPeriodRange(startDate, endDate);
        List<Payroll> unpaidPayrolls = payrollRepository.findUnpaidPayrolls();

        long totalEmployees = employeeRepository.findByIsActiveTrue().size();

        BigDecimal totalGrossPay = payrolls.stream()
                .map(Payroll::getGrossPay)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalDeductions = payrolls.stream()
                .map(Payroll::getDeductions)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalNetPay = payrolls.stream()
                .map(Payroll::getNetPay)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> data = new HashMap<>();
        data.put("totalEmployees", totalEmployees);
        data.put("totalGrossPay", totalGrossPay);
        data.put("totalDeductions", totalDeductions);
        data.put("totalNetPay", totalNetPay);
        data.put("unpaidCount", unpaidPayrolls.size());
        data.put("payrollRecords", payrolls.stream()
                .map(this::mapPayrollToDto)
                .collect(Collectors.toList()));
        data.put("periodStart", startDate);
        data.put("periodEnd", endDate);

        return data;
    }

    private Map<String, Object> generateLowStockAlert() {
        log.info("Generating low stock alert report");

        List<Inventory> lowStockItems = inventoryRepository.findLowStockItems();

        Map<String, Object> data = new HashMap<>();
        data.put("lowStockCount", lowStockItems.size());
        data.put("items", lowStockItems.stream()
                .map(this::mapInventoryToDto)
                .collect(Collectors.toList()));
        data.put("generatedAt", LocalDateTime.now());

        return data;
    }

    @Transactional(readOnly = true)
    public List<ReportDto> getAllReports() {
        log.info("Fetching all reports");
        return reportRepository.findAllOrderByGeneratedAtDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReportDto getReportById(Long reportId) {
        log.info("Fetching report - [reportId={}]", reportId);
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + reportId));
        return mapToDto(report);
    }

    @Transactional(readOnly = true)
    public List<ReportDto> getReportsByType(String reportType) {
        log.info("Fetching reports by type - [type={}]", reportType);
        return reportRepository.findByReportType(reportType).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private ReportDto mapToDto(Report report) {
        Map<String, Object> parameters = null;
        try {
            if (report.getParameters() != null) {
                parameters = objectMapper.readValue(report.getParameters(), Map.class);
            }
        } catch (JsonProcessingException e) {
            log.warn("Failed to deserialize parameters", e);
        }

        return ReportDto.builder()
                .reportId(report.getReportId())
                .reportType(report.getReportType())
                .parameters(parameters)
                .generatedBy(report.getGeneratedBy() != null ? report.getGeneratedBy().getUsername() : null)
                .generatedAt(report.getGeneratedAt())
                .filePath(report.getFilePath())
                .build();
    }

    private Map<String, Object> mapInventoryToDto(Inventory inventory) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("inventoryId", inventory.getInventoryId());
        dto.put("productId", inventory.getProduct().getProductId());
        dto.put("productName", inventory.getProduct().getName());
        dto.put("productSku", inventory.getProduct().getSku());
        dto.put("location", inventory.getLocation());
        dto.put("quantityOnHand", inventory.getQuantityOnHand());
        dto.put("reservedQuantity", inventory.getReservedQuantity());
        dto.put("availableQuantity", inventory.getAvailableQuantity());
        dto.put("reorderLevel", inventory.getProduct().getReorderLevel());
        dto.put("unit", inventory.getProduct().getUnit());
        return dto;
    }

    private Map<String, Object> mapPayrollToDto(Payroll payroll) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("payrollId", payroll.getPayrollId());
        dto.put("employeeId", payroll.getEmployee().getEmployeeId());
        dto.put("employeeName", payroll.getEmployee().getFullName());
        dto.put("employeeCode", payroll.getEmployee().getEmployeeCode());
        dto.put("periodStart", payroll.getPeriodStart());
        dto.put("periodEnd", payroll.getPeriodEnd());
        dto.put("grossPay", payroll.getGrossPay());
        dto.put("deductions", payroll.getDeductions());
        dto.put("netPay", payroll.getNetPay());
        dto.put("paymentDate", payroll.getPaymentDate());
        dto.put("paymentMethod", payroll.getPaymentMethod());
        return dto;
    }
}
