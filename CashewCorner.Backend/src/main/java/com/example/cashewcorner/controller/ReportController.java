package com.example.cashewcorner.controller;

import com.example.cashewcorner.dto.CategoryFinancialSummaryDto;
import com.example.cashewcorner.dto.CategoryVolumeReportDto;
import com.example.cashewcorner.dto.GenerateReportRequestDto;
import com.example.cashewcorner.dto.ReportDto;
import com.example.cashewcorner.dto.SellingPriceFluctuationDto;
import com.example.cashewcorner.dto.TransactionSummaryDto;
import com.example.cashewcorner.service.ReportService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for report and analytics endpoints.
 * Handles report generation and retrieval for management insights.
 */
@Slf4j
@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    /**
     * Generate a new report.
     * Accessible by ADMIN and MANAGER roles.
     * 
     * Supported report types:
     * - INVENTORY_SUMMARY: Complete inventory overview
     * - SALES_PERFORMANCE: Sales analytics and top customers
     * - PAYROLL_SUMMARY: Payroll overview for a period
     * - LOW_STOCK_ALERT: Items below reorder level
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ReportDto> generateReport(@Valid @RequestBody GenerateReportRequestDto request,
                                                    Authentication authentication) {
        log.info("Report generation request - [type={}, user={}]", 
                request.getReportType(), authentication.getName());
        ReportDto report = reportService.generateReport(request, authentication.getName());
        return new ResponseEntity<>(report, HttpStatus.CREATED);
    }

    /**
     * Get all generated reports.
     * Accessible by ADMIN and MANAGER roles.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<ReportDto>> getAllReports() {
        log.info("Fetching all reports");
        List<ReportDto> reports = reportService.getAllReports();
        return ResponseEntity.ok(reports);
    }

    /**
     * Get report by ID.
     * Accessible by ADMIN and MANAGER roles.
     */
    @GetMapping("/{reportId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ReportDto> getReportById(@PathVariable Long reportId) {
        log.info("Fetching report - [reportId={}]", reportId);
        ReportDto report = reportService.getReportById(reportId);
        return ResponseEntity.ok(report);
    }

    /**
     * Get reports by type.
     * Accessible by ADMIN and MANAGER roles.
     */
    @GetMapping("/type/{reportType}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<ReportDto>> getReportsByType(@PathVariable String reportType) {
        log.info("Fetching reports by type - [type={}]", reportType);
        List<ReportDto> reports = reportService.getReportsByType(reportType);
        return ResponseEntity.ok(reports);
    }

    /**
     * Download report (placeholder for future file download implementation).
     * Accessible by ADMIN and MANAGER roles.
     */
    @GetMapping("/{reportId}/download")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ReportDto> downloadReport(@PathVariable Long reportId) {
        log.info("Download report request - [reportId={}]", reportId);
        ReportDto report = reportService.getReportById(reportId);
        // In a real implementation, this would return a file download
        // For now, returning the report data as JSON
        return ResponseEntity.ok(report);
    }

    /**
     * Get selling price fluctuation report for a specific product.
     * Returns monthly aggregated selling price statistics (average, highest, lowest).
     * Accessible by ADMIN and MANAGER roles.
     *
     * @param productId the product ID to filter by (required)
     * @param year optional year filter (defaults to current year if not provided)
     * @return list of monthly price fluctuation data
     */
    @GetMapping("/selling-price-fluctuation")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<SellingPriceFluctuationDto>> getSellingPriceFluctuation(
            @RequestParam Long productId,
            @RequestParam(required = false) Integer year) {
        log.info("Selling price fluctuation report request - [productId={}, year={}]", productId, year);
        List<SellingPriceFluctuationDto> report = reportService.getSellingPriceFluctuation(productId, year);
        log.info("Selling price fluctuation report generated - [productId={}, year={}, recordsCount={}]",
                productId, year, report.size());
        return ResponseEntity.ok(report);
    }

    /**
     * Get transaction summary report.
     * Returns monthly aggregated sales and purchase data with profit calculation.
     * Accessible by ADMIN and MANAGER roles.
     *
     * @param year optional year filter (defaults to current year if not provided)
     * @return list of monthly transaction summaries
     */
    @GetMapping("/transaction-summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<TransactionSummaryDto>> getTransactionSummary(
            @RequestParam(required = false) Integer year) {
        log.info("Transaction summary report request - [year={}]", year);
        List<TransactionSummaryDto> report = reportService.getTransactionSummary(year);
        log.info("Transaction summary report generated - [year={}, recordsCount={}]", year, report.size());
        return ResponseEntity.ok(report);
    }

    /**
     * Get category-based financial summary report.
     * Returns aggregated sales and purchase data by product category with profit calculation.
     * Accessible by ADMIN and MANAGER roles.
     *
     * @param year optional year filter (defaults to current year if not provided)
     * @return list of category financial summaries
     */
    @GetMapping("/category-financial-summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<CategoryFinancialSummaryDto>> getCategoryFinancialSummary(
            @RequestParam(required = false) Integer year) {
        log.info("Category financial summary report request - [year={}]", year);
        List<CategoryFinancialSummaryDto> report = reportService.getCategoryFinancialSummary(year);
        log.info("Category financial summary report generated - [year={}, recordsCount={}]", year, report.size());
        return ResponseEntity.ok(report);
    }

    /**
     * Get category volume report.
     * Returns monthly aggregated quantity and value data by product category.
     * Accessible by ADMIN and MANAGER roles.
     *
     * @param year optional year filter (defaults to current year if not provided)
     * @param type the type of report: "SALES" or "PURCHASE" (defaults to "SALES")
     * @return list of category volume data
     */
    @GetMapping("/category-volume-report")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<CategoryVolumeReportDto>> getCategoryVolumeReport(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String type) {
        log.info("Category volume report request - [year={}, type={}]", year, type);
        List<CategoryVolumeReportDto> report = reportService.getCategoryVolumeReport(year, type);
        log.info("Category volume report generated - [year={}, type={}, recordsCount={}]", year, type, report.size());
        return ResponseEntity.ok(report);
    }
}
