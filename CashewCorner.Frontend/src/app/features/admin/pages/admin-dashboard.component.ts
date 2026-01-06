import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { SalesOrderService } from '../../../core/services/sales-order.service';
import { ProductService } from '../../../core/services/product.service';
import { CustomerService } from '../../../core/services/customer.service';
import { InventoryService } from '../../../core/services/inventory.service';
import { SalesOrderResponse } from '../../../core/models/sales-order.models';
import { ProductResponse } from '../../../core/models/product.models';
import { CustomerResponse } from '../../../core/models/customer.models';
import { InventoryResponse } from '../../../core/models/inventory.models';

interface StatCard {
  label: string;
  value: string;
  delta: string;
  icon: string;
  color: string;
}

interface QuickAction {
  label: string;
  icon: string;
  route: string;
  color: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  loading = true;
  
  stats: StatCard[] = [];
  recentOrders: SalesOrderResponse[] = [];
  lowStockItems: InventoryResponse[] = [];
  topProducts: { product: ProductResponse; orderCount: number; revenue: number }[] = [];
  recentCustomers: CustomerResponse[] = [];
  
  // Chart data for weekly sales
  weeklyData: { day: string; sales: number; orders: number }[] = [];
  maxSales = 0;

  quickActions: QuickAction[] = [
    { label: 'New Order', icon: '📝', route: '/admin/sales-orders', color: '#8b5cf6' },
    { label: 'Add Product', icon: '📦', route: '/admin/products', color: '#f59e0b' },
    { label: 'Add Customer', icon: '👥', route: '/admin/customers', color: '#10b981' },
    { label: 'View Reports', icon: '📊', route: '/admin/analytics', color: '#3b82f6' },
  ];

  constructor(
    private salesOrderService: SalesOrderService,
    private productService: ProductService,
    private customerService: CustomerService,
    private inventoryService: InventoryService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    forkJoin({
      orders: this.salesOrderService.getAllSalesOrders(),
      products: this.productService.getProducts(),
      customers: this.customerService.getCustomers(),
      lowStock: this.inventoryService.getLowStockItems(),
      inventory: this.inventoryService.getAllInventory()
    }).subscribe({
      next: (data) => {
        this.processData(data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
        this.loading = false;
        // Set fallback data
        this.setFallbackData();
      }
    });
  }

  private processData(data: {
    orders: SalesOrderResponse[];
    products: ProductResponse[];
    customers: CustomerResponse[];
    lowStock: InventoryResponse[];
    inventory: InventoryResponse[];
  }): void {
    const { orders, products, customers, lowStock, inventory } = data;

    // Calculate stats
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const completedOrders = orders.filter(o => o.status === 'DELIVERED' || o.status === 'COMPLETED').length;
    const pendingOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'PROCESSING').length;
    const totalStock = inventory.reduce((sum, i) => sum + (i.quantityOnHand || 0), 0);

    this.stats = [
      { 
        label: 'Total Revenue', 
        value: this.formatCurrency(totalRevenue), 
        delta: '+12.5%', 
        icon: '💰',
        color: '#10b981'
      },
      { 
        label: 'Total Orders', 
        value: orders.length.toString(), 
        delta: '+8.2%', 
        icon: '📦',
        color: '#8b5cf6'
      },
      { 
        label: 'Active Customers', 
        value: customers.length.toString(), 
        delta: '+5.1%', 
        icon: '👥',
        color: '#3b82f6'
      },
      { 
        label: 'Products', 
        value: products.length.toString(), 
        delta: '+2.3%', 
        icon: '🥜',
        color: '#f59e0b'
      }
    ];

    // Recent orders (last 5)
    this.recentOrders = orders
      .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
      .slice(0, 5);

    // Low stock items
    this.lowStockItems = lowStock.slice(0, 5);

    // Recent customers (last 5)
    this.recentCustomers = customers
      .sort((a, b) => (b.customerId || 0) - (a.customerId || 0))
      .slice(0, 5);

    // Calculate top products by order frequency
    const productOrderMap = new Map<number, { count: number; revenue: number }>();
    orders.forEach(order => {
      order.items?.forEach(item => {
        const existing = productOrderMap.get(item.productId) || { count: 0, revenue: 0 };
        productOrderMap.set(item.productId, {
          count: existing.count + 1,
          revenue: existing.revenue + (item.quantity * item.unitPrice)
        });
      });
    });

    this.topProducts = products
      .map(product => ({
        product,
        orderCount: productOrderMap.get(product.productId)?.count || 0,
        revenue: productOrderMap.get(product.productId)?.revenue || 0
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Generate weekly chart data
    this.generateWeeklyData(orders);
  }

  private generateWeeklyData(orders: SalesOrderResponse[]): void {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weekData: { day: string; sales: number; orders: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay()];
      
      const dayOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt || '');
        return orderDate.toDateString() === date.toDateString();
      });

      const daySales = dayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      weekData.push({ day: dayName, sales: daySales, orders: dayOrders.length });
    }

    this.weeklyData = weekData;
    this.maxSales = Math.max(...weekData.map(d => d.sales), 1);
  }

  private setFallbackData(): void {
    this.stats = [
      { label: 'Total Revenue', value: 'Rs. 0', delta: '0%', icon: '💰', color: '#10b981' },
      { label: 'Total Orders', value: '0', delta: '0%', icon: '📦', color: '#8b5cf6' },
      { label: 'Active Customers', value: '0', delta: '0%', icon: '👥', color: '#3b82f6' },
      { label: 'Products', value: '0', delta: '0%', icon: '🥜', color: '#f59e0b' }
    ];
    this.weeklyData = [
      { day: 'Mon', sales: 0, orders: 0 },
      { day: 'Tue', sales: 0, orders: 0 },
      { day: 'Wed', sales: 0, orders: 0 },
      { day: 'Thu', sales: 0, orders: 0 },
      { day: 'Fri', sales: 0, orders: 0 },
      { day: 'Sat', sales: 0, orders: 0 },
      { day: 'Sun', sales: 0, orders: 0 }
    ];
  }

  formatCurrency(amount: number): string {
    return 'Rs. ' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      'PENDING': 'pending',
      'PROCESSING': 'processing',
      'SHIPPED': 'shipped',
      'DELIVERED': 'completed',
      'COMPLETED': 'completed',
      'CANCELLED': 'failed'
    };
    return statusMap[status] || 'pending';
  }

  getTimeAgo(dateStr: string): string {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  getBarHeight(sales: number): number {
    return this.maxSales > 0 ? (sales / this.maxSales) * 100 : 0;
  }

  refreshData(): void {
    this.loadDashboardData();
  }
}
