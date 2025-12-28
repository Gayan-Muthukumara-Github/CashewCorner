package com.example.cashewcorner.repository;

import com.example.cashewcorner.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.categories WHERE p.isActive = true")
    List<Product> findByIsActiveTrue();

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.categories WHERE p.productId = :productId AND p.isActive = true")
    Optional<Product> findByProductIdAndIsActiveTrue(@Param("productId") Long productId);

    Optional<Product> findBySku(String sku);

    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.categories WHERE p.isActive = true AND " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Product> searchByName(@Param("searchTerm") String searchTerm);

    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.categories WHERE p.productId IN " +
           "(SELECT p2.productId FROM Product p2 JOIN p2.categories c WHERE c.categoryId = :categoryId AND p2.isActive = true)")
    List<Product> findByCategoryId(@Param("categoryId") Long categoryId);
}
