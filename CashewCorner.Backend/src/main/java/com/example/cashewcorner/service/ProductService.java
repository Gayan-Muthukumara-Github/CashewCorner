package com.example.cashewcorner.service;

import com.example.cashewcorner.dto.*;
import com.example.cashewcorner.entity.Product;
import com.example.cashewcorner.entity.ProductCategory;
import com.example.cashewcorner.exception.DuplicateResourceException;
import com.example.cashewcorner.exception.ResourceNotFoundException;
import com.example.cashewcorner.repository.ProductCategoryRepository;
import com.example.cashewcorner.repository.ProductRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductCategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository,
                         ProductCategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public ProductDto createProduct(CreateProductRequestDto request) {
        log.info("Creating product - [sku={}, name={}]", request.getSku(), request.getName());

        // Check for duplicate SKU
        productRepository.findBySku(request.getSku()).ifPresent(p -> {
            throw new DuplicateResourceException("Product with SKU " + request.getSku() + " already exists");
        });

        Product product = Product.builder()
                .sku(request.getSku())
                .name(request.getName())
                .description(request.getDescription())
                .unit(request.getUnit())
                .costPrice(request.getCostPrice())
                .sellPrice(request.getSellPrice())
                .reorderLevel(request.getReorderLevel())
                .isActive(true)
                .build();

        product = productRepository.save(product);
        log.info("Product created successfully - [productId={}, sku={}]", product.getProductId(), product.getSku());

        return mapToDto(product);
    }

    public ProductDto updateProduct(Long productId, UpdateProductRequestDto request) {
        log.info("Updating product - [productId={}]", productId);

        Product product = productRepository.findByProductIdAndIsActiveTrue(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        if (request.getName() != null) {
            product.setName(request.getName());
        }
        if (request.getDescription() != null) {
            product.setDescription(request.getDescription());
        }
        if (request.getUnit() != null) {
            product.setUnit(request.getUnit());
        }
        if (request.getCostPrice() != null) {
            product.setCostPrice(request.getCostPrice());
        }
        if (request.getSellPrice() != null) {
            product.setSellPrice(request.getSellPrice());
        }
        if (request.getReorderLevel() != null) {
            product.setReorderLevel(request.getReorderLevel());
        }

        product = productRepository.save(product);
        log.info("Product updated successfully - [productId={}]", productId);

        return mapToDto(product);
    }

    public void deleteProduct(Long productId) {
        log.info("Deleting product - [productId={}]", productId);

        Product product = productRepository.findByProductIdAndIsActiveTrue(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        product.setIsActive(false);
        productRepository.save(product);

        log.info("Product deleted successfully - [productId={}]", productId);
    }

    @Transactional(readOnly = true)
    public List<ProductDto> getAllProducts() {
        log.info("Fetching all active products");
        return productRepository.findByIsActiveTrue().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductDto getProductById(Long productId) {
        log.info("Fetching product - [productId={}]", productId);
        Product product = productRepository.findByProductIdAndIsActiveTrue(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
        return mapToDto(product);
    }

    @Transactional(readOnly = true)
    public List<ProductDto> searchProducts(String searchTerm) {
        log.info("Searching products - [searchTerm={}]", searchTerm);
        return productRepository.searchByName(searchTerm).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductDto> getProductsByCategory(Long categoryId) {
        log.info("Fetching products by category - [categoryId={}]", categoryId);
        
        // Verify category exists
        categoryRepository.findByCategoryIdAndIsActiveTrue(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));

        return productRepository.findByCategoryId(categoryId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ProductDto assignCategory(Long productId, AssignCategoryRequestDto request) {
        log.info("Assigning category to product - [productId={}, categoryId={}]", 
                productId, request.getCategoryId());

        Product product = productRepository.findByProductIdAndIsActiveTrue(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        ProductCategory category = categoryRepository.findByCategoryIdAndIsActiveTrue(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        product.addCategory(category);
        product = productRepository.save(product);

        log.info("Category assigned successfully - [productId={}, categoryId={}]", 
                productId, request.getCategoryId());

        return mapToDto(product);
    }

    public ProductDto removeCategory(Long productId, Long categoryId) {
        log.info("Removing category from product - [productId={}, categoryId={}]", productId, categoryId);

        Product product = productRepository.findByProductIdAndIsActiveTrue(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        ProductCategory category = categoryRepository.findByCategoryIdAndIsActiveTrue(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));

        product.removeCategory(category);
        product = productRepository.save(product);

        log.info("Category removed successfully - [productId={}, categoryId={}]", productId, categoryId);

        return mapToDto(product);
    }

    private ProductDto mapToDto(Product product) {
        return ProductDto.builder()
                .productId(product.getProductId())
                .sku(product.getSku())
                .name(product.getName())
                .description(product.getDescription())
                .unit(product.getUnit())
                .costPrice(product.getCostPrice())
                .sellPrice(product.getSellPrice())
                .reorderLevel(product.getReorderLevel())
                .isActive(product.getIsActive())
                .categories(product.getCategories().stream()
                        .map(this::mapCategoryToDto)
                        .collect(Collectors.toList()))
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    private ProductCategoryDto mapCategoryToDto(ProductCategory category) {
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
