package com.example.cashewcorner.controller;

import com.example.cashewcorner.dto.*;
import com.example.cashewcorner.service.ProductCategoryService;
import com.example.cashewcorner.service.ProductService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for product and category management endpoints.
 * Handles product catalog and category operations.
 */
@Slf4j
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProductController {

    private final ProductService productService;
    private final ProductCategoryService categoryService;

    public ProductController(ProductService productService, ProductCategoryService categoryService) {
        this.productService = productService;
        this.categoryService = categoryService;
    }

    // ==================== Product Endpoints ====================

    /**
     * Get all products (public access for customers).
     */
    @GetMapping("/products")
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        log.info("Fetching all products");
        List<ProductDto> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    /**
     * Get product by ID (public access).
     */
    @GetMapping("/products/{productId}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long productId) {
        log.info("Fetching product - [productId={}]", productId);
        ProductDto product = productService.getProductById(productId);
        return ResponseEntity.ok(product);
    }

    /**
     * Search products by name (public access).
     */
    @GetMapping("/products/search")
    public ResponseEntity<List<ProductDto>> searchProducts(@RequestParam String name) {
        log.info("Searching products - [name={}]", name);
        List<ProductDto> products = productService.searchProducts(name);
        return ResponseEntity.ok(products);
    }

    /**
     * Get products by category (public access).
     */
    @GetMapping("/products/category/{categoryId}")
    public ResponseEntity<List<ProductDto>> getProductsByCategory(@PathVariable Long categoryId) {
        log.info("Fetching products by category - [categoryId={}]", categoryId);
        List<ProductDto> products = productService.getProductsByCategory(categoryId);
        return ResponseEntity.ok(products);
    }

    /**
     * Create a new product.
     * Accessible by ADMIN and MANAGER roles.
     */
    @PostMapping("/products")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ProductDto> createProduct(@Valid @RequestBody CreateProductRequestDto request) {
        log.info("Product creation request - [sku={}, name={}]", request.getSku(), request.getName());
        ProductDto product = productService.createProduct(request);
        return new ResponseEntity<>(product, HttpStatus.CREATED);
    }

    /**
     * Update product information.
     * Accessible by ADMIN and MANAGER roles.
     */
    @PutMapping("/products/{productId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable Long productId,
                                                    @Valid @RequestBody UpdateProductRequestDto request) {
        log.info("Product update request - [productId={}]", productId);
        ProductDto product = productService.updateProduct(productId, request);
        return ResponseEntity.ok(product);
    }

    /**
     * Delete (deactivate) a product.
     * Only accessible by ADMIN role.
     */
    @DeleteMapping("/products/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) {
        log.info("Product deletion request - [productId={}]", productId);
        productService.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Assign a category to a product.
     * Accessible by ADMIN and MANAGER roles.
     */
    @PostMapping("/products/{productId}/categories")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ProductDto> assignCategory(@PathVariable Long productId,
                                                     @Valid @RequestBody AssignCategoryRequestDto request) {
        log.info("Assigning category to product - [productId={}, categoryId={}]", 
                productId, request.getCategoryId());
        ProductDto product = productService.assignCategory(productId, request);
        return ResponseEntity.ok(product);
    }

    /**
     * Remove a category from a product.
     * Accessible by ADMIN and MANAGER roles.
     */
    @DeleteMapping("/products/{productId}/categories/{categoryId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ProductDto> removeCategory(@PathVariable Long productId,
                                                     @PathVariable Long categoryId) {
        log.info("Removing category from product - [productId={}, categoryId={}]", productId, categoryId);
        ProductDto product = productService.removeCategory(productId, categoryId);
        return ResponseEntity.ok(product);
    }

    // ==================== Category Endpoints ====================

    /**
     * Get all categories (public access).
     */
    @GetMapping("/categories")
    public ResponseEntity<List<ProductCategoryDto>> getAllCategories() {
        log.info("Fetching all categories");
        List<ProductCategoryDto> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    /**
     * Get category by ID (public access).
     */
    @GetMapping("/categories/{categoryId}")
    public ResponseEntity<ProductCategoryDto> getCategoryById(@PathVariable Long categoryId) {
        log.info("Fetching category - [categoryId={}]", categoryId);
        ProductCategoryDto category = categoryService.getCategoryById(categoryId);
        return ResponseEntity.ok(category);
    }

    /**
     * Search categories by name (public access).
     */
    @GetMapping("/categories/search")
    public ResponseEntity<List<ProductCategoryDto>> searchCategories(@RequestParam String name) {
        log.info("Searching categories - [name={}]", name);
        List<ProductCategoryDto> categories = categoryService.searchCategories(name);
        return ResponseEntity.ok(categories);
    }

    /**
     * Create a new category.
     * Accessible by ADMIN and MANAGER roles.
     */
    @PostMapping("/categories")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ProductCategoryDto> createCategory(@Valid @RequestBody CreateProductCategoryRequestDto request) {
        log.info("Category creation request - [name={}]", request.getName());
        ProductCategoryDto category = categoryService.createCategory(request);
        return new ResponseEntity<>(category, HttpStatus.CREATED);
    }

    /**
     * Update category information.
     * Accessible by ADMIN and MANAGER roles.
     */
    @PutMapping("/categories/{categoryId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ProductCategoryDto> updateCategory(@PathVariable Long categoryId,
                                                             @Valid @RequestBody CreateProductCategoryRequestDto request) {
        log.info("Category update request - [categoryId={}]", categoryId);
        ProductCategoryDto category = categoryService.updateCategory(categoryId, request);
        return ResponseEntity.ok(category);
    }

    /**
     * Delete (deactivate) a category.
     * Only accessible by ADMIN role.
     */
    @DeleteMapping("/categories/{categoryId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long categoryId) {
        log.info("Category deletion request - [categoryId={}]", categoryId);
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.noContent().build();
    }
}
