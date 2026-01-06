import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ReportResponse,
  GenerateReportRequest,
  ReportType,
  ReportParameters,
  SellingPriceFluctuation,
  TransactionSummary,
  CategoryFinancialSummary,
  CategoryVolumeReport,
  VolumeReportType,
} from '../models/report.models';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiUrl = `${API_CONFIG.baseUrl}/reports`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Get all previously generated reports
   * GET /api/reports
   */
  getAllReports(): Observable<ReportResponse[]> {
    return this.http.get<ReportResponse[]>(this.apiUrl);
  }

  /**
   * Get a specific report by ID
   * GET /api/reports/{reportId}
   */
  getReportById(reportId: number): Observable<ReportResponse> {
    return this.http.get<ReportResponse>(`${this.apiUrl}/${reportId}`);
  }

  /**
   * Download a report by ID
   * GET /api/reports/{reportId}/download
   */
  downloadReport(reportId: number): Observable<ReportResponse> {
    return this.http.get<ReportResponse>(`${this.apiUrl}/${reportId}/download`);
  }

  /**
   * Generate a new report
   * POST /api/reports
   */
  generateReport(request: GenerateReportRequest): Observable<ReportResponse> {
    return this.http.post<ReportResponse>(this.apiUrl, request);
  }

  /**
   * Generate Inventory Summary Report
   */
  generateInventorySummary(): Observable<ReportResponse> {
    return this.generateReport({
      reportType: 'INVENTORY_SUMMARY',
      parameters: {},
    });
  }

  /**
   * Generate Sales Performance Report
   */
  generateSalesPerformance(
    startDate: string,
    endDate: string
  ): Observable<ReportResponse> {
    return this.generateReport({
      reportType: 'SALES_PERFORMANCE',
      parameters: { startDate, endDate },
    });
  }

  /**
   * Generate Payroll Summary Report
   */
  generatePayrollSummary(
    periodStart: string,
    periodEnd: string
  ): Observable<ReportResponse> {
    return this.generateReport({
      reportType: 'PAYROLL_SUMMARY',
      parameters: { periodStart, periodEnd },
    });
  }

  /**
   * Generate Low Stock Alert Report
   */
  generateLowStockAlert(): Observable<ReportResponse> {
    return this.generateReport({
      reportType: 'LOW_STOCK_ALERT',
      parameters: {},
    });
  }

  /**
   * Delete a report
   * DELETE /api/reports/{reportId}
   */
  deleteReport(reportId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${reportId}`);
  }

  // ===== Analytics Reports =====

  /**
   * Get Selling Price Fluctuation
   * GET /api/reports/selling-price-fluctuation?productId=X&year=Y
   */
  getSellingPriceFluctuation(
    productId: number,
    year?: number
  ): Observable<SellingPriceFluctuation[]> {
    let params = new HttpParams().set('productId', productId.toString());
    if (year) {
      params = params.set('year', year.toString());
    }
    return this.http.get<SellingPriceFluctuation[]>(
      `${this.apiUrl}/selling-price-fluctuation`,
      { params }
    );
  }

  /**
   * Get Transaction Summary
   * GET /api/reports/transaction-summary?year=Y
   */
  getTransactionSummary(year?: number): Observable<TransactionSummary[]> {
    let params = new HttpParams();
    if (year) {
      params = params.set('year', year.toString());
    }
    return this.http.get<TransactionSummary[]>(
      `${this.apiUrl}/transaction-summary`,
      { params }
    );
  }

  /**
   * Get Category Financial Summary
   * GET /api/reports/category-financial-summary?year=Y
   */
  getCategoryFinancialSummary(
    year?: number
  ): Observable<CategoryFinancialSummary[]> {
    let params = new HttpParams();
    if (year) {
      params = params.set('year', year.toString());
    }
    return this.http.get<CategoryFinancialSummary[]>(
      `${this.apiUrl}/category-financial-summary`,
      { params }
    );
  }

  /**
   * Get Category Volume Report
   * GET /api/reports/category-volume-report?year=Y&type=SALES|PURCHASE
   */
  getCategoryVolumeReport(
    type: VolumeReportType = 'SALES',
    year?: number
  ): Observable<CategoryVolumeReport[]> {
    let params = new HttpParams().set('type', type);
    if (year) {
      params = params.set('year', year.toString());
    }
    return this.http.get<CategoryVolumeReport[]>(
      `${this.apiUrl}/category-volume-report`,
      { params }
    );
  }
}
