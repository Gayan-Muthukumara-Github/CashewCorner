import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReportService } from '../../../core/services/report.service';
import { ProductService } from '../../../core/services/product.service';
import { ProductResponse } from '../../../core/models/product.models';
import {
  ReportResponse,
  ReportType,
  ReportParameters,
  InventorySummaryData,
  SalesPerformanceData,
  PayrollSummaryData,
  LowStockAlertData,
  SellingPriceFluctuation,
  TransactionSummary,
  CategoryFinancialSummary,
  CategoryVolumeReport,
  VolumeReportType,
} from '../../../core/models/report.models';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-reports.component.html',
  styleUrl: './admin-reports.component.scss',
})
export class AdminReportsComponent implements OnInit {
  reports: ReportResponse[] = [];
  isLoading = false;
  isGenerating = false;
  generatingType: ReportType | null = null;
  errorMessage = '';
  successMessage = '';

  // Date inputs for reports
  salesStartDate = '';
  salesEndDate = '';
  payrollStartDate = '';
  payrollEndDate = '';

  // Report viewer modal
  showReportModal = false;
  selectedReport: ReportResponse | null = null;
  isLoadingReport = false;

  // ===== Analytics Section =====
  activeAnalyticsTab: 'price' | 'transaction' | 'category' | 'volume' = 'transaction';

  // Products for price fluctuation
  products: ProductResponse[] = [];
  isLoadingProducts = false;

  // Price Fluctuation
  selectedProductId: number | null = null;
  priceFluctuationYear: number | null = null;
  priceFluctuationData: SellingPriceFluctuation[] = [];
  isLoadingPriceFluctuation = false;

  // Transaction Summary
  transactionYear: number | null = null;
  transactionSummaryData: TransactionSummary[] = [];
  isLoadingTransactionSummary = false;

  // Category Financial Summary
  categoryFinancialYear: number | null = null;
  categoryFinancialData: CategoryFinancialSummary[] = [];
  isLoadingCategoryFinancial = false;

  // Category Volume Report
  volumeReportYear: number | null = null;
  volumeReportType: VolumeReportType = 'SALES';
  categoryVolumeData: CategoryVolumeReport[] = [];
  isLoadingCategoryVolume = false;

  // Available years for dropdowns
  availableYears: number[] = [];

  constructor(
    private readonly reportService: ReportService,
    private readonly productService: ProductService
  ) {
    // Set default dates (current month)
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    this.salesStartDate = this.formatDate(firstDay);
    this.salesEndDate = this.formatDate(lastDay);
    this.payrollStartDate = this.formatDate(firstDay);
    this.payrollEndDate = this.formatDate(lastDay);

    // Generate available years (last 5 years)
    const currentYear = now.getFullYear();
    for (let i = 0; i < 5; i++) {
      this.availableYears.push(currentYear - i);
    }
  }

  ngOnInit(): void {
    this.loadReports();
    this.loadProducts();
    this.loadTransactionSummary();
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  loadReports(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.reportService.getAllReports().subscribe({
      next: (data) => {
        this.reports = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading reports:', err);
        this.errorMessage =
          err.error?.message || err.message || 'Failed to load reports.';
        this.isLoading = false;
      },
    });
  }

  generateInventorySummary(): void {
    this.clearMessages();
    this.isGenerating = true;
    this.generatingType = 'INVENTORY_SUMMARY';

    this.reportService.generateInventorySummary().subscribe({
      next: (report) => {
        this.successMessage = 'Inventory Summary report generated successfully!';
        this.isGenerating = false;
        this.generatingType = null;
        this.loadReports();
        this.viewReport(report);
        setTimeout(() => this.clearMessages(), 5000);
      },
      error: (err) => {
        console.error('Error generating report:', err);
        this.errorMessage =
          err.error?.message || err.message || 'Failed to generate report.';
        this.isGenerating = false;
        this.generatingType = null;
      },
    });
  }

  generateSalesPerformance(): void {
    if (!this.salesStartDate || !this.salesEndDate) return;

    this.clearMessages();
    this.isGenerating = true;
    this.generatingType = 'SALES_PERFORMANCE';

    this.reportService
      .generateSalesPerformance(this.salesStartDate, this.salesEndDate)
      .subscribe({
        next: (report) => {
          this.successMessage = 'Sales Performance report generated successfully!';
          this.isGenerating = false;
          this.generatingType = null;
          this.loadReports();
          this.viewReport(report);
          setTimeout(() => this.clearMessages(), 5000);
        },
        error: (err) => {
          console.error('Error generating report:', err);
          this.errorMessage =
            err.error?.message || err.message || 'Failed to generate report.';
          this.isGenerating = false;
          this.generatingType = null;
        },
      });
  }

  generatePayrollSummary(): void {
    if (!this.payrollStartDate || !this.payrollEndDate) return;

    this.clearMessages();
    this.isGenerating = true;
    this.generatingType = 'PAYROLL_SUMMARY';

    this.reportService
      .generatePayrollSummary(this.payrollStartDate, this.payrollEndDate)
      .subscribe({
        next: (report) => {
          this.successMessage = 'Payroll Summary report generated successfully!';
          this.isGenerating = false;
          this.generatingType = null;
          this.loadReports();
          this.viewReport(report);
          setTimeout(() => this.clearMessages(), 5000);
        },
        error: (err) => {
          console.error('Error generating report:', err);
          this.errorMessage =
            err.error?.message || err.message || 'Failed to generate report.';
          this.isGenerating = false;
          this.generatingType = null;
        },
      });
  }

  generateLowStockAlert(): void {
    this.clearMessages();
    this.isGenerating = true;
    this.generatingType = 'LOW_STOCK_ALERT';

    this.reportService.generateLowStockAlert().subscribe({
      next: (report) => {
        this.successMessage = 'Low Stock Alert report generated successfully!';
        this.isGenerating = false;
        this.generatingType = null;
        this.loadReports();
        this.viewReport(report);
        setTimeout(() => this.clearMessages(), 5000);
      },
      error: (err) => {
        console.error('Error generating report:', err);
        this.errorMessage =
          err.error?.message || err.message || 'Failed to generate report.';
        this.isGenerating = false;
        this.generatingType = null;
      },
    });
  }

  viewReport(report: ReportResponse): void {
    this.selectedReport = report;
    this.showReportModal = true;

    // If report doesn't have data, fetch it
    if (!report.data) {
      this.isLoadingReport = true;
      this.reportService.getReportById(report.reportId).subscribe({
        next: (fullReport) => {
          this.selectedReport = fullReport;
          this.isLoadingReport = false;
        },
        error: (err) => {
          console.error('Error loading report:', err);
          this.isLoadingReport = false;
        },
      });
    }
  }

  closeReportModal(): void {
    this.showReportModal = false;
    this.selectedReport = null;
    this.isLoadingReport = false;
  }

  deleteReport(reportId: number): void {
    if (!confirm('Are you sure you want to delete this report?')) return;

    this.reportService.deleteReport(reportId).subscribe({
      next: () => {
        this.successMessage = 'Report deleted successfully!';
        this.loadReports();
        setTimeout(() => this.clearMessages(), 5000);
      },
      error: (err) => {
        console.error('Error deleting report:', err);
        this.errorMessage =
          err.error?.message || err.message || 'Failed to delete report.';
      },
    });
  }

  // Helper methods for type-safe data access
  getInventoryData(): InventorySummaryData | null {
    if (
      this.selectedReport?.reportType === 'INVENTORY_SUMMARY' &&
      this.selectedReport?.data
    ) {
      return this.selectedReport.data as InventorySummaryData;
    }
    return null;
  }

  getSalesData(): SalesPerformanceData | null {
    if (
      this.selectedReport?.reportType === 'SALES_PERFORMANCE' &&
      this.selectedReport?.data
    ) {
      return this.selectedReport.data as SalesPerformanceData;
    }
    return null;
  }

  getPayrollData(): PayrollSummaryData | null {
    if (
      this.selectedReport?.reportType === 'PAYROLL_SUMMARY' &&
      this.selectedReport?.data
    ) {
      return this.selectedReport.data as PayrollSummaryData;
    }
    return null;
  }

  getLowStockData(): LowStockAlertData | null {
    if (
      this.selectedReport?.reportType === 'LOW_STOCK_ALERT' &&
      this.selectedReport?.data
    ) {
      return this.selectedReport.data as LowStockAlertData;
    }
    return null;
  }

  // Formatting helpers
  formatReportType(type: ReportType): string {
    const typeMap: Record<ReportType, string> = {
      INVENTORY_SUMMARY: 'Inventory Summary',
      SALES_PERFORMANCE: 'Sales Performance',
      PAYROLL_SUMMARY: 'Payroll Summary',
      LOW_STOCK_ALERT: 'Low Stock Alert',
    };
    return typeMap[type] || type;
  }

  getReportTypeIcon(type: ReportType): string {
    const iconMap: Record<ReportType, string> = {
      INVENTORY_SUMMARY: '📦',
      SALES_PERFORMANCE: '💰',
      PAYROLL_SUMMARY: '👥',
      LOW_STOCK_ALERT: '⚠️',
    };
    return iconMap[type] || '📊';
  }

  getReportTypeClass(type: ReportType): string {
    const classMap: Record<ReportType, string> = {
      INVENTORY_SUMMARY: 'inventory',
      SALES_PERFORMANCE: 'sales',
      PAYROLL_SUMMARY: 'payroll',
      LOW_STOCK_ALERT: 'alert',
    };
    return classMap[type] || '';
  }

  formatParameters(params: ReportParameters): string {
    if (!params || Object.keys(params).length === 0) {
      return '—';
    }

    const parts: string[] = [];
    if (params.startDate || params.periodStart) {
      const start = params.startDate || params.periodStart;
      const end = params.endDate || params.periodEnd;
      parts.push(`${start} → ${end}`);
    }

    return parts.length > 0 ? parts.join(', ') : '—';
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeReportModal();
    }
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  // ===== Analytics Methods =====

  setAnalyticsTab(tab: 'price' | 'transaction' | 'category' | 'volume'): void {
    this.activeAnalyticsTab = tab;
  }

  loadProducts(): void {
    this.isLoadingProducts = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoadingProducts = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.isLoadingProducts = false;
      },
    });
  }

  loadPriceFluctuation(): void {
    if (!this.selectedProductId) {
      this.errorMessage = 'Please select a product';
      return;
    }

    this.isLoadingPriceFluctuation = true;
    this.clearMessages();

    this.reportService
      .getSellingPriceFluctuation(
        this.selectedProductId,
        this.priceFluctuationYear || undefined
      )
      .subscribe({
        next: (data) => {
          this.priceFluctuationData = data;
          this.isLoadingPriceFluctuation = false;
        },
        error: (err) => {
          console.error('Error loading price fluctuation:', err);
          this.errorMessage =
            err.error?.message || 'Failed to load price fluctuation data.';
          this.isLoadingPriceFluctuation = false;
        },
      });
  }

  loadTransactionSummary(): void {
    this.isLoadingTransactionSummary = true;
    this.clearMessages();

    this.reportService
      .getTransactionSummary(this.transactionYear || undefined)
      .subscribe({
        next: (data) => {
          this.transactionSummaryData = data;
          this.isLoadingTransactionSummary = false;
        },
        error: (err) => {
          console.error('Error loading transaction summary:', err);
          this.errorMessage =
            err.error?.message || 'Failed to load transaction summary.';
          this.isLoadingTransactionSummary = false;
        },
      });
  }

  loadCategoryFinancialSummary(): void {
    this.isLoadingCategoryFinancial = true;
    this.clearMessages();

    this.reportService
      .getCategoryFinancialSummary(this.categoryFinancialYear || undefined)
      .subscribe({
        next: (data) => {
          this.categoryFinancialData = data;
          this.isLoadingCategoryFinancial = false;
        },
        error: (err) => {
          console.error('Error loading category financial summary:', err);
          this.errorMessage =
            err.error?.message || 'Failed to load category financial summary.';
          this.isLoadingCategoryFinancial = false;
        },
      });
  }

  loadCategoryVolumeReport(): void {
    this.isLoadingCategoryVolume = true;
    this.clearMessages();

    this.reportService
      .getCategoryVolumeReport(
        this.volumeReportType,
        this.volumeReportYear || undefined
      )
      .subscribe({
        next: (data) => {
          this.categoryVolumeData = data;
          this.isLoadingCategoryVolume = false;
        },
        error: (err) => {
          console.error('Error loading category volume report:', err);
          this.errorMessage =
            err.error?.message || 'Failed to load category volume report.';
          this.isLoadingCategoryVolume = false;
        },
      });
  }

  // Helper to get month name
  getMonthName(month: number): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1] || '';
  }

  // Get totals for transaction summary
  getTransactionTotals(): { sales: number; purchases: number; profit: number } {
    return this.transactionSummaryData.reduce(
      (acc, item) => ({
        sales: acc.sales + item.totalSales,
        purchases: acc.purchases + item.totalPurchases,
        profit: acc.profit + item.profit,
      }),
      { sales: 0, purchases: 0, profit: 0 }
    );
  }

  // Get totals for category financial
  getCategoryFinancialTotals(): { sales: number; purchases: number; profit: number } {
    return this.categoryFinancialData.reduce(
      (acc, item) => ({
        sales: acc.sales + item.totalSales,
        purchases: acc.purchases + item.totalPurchases,
        profit: acc.profit + item.profit,
      }),
      { sales: 0, purchases: 0, profit: 0 }
    );
  }

  // Get totals for volume report
  getVolumeTotals(): { quantity: number; value: number } {
    return this.categoryVolumeData.reduce(
      (acc, item) => ({
        quantity: acc.quantity + item.quantitySoldOrPurchased,
        value: acc.value + item.totalValue,
      }),
      { quantity: 0, value: 0 }
    );
  }
}
