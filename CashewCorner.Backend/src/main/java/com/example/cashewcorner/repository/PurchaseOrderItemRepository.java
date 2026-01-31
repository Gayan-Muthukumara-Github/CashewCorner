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
     * Find all purchase order items for a specific raw cashew type.
     */
    List<PurchaseOrderItem> findByRawCashewCashewTypeId(Long cashewTypeId);

    /**
     * Find purchase order items for a raw cashew type within a date range.
     * Uses the purchase order's created_at timestamp for filtering.
     */
    @Query("SELECT poi FROM PurchaseOrderItem poi " +
           "JOIN poi.purchaseOrder po " +
           "WHERE poi.rawCashew.cashewTypeId = :cashewTypeId " +
           "AND po.createdAt >= :startDate " +
           "AND po.createdAt <= :endDate " +
           "AND po.isActive = true " +
           "ORDER BY po.createdAt ASC")
    List<PurchaseOrderItem> findByCashewTypeIdAndDateRange(
            @Param("cashewTypeId") Long cashewTypeId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    /**
     * Find purchase order items for a raw cashew type within a specific year.
     */
    @Query("SELECT poi FROM PurchaseOrderItem poi " +
           "JOIN poi.purchaseOrder po " +
           "WHERE poi.rawCashew.cashewTypeId = :cashewTypeId " +
           "AND YEAR(po.createdAt) = :year " +
           "AND po.isActive = true " +
           "ORDER BY po.createdAt ASC")
    List<PurchaseOrderItem> findByCashewTypeIdAndYear(
            @Param("cashewTypeId") Long cashewTypeId,
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

