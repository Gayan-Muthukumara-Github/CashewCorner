export type ReportType =
  | 'INVENTORY_SUMMARY'
  | 'SALES_PERFORMANCE'
  | 'PAYROLL_SUMMARY'
  | 'LOW_STOCK_ALERT';

export interface GenerateReportRequest {
  reportType: ReportType;
  parameters: ReportParameters;
}

export interface ReportParameters {
  startDate?: string;
  endDate?: string;
  periodStart?: string;
  periodEnd?: string;
}

export interface ReportResponse {
  reportId: number;
  reportType: ReportType;
  parameters: ReportParameters;
  generatedBy: string;
  generatedAt: string;
  filePath: string | null;
  data: ReportData | null;
}

export type ReportData =
  | InventorySummaryData
  | SalesPerformanceData
  | PayrollSummaryData
  | LowStockAlertData;

// ===== Analytics Report Types =====

// Selling Price Fluctuation
export interface SellingPriceFluctuation {
  year: number;
  month: number;
  averageSellingPrice: number;
  highestPrice: number;
  lowestPrice: number;
}

// Transaction Summary
export interface TransactionSummary {
  year: number;
  month: number;
  totalSales: number;
  totalPurchases: number;
  income: number;
  expenses: number;
  profit: number;
}

// Category Financial Summary
export interface CategoryFinancialSummary {
  categoryId: number;
  categoryName: string;
  totalSales: number;
  totalPurchases: number;
  income: number;
  expenses: number;
  profit: number;
}

// Category Volume Report
export type VolumeReportType = 'SALES' | 'PURCHASE';

export interface CategoryVolumeReport {
  categoryId: number;
  categoryName: string;
  month: number;
  quantitySoldOrPurchased: number;
  averageUnitPrice: number;
  totalValue: number;
}

// Inventory Summary Report Data
export interface InventorySummaryData {
  totalProducts: number;
  lowStockItems: number;
  totalInventoryValue: number;
  locationsCount: number;
  inventoryItems: InventoryReportItem[];
  lowStockList: InventoryReportItem[];
}

export interface InventoryReportItem {
  inventoryId: number;
  productId: number;
  productName: string;
  productSku: string;
  location: string;
  quantityOnHand: number;
  reservedQuantity: number;
  availableQuantity: number;
  reorderLevel: number;
  unit: string;
}

// Sales Performance Report Data
export interface SalesPerformanceData {
  periodStart: string;
  periodEnd: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  topCustomers: TopCustomer[];
}

export interface TopCustomer {
  customerId: number;
  customerName: string;
  totalOrders: number;
  totalSpent: number;
}

// Payroll Summary Report Data
export interface PayrollSummaryData {
  periodStart: string;
  periodEnd: string;
  totalEmployees: number;
  totalGrossPay: number;
  totalDeductions: number;
  totalNetPay: number;
  unpaidCount: number;
  payrollRecords: PayrollReportRecord[];
}

export interface PayrollReportRecord {
  payrollId: number;
  employeeId: number;
  employeeName: string;
  periodStart: string;
  periodEnd: string;
  grossPay: number;
  deductions: number;
  netPay: number;
  status: string;
}

// Low Stock Alert Report Data
export interface LowStockAlertData {
  generatedAt: string;
  lowStockCount: number;
  items: LowStockItem[];
}

export interface LowStockItem {
  productId: number;
  productName: string;
  productSku: string;
  location: string;
  currentStock: number;
  reorderLevel: number;
  unit: string;
}
