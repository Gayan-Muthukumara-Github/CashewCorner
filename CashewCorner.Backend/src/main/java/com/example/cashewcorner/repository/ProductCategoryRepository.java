package com.example.cashewcorner.repository;

import com.example.cashewcorner.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {

    List<ProductCategory> findByIsActiveTrue();

    Optional<ProductCategory> findByCategoryIdAndIsActiveTrue(Long categoryId);

    Optional<ProductCategory> findByName(String name);

    @Query(value = "SELECT * FROM product_categories c WHERE c.is_active = true AND " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))",
           nativeQuery = true)
    List<ProductCategory> searchByName(@Param("searchTerm") String searchTerm);
}
