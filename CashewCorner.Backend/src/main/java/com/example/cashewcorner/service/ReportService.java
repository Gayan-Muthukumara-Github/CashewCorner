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
    private final ProductRepository productRepository;
    private final PurchaseOrderItemRepository purchaseOrderItemRepository;
    private final SalesOrderItemRepository salesOrderItemRepository;
    private final ProductCategoryRepository productCategoryRepository;
    private final ObjectMapper objectMapper;

    public ReportService(ReportRepository reportRepository,
                        InventoryRepository inventoryRepository,
                        SalesOrderRepository salesOrderRepository,
                        PayrollRepository payrollRepository,
                        EmployeeRepository employeeRepository,
                        UserRepository userRepository,
                        ProductRepository productRepository,
                        PurchaseOrderItemRepository purchaseOrderItemRepository,
                        SalesOrderItemRepository salesOrderItemRepository,
                        ProductCategoryRepository productCategoryRepository,
                        ObjectMapper objectMapper) {
        this.reportRepository = reportRepository;
        this.inventoryRepository = inventoryRepository;
        this.salesOrderRepository = salesOrderRepository;
        this.payrollRepository = payrollRepository;
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.purchaseOrderItemRepository = purchaseOrderItemRepository;
        this.salesOrderItemRepository = salesOrderItemRepository;
        this.productCategoryRepository = productCategoryRepository;
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

    /**
     * Get selling price fluctuation report for a specific product.
     * Aggregates sales order item prices by year and month.
     *
     * @param productId the product ID to filter by
     * @param year optional year filter (defaults to current year if null)
     * @return list of monthly price fluctuation data
     */
    @Transactional(readOnly = true)
    public List<SellingPriceFluctuationDto> getSellingPriceFluctuation(Long productId, Integer year) {
        log.info("Generating selling price fluctuation report - [productId={}, year={}]", productId, year);

        // Validate product exists
        Product product = productRepository.findByProductIdAndIsActiveTrue(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        // Default to current year if not specified
        int targetYear = year != null ? year : LocalDate.now().getYear();

        // Fetch sales order items for the product and year
        List<SalesOrderItem> items = salesOrderItemRepository.findByProductIdAndYear(productId, targetYear);

        if (items.isEmpty()) {
            log.info("No sales order items found for product - [productId={}, year={}]", productId, targetYear);
            return Collections.emptyList();
        }

        // Group items by month and calculate statistics
        Map<Integer, List<SalesOrderItem>> itemsByMonth = items.stream()
                .collect(Collectors.groupingBy(item ->
                        item.getSalesOrder().getCreatedAt().getMonthValue()));

        List<SellingPriceFluctuationDto> result = new ArrayList<>();

        for (Map.Entry<Integer, List<SalesOrderItem>> entry : itemsByMonth.entrySet()) {
            Integer month = entry.getKey();
            List<SalesOrderItem> monthItems = entry.getValue();

            BigDecimal avgPrice = monthItems.stream()
                    .map(SalesOrderItem::getUnitPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add)
                    .divide(BigDecimal.valueOf(monthItems.size()), 2, RoundingMode.HALF_UP);

            BigDecimal highestPrice = monthItems.stream()
                    .map(SalesOrderItem::getUnitPrice)
                    .max(BigDecimal::compareTo)
                    .orElse(BigDecimal.ZERO);

            BigDecimal lowestPrice = monthItems.stream()
                    .map(SalesOrderItem::getUnitPrice)
                    .min(BigDecimal::compareTo)
                    .orElse(BigDecimal.ZERO);

            result.add(SellingPriceFluctuationDto.builder()
                    .year(targetYear)
                    .month(month)
                    .averageSellingPrice(avgPrice)
                    .highestPrice(highestPrice)
                    .lowestPrice(lowestPrice)
                    .build());
        }

        // Sort by month
        result.sort(Comparator.comparing(SellingPriceFluctuationDto::getMonth));

        log.info("Selling price fluctuation report generated - [productId={}, year={}, monthsCount={}]",
                productId, targetYear, result.size());

        return result;
    }

    /**
     * Get transaction summary report for a specific year.
     * Aggregates monthly sales and purchase data.
     *
     * @param year optional year filter (defaults to current year if null)
     * @return list of monthly transaction summaries
     */
    @Transactional(readOnly = true)
    public List<TransactionSummaryDto> getTransactionSummary(Integer year) {
        int targetYear = year != null ? year : LocalDate.now().getYear();
        log.info("Generating transaction summary report - [year={}]", targetYear);

        // Fetch all sales order items for the year
        List<SalesOrderItem> salesItems = salesOrderItemRepository.findByYear(targetYear);

        // Fetch all purchase order items for the year
        List<PurchaseOrderItem> purchaseItems = purchaseOrderItemRepository.findByYear(targetYear);

        // Group sales by month
        Map<Integer, BigDecimal> salesByMonth = salesItems.stream()
                .collect(Collectors.groupingBy(
                        item -> item.getSalesOrder().getCreatedAt().getMonthValue(),
                        Collectors.reducing(BigDecimal.ZERO, SalesOrderItem::getLineTotal, BigDecimal::add)));

        // Group purchases by month
        Map<Integer, BigDecimal> purchasesByMonth = purchaseItems.stream()
                .collect(Collectors.groupingBy(
                        item -> item.getPurchaseOrder().getCreatedAt().getMonthValue(),
                        Collectors.reducing(BigDecimal.ZERO, PurchaseOrderItem::getLineTotal, BigDecimal::add)));

        // Build result for all months that have data
        Set<Integer> allMonths = new HashSet<>();
        allMonths.addAll(salesByMonth.keySet());
        allMonths.addAll(purchasesByMonth.keySet());

        List<TransactionSummaryDto> result = new ArrayList<>();

        for (Integer month : allMonths) {
            BigDecimal totalSales = salesByMonth.getOrDefault(month, BigDecimal.ZERO);
            BigDecimal totalPurchases = purchasesByMonth.getOrDefault(month, BigDecimal.ZERO);
            BigDecimal profit = totalSales.subtract(totalPurchases);

            result.add(TransactionSummaryDto.builder()
                    .year(targetYear)
                    .month(month)
                    .totalSales(totalSales)
                    .totalPurchases(totalPurchases)
                    .income(totalSales)
                    .expenses(totalPurchases)
                    .profit(profit)
                    .build());
        }

        // Sort by month
        result.sort(Comparator.comparing(TransactionSummaryDto::getMonth));

        log.info("Transaction summary report generated - [year={}, monthsCount={}]", targetYear, result.size());

        return result;
    }

    /**
     * Get category-based financial summary report for a specific year.
     * Aggregates sales and purchase data by product category.
     *
     * @param year optional year filter (defaults to current year if null)
     * @return list of category financial summaries
     */
    @Transactional(readOnly = true)
    public List<CategoryFinancialSummaryDto> getCategoryFinancialSummary(Integer year) {
        int targetYear = year != null ? year : LocalDate.now().getYear();
        log.info("Generating category financial summary report - [year={}]", targetYear);

        // Fetch all active categories
        List<ProductCategory> categories = productCategoryRepository.findByIsActiveTrue();

        // Fetch all sales and purchase items for the year
        List<SalesOrderItem> salesItems = salesOrderItemRepository.findByYear(targetYear);
        List<PurchaseOrderItem> purchaseItems = purchaseOrderItemRepository.findByYear(targetYear);

        List<CategoryFinancialSummaryDto> result = new ArrayList<>();

        for (ProductCategory category : categories) {
            Long categoryId = category.getCategoryId();

            // Calculate total sales for products in this category
            BigDecimal totalSales = salesItems.stream()
                    .filter(item -> item.getProduct().getCategories().stream()
                            .anyMatch(c -> c.getCategoryId().equals(categoryId)))
                    .map(SalesOrderItem::getLineTotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Calculate total purchases for products in this category
            BigDecimal totalPurchases = purchaseItems.stream()
                    .filter(item -> item.getProduct().getCategories().stream()
                            .anyMatch(c -> c.getCategoryId().equals(categoryId)))
                    .map(PurchaseOrderItem::getLineTotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal profit = totalSales.subtract(totalPurchases);

            result.add(CategoryFinancialSummaryDto.builder()
                    .categoryId(categoryId)
                    .categoryName(category.getName())
                    .totalSales(totalSales)
                    .totalPurchases(totalPurchases)
                    .income(totalSales)
                    .expenses(totalPurchases)
                    .profit(profit)
                    .build());
        }

        log.info("Category financial summary report generated - [year={}, categoriesCount={}]",
                targetYear, result.size());

        return result;
    }

    /**
     * Get category volume report for a specific year and type (SALES or PURCHASE).
     * Aggregates monthly quantity and value data by product category.
     *
     * @param year optional year filter (defaults to current year if null)
     * @param type the type of report: "SALES" or "PURCHASE"
     * @return list of category volume data
     */
    @Transactional(readOnly = true)
    public List<CategoryVolumeReportDto> getCategoryVolumeReport(Integer year, String type) {
        int targetYear = year != null ? year : LocalDate.now().getYear();
        String reportType = type != null ? type.toUpperCase() : "SALES";

        log.info("Generating category volume report - [year={}, type={}]", targetYear, reportType);

        // Fetch all active categories
        List<ProductCategory> categories = productCategoryRepository.findByIsActiveTrue();

        List<CategoryVolumeReportDto> result = new ArrayList<>();

        if ("SALES".equals(reportType)) {
            List<SalesOrderItem> salesItems = salesOrderItemRepository.findByYear(targetYear);

            for (ProductCategory category : categories) {
                Long categoryId = category.getCategoryId();

                // Filter items for this category
                List<SalesOrderItem> categoryItems = salesItems.stream()
                        .filter(item -> item.getProduct().getCategories().stream()
                                .anyMatch(c -> c.getCategoryId().equals(categoryId)))
                        .collect(Collectors.toList());

                // Group by month
                Map<Integer, List<SalesOrderItem>> itemsByMonth = categoryItems.stream()
                        .collect(Collectors.groupingBy(item ->
                                item.getSalesOrder().getCreatedAt().getMonthValue()));

                for (Map.Entry<Integer, List<SalesOrderItem>> entry : itemsByMonth.entrySet()) {
                    Integer month = entry.getKey();
                    List<SalesOrderItem> monthItems = entry.getValue();

                    BigDecimal totalQuantity = monthItems.stream()
                            .map(SalesOrderItem::getQuantity)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    BigDecimal totalValue = monthItems.stream()
                            .map(SalesOrderItem::getLineTotal)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    BigDecimal avgUnitPrice = totalQuantity.compareTo(BigDecimal.ZERO) > 0
                            ? totalValue.divide(totalQuantity, 2, RoundingMode.HALF_UP)
                            : BigDecimal.ZERO;

                    result.add(CategoryVolumeReportDto.builder()
                            .categoryId(categoryId)
                            .categoryName(category.getName())
                            .month(month)
                            .quantitySoldOrPurchased(totalQuantity)
                            .averageUnitPrice(avgUnitPrice)
                            .totalValue(totalValue)
                            .build());
                }
            }
        } else if ("PURCHASE".equals(reportType)) {
            List<PurchaseOrderItem> purchaseItems = purchaseOrderItemRepository.findByYear(targetYear);

            for (ProductCategory category : categories) {
                Long categoryId = category.getCategoryId();

                // Filter items for this category
                List<PurchaseOrderItem> categoryItems = purchaseItems.stream()
                        .filter(item -> item.getProduct().getCategories().stream()
                                .anyMatch(c -> c.getCategoryId().equals(categoryId)))
                        .collect(Collectors.toList());

                // Group by month
                Map<Integer, List<PurchaseOrderItem>> itemsByMonth = categoryItems.stream()
                        .collect(Collectors.groupingBy(item ->
                                item.getPurchaseOrder().getCreatedAt().getMonthValue()));

                for (Map.Entry<Integer, List<PurchaseOrderItem>> entry : itemsByMonth.entrySet()) {
                    Integer month = entry.getKey();
                    List<PurchaseOrderItem> monthItems = entry.getValue();

                    BigDecimal totalQuantity = monthItems.stream()
                            .map(PurchaseOrderItem::getQuantity)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    BigDecimal totalValue = monthItems.stream()
                            .map(PurchaseOrderItem::getLineTotal)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    BigDecimal avgUnitPrice = totalQuantity.compareTo(BigDecimal.ZERO) > 0
                            ? totalValue.divide(totalQuantity, 2, RoundingMode.HALF_UP)
                            : BigDecimal.ZERO;

                    result.add(CategoryVolumeReportDto.builder()
                            .categoryId(categoryId)
                            .categoryName(category.getName())
                            .month(month)
                            .quantitySoldOrPurchased(totalQuantity)
                            .averageUnitPrice(avgUnitPrice)
                            .totalValue(totalValue)
                            .build());
                }
            }
        }

        // Sort by category name and then by month
        result.sort(Comparator.comparing(CategoryVolumeReportDto::getCategoryName)
                .thenComparing(CategoryVolumeReportDto::getMonth));

        log.info("Category volume report generated - [year={}, type={}, recordsCount={}]",
                targetYear, reportType, result.size());

        return result;
    }
}
