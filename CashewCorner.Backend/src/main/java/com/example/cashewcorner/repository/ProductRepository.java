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

    List<Product> findByIsActiveTrue();

    Optional<Product> findByProductIdAndIsActiveTrue(Long productId);

    Optional<Product> findBySku(String sku);

    @Query("SELECT p FROM Product p WHERE p.isActive = true AND " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Product> searchByName(@Param("searchTerm") String searchTerm);

    @Query("SELECT p FROM Product p JOIN p.categories c WHERE c.categoryId = :categoryId AND p.isActive = true")
    List<Product> findByCategoryId(@Param("categoryId") Long categoryId);
}
