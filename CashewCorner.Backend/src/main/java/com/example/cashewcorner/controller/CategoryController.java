package com.example.cashewcorner.controller;

import com.example.cashewcorner.dto.CreateProductCategoryRequestDto;
import com.example.cashewcorner.dto.ProductCategoryDto;
import com.example.cashewcorner.service.ProductCategoryService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for category management endpoints.
 * Handles product category operations.
 */
@Slf4j
@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CategoryController {

    private final ProductCategoryService categoryService;

    public CategoryController(ProductCategoryService categoryService) {
        this.categoryService = categoryService;
    }

    /**
     * Get all categories (public access).
     */
    @GetMapping
    public ResponseEntity<List<ProductCategoryDto>> getAllCategories() {
        log.info("Fetching all categories");
        List<ProductCategoryDto> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    /**
     * Get category by ID (public access).
     */
    @GetMapping("/{categoryId}")
    public ResponseEntity<ProductCategoryDto> getCategoryById(@PathVariable Long categoryId) {
        log.info("Fetching category - [categoryId={}]", categoryId);
        ProductCategoryDto category = categoryService.getCategoryById(categoryId);
        return ResponseEntity.ok(category);
    }

    /**
     * Search categories by name (public access).
     */
    @GetMapping("/search")
    public ResponseEntity<List<ProductCategoryDto>> searchCategories(@RequestParam String name) {
        log.info("Searching categories - [name={}]", name);
        List<ProductCategoryDto> categories = categoryService.searchCategories(name);
        return ResponseEntity.ok(categories);
    }

    /**
     * Create a new category.
     * Accessible by ADMIN and MANAGER roles.
     */
    @PostMapping
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
    @PutMapping("/{categoryId}")
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
    @DeleteMapping("/{categoryId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long categoryId) {
        log.info("Category deletion request - [categoryId={}]", categoryId);
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.noContent().build();
    }
}

