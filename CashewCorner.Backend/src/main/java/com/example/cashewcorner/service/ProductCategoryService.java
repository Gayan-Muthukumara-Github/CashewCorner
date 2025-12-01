package com.example.cashewcorner.service;

import com.example.cashewcorner.dto.CreateProductCategoryRequestDto;
import com.example.cashewcorner.dto.ProductCategoryDto;
import com.example.cashewcorner.entity.ProductCategory;
import com.example.cashewcorner.exception.DuplicateResourceException;
import com.example.cashewcorner.exception.ResourceNotFoundException;
import com.example.cashewcorner.repository.ProductCategoryRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class ProductCategoryService {

    private final ProductCategoryRepository categoryRepository;

    public ProductCategoryService(ProductCategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public ProductCategoryDto createCategory(CreateProductCategoryRequestDto request) {
        log.info("Creating product category - [name={}]", request.getName());

        // Check for duplicate name
        categoryRepository.findByName(request.getName()).ifPresent(c -> {
            throw new DuplicateResourceException("Category with name " + request.getName() + " already exists");
        });

        ProductCategory category = ProductCategory.builder()
                .name(request.getName())
                .description(request.getDescription())
                .isActive(true)
                .build();

        category = categoryRepository.save(category);
        log.info("Category created successfully - [categoryId={}, name={}]", 
                category.getCategoryId(), category.getName());

        return mapToDto(category);
    }

    public ProductCategoryDto updateCategory(Long categoryId, CreateProductCategoryRequestDto request) {
        log.info("Updating category - [categoryId={}]", categoryId);

        ProductCategory category = categoryRepository.findByCategoryIdAndIsActiveTrue(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));

        if (request.getName() != null) {
            // Check for duplicate name
            categoryRepository.findByName(request.getName()).ifPresent(c -> {
                if (!c.getCategoryId().equals(categoryId)) {
                    throw new DuplicateResourceException("Category with name " + request.getName() + " already exists");
                }
            });
            category.setName(request.getName());
        }
        if (request.getDescription() != null) {
            category.setDescription(request.getDescription());
        }

        category = categoryRepository.save(category);
        log.info("Category updated successfully - [categoryId={}]", categoryId);

        return mapToDto(category);
    }

    public void deleteCategory(Long categoryId) {
        log.info("Deleting category - [categoryId={}]", categoryId);

        ProductCategory category = categoryRepository.findByCategoryIdAndIsActiveTrue(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));

        category.setIsActive(false);
        categoryRepository.save(category);

        log.info("Category deleted successfully - [categoryId={}]", categoryId);
    }

    @Transactional(readOnly = true)
    public List<ProductCategoryDto> getAllCategories() {
        log.info("Fetching all active categories");
        return categoryRepository.findByIsActiveTrue().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductCategoryDto getCategoryById(Long categoryId) {
        log.info("Fetching category - [categoryId={}]", categoryId);
        ProductCategory category = categoryRepository.findByCategoryIdAndIsActiveTrue(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
        return mapToDto(category);
    }

    @Transactional(readOnly = true)
    public List<ProductCategoryDto> searchCategories(String searchTerm) {
        log.info("Searching categories - [searchTerm={}]", searchTerm);
        return categoryRepository.searchByName(searchTerm).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private ProductCategoryDto mapToDto(ProductCategory category) {
        return ProductCategoryDto.builder()
                .categoryId(category.getCategoryId())
                .name(category.getName())
                .description(category.getDescription())
                .isActive(category.getIsActive())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }
}
