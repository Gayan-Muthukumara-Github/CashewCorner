package com.example.cashewcorner.repository;

import com.example.cashewcorner.entity.PurchaseOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PurchaseOrderItemRepository extends JpaRepository<PurchaseOrderItem, Long> {

    /**
     * Find all purchase order items for a specific product.
     */
    List<PurchaseOrderItem> findByProductProductId(Long productId);

    /**
     * Find purchase order items for a product within a date range.
     * Uses the purchase order's created_at timestamp for filtering.
     */
    @Query("SELECT poi FROM PurchaseOrderItem poi " +
           "JOIN poi.purchaseOrder po " +
           "WHERE poi.product.productId = :productId " +
           "AND po.createdAt >= :startDate " +
           "AND po.createdAt <= :endDate " +
           "AND po.isActive = true " +
           "ORDER BY po.createdAt ASC")
    List<PurchaseOrderItem> findByProductIdAndDateRange(
            @Param("productId") Long productId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    /**
     * Find purchase order items for a product within a specific year.
     */
    @Query("SELECT poi FROM PurchaseOrderItem poi " +
           "JOIN poi.purchaseOrder po " +
           "WHERE poi.product.productId = :productId " +
           "AND YEAR(po.createdAt) = :year " +
           "AND po.isActive = true " +
           "ORDER BY po.createdAt ASC")
    List<PurchaseOrderItem> findByProductIdAndYear(
            @Param("productId") Long productId,
            @Param("year") Integer year);

    /**
     * Find all purchase order items for a specific year.
     */
    @Query("SELECT poi FROM PurchaseOrderItem poi " +
           "JOIN poi.purchaseOrder po " +
           "WHERE YEAR(po.createdAt) = :year " +
           "AND po.isActive = true " +
           "ORDER BY po.createdAt ASC")
    List<PurchaseOrderItem> findByYear(@Param("year") Integer year);
}

