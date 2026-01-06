import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { ProductResponse } from '../../../core/models/product.models';
import { CategoryResponse } from '../../../core/models/category.models';

@Component({
  selector: 'app-customer-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="products-page">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="container">
          <h1>Our Products</h1>
          <p class="hero-subtitle">Discover our premium selection of cashews and cashew-based products</p>
        </div>
      </div>

      <div class="content-section">
        <div class="container">
          <!-- Search and Filter Bar -->
          <div class="filter-bar">
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input 
                type="text" 
                [(ngModel)]="searchTerm" 
                (input)="filterProducts()"
                placeholder="Search products..."
                class="search-input"
              />
              @if (searchTerm) {
                <button class="clear-btn" (click)="clearSearch()">×</button>
              }
            </div>

            <div class="category-filters">
              <button 
                class="category-btn" 
                [class.active]="selectedCategoryId === null"
                (click)="selectCategory(null)">
                All Products
              </button>
              @for (category of categories; track category.categoryId) {
                <button 
                  class="category-btn" 
                  [class.active]="selectedCategoryId === category.categoryId"
                  (click)="selectCategory(category.categoryId)">
                  {{ category.name }}
                </button>
              }
            </div>
          </div>

          <!-- Products Count -->
          <div class="results-info">
            <span class="count">{{ filteredProducts.length }} products found</span>
            @if (selectedCategoryId || searchTerm) {
              <button class="clear-filters" (click)="clearFilters()">Clear Filters</button>
            }
          </div>

          <!-- Loading State -->
          @if (isLoading) {
            <div class="loading-state">
              <div class="spinner"></div>
              <p>Loading products...</p>
            </div>
          }

          <!-- Error State -->
          @if (errorMessage) {
            <div class="error-state">
              <span class="error-icon">⚠️</span>
              <p>{{ errorMessage }}</p>
              <button class="retry-btn" (click)="loadProducts()">Try Again</button>
            </div>
          }

          <!-- Products Grid -->
          @if (!isLoading && !errorMessage) {
            @if (filteredProducts.length === 0) {
              <div class="empty-state">
                <span class="empty-icon">📦</span>
                <h3>No products found</h3>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            } @else {
              <div class="products-grid">
                @for (product of filteredProducts; track product.productId) {
                  <div class="product-card" (click)="openProductModal(product)">
                    <div class="product-image">
                      <span class="product-emoji">{{ getProductEmoji(product) }}</span>
                      @if (product.categories.length > 0) {
                        <span class="category-tag">{{ product.categories[0].name }}</span>
                      }
                    </div>
                    <div class="product-info">
                      <h3 class="product-name">{{ product.name }}</h3>
                      <p class="product-description">{{ truncateText(product.description, 80) }}</p>
                      <div class="product-meta">
                        <span class="product-sku">SKU: {{ product.sku }}</span>
                        <span class="product-unit">{{ product.unit }}</span>
                      </div>
                      <div class="product-price">
                        <span class="price">LKR {{ product.sellPrice | number:'1.2-2' }}</span>
                        <span class="per-unit">per {{ product.unit }}</span>
                      </div>
                      <button class="view-details-btn">View Details</button>
                    </div>
                  </div>
                }
              </div>
            }
          }
        </div>
      </div>

      <!-- Product Details Modal -->
      @if (showProductModal && selectedProduct) {
        <div class="modal-overlay" (click)="onBackdropClick($event)">
          <div class="modal-container">
            <button class="modal-close" (click)="closeProductModal()">×</button>
            
            <div class="modal-content">
              <div class="modal-image">
                <span class="modal-emoji">{{ getProductEmoji(selectedProduct) }}</span>
              </div>
              
              <div class="modal-details">
                <div class="modal-header">
                  @if (selectedProduct.categories.length > 0) {
                    <div class="modal-categories">
                      @for (cat of selectedProduct.categories; track cat.categoryId) {
                        <span class="modal-category-tag">{{ cat.name }}</span>
                      }
                    </div>
                  }
                  <h2 class="modal-title">{{ selectedProduct.name }}</h2>
                  <span class="modal-sku">SKU: {{ selectedProduct.sku }}</span>
                </div>

                <div class="modal-description">
                  <h4>Description</h4>
                  <p>{{ selectedProduct.description || 'No description available.' }}</p>
                </div>

                <div class="modal-specs">
                  <h4>Product Details</h4>
                  <div class="specs-grid">
                    <div class="spec-item">
                      <span class="spec-label">Unit</span>
                      <span class="spec-value">{{ selectedProduct.unit }}</span>
                    </div>
                    <div class="spec-item">
                      <span class="spec-label">Packaging</span>
                      <span class="spec-value">{{ getPackaging(selectedProduct) }}</span>
                    </div>
                    <div class="spec-item">
                      <span class="spec-label">Availability</span>
                      <span class="spec-value availability">In Stock</span>
                    </div>
                    <div class="spec-item">
                      <span class="spec-label">Quality</span>
                      <span class="spec-value">Premium Grade</span>
                    </div>
                  </div>
                </div>

                <div class="modal-pricing">
                  <div class="price-box">
                    <span class="price-label">Price</span>
                    <span class="price-value">LKR {{ selectedProduct.sellPrice | number:'1.2-2' }}</span>
                    <span class="price-unit">per {{ selectedProduct.unit }}</span>
                  </div>
                </div>

                <div class="modal-actions">
                  <a href="mailto:orders@cashewcorner.lk?subject=Inquiry about {{ selectedProduct.name }}" class="inquiry-btn">
                    📧 Send Inquiry
                  </a>
                  <a href="tel:+94112345678" class="call-btn">
                    📞 Call to Order
                  </a>
                </div>

                <div class="modal-note">
                  <p>💡 For bulk orders or special requests, please contact us directly.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .products-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    }

    .hero-section {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      color: white;
      padding: 60px 0;
      text-align: center;
    }

    .hero-section h1 {
      font-size: 3rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
      background: linear-gradient(45deg, #fbbf24, #f59e0b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      opacity: 0.9;
      margin: 0;
      max-width: 600px;
      margin: 0 auto;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .content-section {
      padding: 3rem 0;
    }

    /* Filter Bar */
    .filter-bar {
      background: white;
      padding: 1.5rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      margin-bottom: 2rem;
    }

    .search-box {
      position: relative;
      margin-bottom: 1rem;
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.1rem;
    }

    .search-input {
      width: 100%;
      padding: 0.875rem 2.5rem 0.875rem 3rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: all 0.2s;
    }

    .search-input:focus {
      outline: none;
      border-color: #f59e0b;
      box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
    }

    .clear-btn {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      background: #e5e7eb;
      border: none;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .clear-btn:hover {
      background: #d1d5db;
    }

    .category-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .category-btn {
      padding: 0.5rem 1rem;
      border: 2px solid #e5e7eb;
      background: white;
      border-radius: 2rem;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 500;
    }

    .category-btn:hover {
      border-color: #f59e0b;
      color: #f59e0b;
    }

    .category-btn.active {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      border-color: transparent;
      color: white;
    }

    /* Results Info */
    .results-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .count {
      color: #64748b;
      font-size: 0.95rem;
    }

    .clear-filters {
      background: none;
      border: none;
      color: #f59e0b;
      font-size: 0.9rem;
      cursor: pointer;
      text-decoration: underline;
    }

    .clear-filters:hover {
      color: #d97706;
    }

    /* Loading State */
    .loading-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid #e5e7eb;
      border-top-color: #f59e0b;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Error State */
    .error-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 1rem;
    }

    .error-icon {
      font-size: 3rem;
      display: block;
      margin-bottom: 1rem;
    }

    .retry-btn {
      margin-top: 1rem;
      padding: 0.75rem 1.5rem;
      background: #f59e0b;
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 500;
    }

    .retry-btn:hover {
      background: #d97706;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 1rem;
    }

    .empty-icon {
      font-size: 4rem;
      display: block;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      margin: 0 0 0.5rem;
      color: #1e293b;
    }

    .empty-state p {
      color: #64748b;
      margin: 0;
    }

    /* Products Grid */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .product-card {
      background: white;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      transition: all 0.3s;
      cursor: pointer;
      border: 2px solid transparent;
    }

    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.1);
      border-color: #f59e0b;
    }

    .product-image {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .product-emoji {
      font-size: 5rem;
    }

    .category-tag {
      position: absolute;
      top: 1rem;
      left: 1rem;
      background: rgba(30, 41, 59, 0.9);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 2rem;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .product-info {
      padding: 1.25rem;
    }

    .product-name {
      font-size: 1.15rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 0.5rem;
    }

    .product-description {
      color: #64748b;
      font-size: 0.875rem;
      line-height: 1.5;
      margin: 0 0 0.75rem;
      min-height: 42px;
    }

    .product-meta {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #f1f5f9;
    }

    .product-sku, .product-unit {
      font-size: 0.8rem;
      color: #94a3b8;
    }

    .product-price {
      margin-bottom: 1rem;
    }

    .price {
      font-size: 1.5rem;
      font-weight: 700;
      color: #059669;
    }

    .per-unit {
      font-size: 0.85rem;
      color: #64748b;
      margin-left: 0.25rem;
    }

    .view-details-btn {
      width: 100%;
      padding: 0.75rem;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .view-details-btn:hover {
      background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 2rem;
      backdrop-filter: blur(4px);
    }

    .modal-container {
      background: white;
      border-radius: 1rem;
      max-width: 900px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      animation: modalSlideIn 0.3s ease;
    }

    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .modal-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(0,0,0,0.1);
      border: none;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      font-size: 1.5rem;
      cursor: pointer;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .modal-close:hover {
      background: rgba(0,0,0,0.2);
    }

    .modal-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    .modal-image {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 400px;
    }

    .modal-emoji {
      font-size: 8rem;
    }

    .modal-details {
      padding: 2rem;
    }

    .modal-header {
      margin-bottom: 1.5rem;
    }

    .modal-categories {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .modal-category-tag {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 2rem;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .modal-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 0.5rem;
    }

    .modal-sku {
      color: #94a3b8;
      font-size: 0.9rem;
    }

    .modal-description {
      margin-bottom: 1.5rem;
    }

    .modal-description h4,
    .modal-specs h4 {
      font-size: 0.9rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 0.5rem;
    }

    .modal-description p {
      color: #374151;
      line-height: 1.6;
      margin: 0;
    }

    .modal-specs {
      margin-bottom: 1.5rem;
    }

    .specs-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }

    .spec-item {
      background: #f8fafc;
      padding: 0.75rem;
      border-radius: 0.5rem;
    }

    .spec-label {
      display: block;
      font-size: 0.8rem;
      color: #64748b;
      margin-bottom: 0.25rem;
    }

    .spec-value {
      font-weight: 600;
      color: #1e293b;
    }

    .spec-value.availability {
      color: #059669;
    }

    .modal-pricing {
      margin-bottom: 1.5rem;
    }

    .price-box {
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      padding: 1.25rem;
      border-radius: 0.75rem;
      text-align: center;
      border: 2px solid #a7f3d0;
    }

    .price-label {
      display: block;
      font-size: 0.85rem;
      color: #065f46;
      margin-bottom: 0.25rem;
    }

    .price-value {
      display: block;
      font-size: 2rem;
      font-weight: 700;
      color: #059669;
    }

    .price-unit {
      font-size: 0.9rem;
      color: #065f46;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .inquiry-btn, .call-btn {
      flex: 1;
      padding: 0.875rem;
      border-radius: 0.5rem;
      font-weight: 600;
      text-align: center;
      text-decoration: none;
      transition: all 0.2s;
    }

    .inquiry-btn {
      background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
      color: white;
    }

    .inquiry-btn:hover {
      background: linear-gradient(135deg, #4338ca 0%, #4f46e5 100%);
    }

    .call-btn {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
    }

    .call-btn:hover {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
    }

    .modal-note {
      background: #fef3c7;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      border-left: 4px solid #f59e0b;
    }

    .modal-note p {
      margin: 0;
      font-size: 0.875rem;
      color: #92400e;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .hero-section h1 {
        font-size: 2rem;
      }

      .hero-section {
        padding: 40px 0;
      }

      .container {
        padding: 0 1rem;
      }

      .products-grid {
        grid-template-columns: 1fr;
      }

      .modal-content {
        grid-template-columns: 1fr;
      }

      .modal-image {
        min-height: 200px;
      }

      .modal-emoji {
        font-size: 5rem;
      }

      .modal-actions {
        flex-direction: column;
      }

      .specs-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProductsComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);

  products: ProductResponse[] = [];
  filteredProducts: ProductResponse[] = [];
  categories: CategoryResponse[] = [];

  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  selectedCategoryId: number | null = null;

  // Modal
  showProductModal = false;
  selectedProduct: ProductResponse | null = null;

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filterProducts();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.errorMessage = err.error?.message || 'Failed to load products. Please try again.';
        this.isLoading = false;
      }
    });
  }

  filterProducts(): void {
    let filtered = [...this.products];

    // Filter by category
    if (this.selectedCategoryId !== null) {
      filtered = filtered.filter(p => 
        p.categories.some(c => c.categoryId === this.selectedCategoryId)
      );
    }

    // Filter by search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term)
      );
    }

    this.filteredProducts = filtered;
  }

  selectCategory(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    this.filterProducts();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filterProducts();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategoryId = null;
    this.filterProducts();
  }

  openProductModal(product: ProductResponse): void {
    this.selectedProduct = product;
    this.showProductModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeProductModal(): void {
    this.showProductModal = false;
    this.selectedProduct = null;
    document.body.style.overflow = '';
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeProductModal();
    }
  }

  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  getProductEmoji(product: ProductResponse): string {
    const name = product.name.toLowerCase();
    if (name.includes('roast')) return '🔥';
    if (name.includes('salt')) return '🧂';
    if (name.includes('honey')) return '🍯';
    if (name.includes('butter')) return '🥜';
    if (name.includes('raw')) return '🌱';
    if (name.includes('organic')) return '🌿';
    return '🥜';
  }

  getPackaging(product: ProductResponse): string {
    const unit = product.unit.toLowerCase();
    if (unit === 'kg' || unit === 'kilogram') return 'Bulk Packaging';
    if (unit === 'g' || unit === 'gram') return 'Retail Pack';
    if (unit === 'box' || unit === 'pack') return 'Gift Box';
    return 'Standard Packaging';
  }
}
