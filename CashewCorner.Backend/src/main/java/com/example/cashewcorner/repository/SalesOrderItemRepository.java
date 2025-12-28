package com.example.cashewcorner.repository;

import com.example.cashewcorner.entity.SalesOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalesOrderItemRepository extends JpaRepository<SalesOrderItem, Long> {

    /**
     * Find all sales order items for a specific product.
     */
    List<SalesOrderItem> findByProductProductId(Long productId);

    /**
     * Find sales order items for a product within a specific year.
     */
    @Query("SELECT soi FROM SalesOrderItem soi " +
           "JOIN soi.salesOrder so " +
           "WHERE soi.product.productId = :productId " +
           "AND YEAR(so.createdAt) = :year " +
           "AND so.isActive = true " +
           "ORDER BY so.createdAt ASC")
    List<SalesOrderItem> findByProductIdAndYear(
            @Param("productId") Long productId,
            @Param("year") Integer year);

    /**
     * Find all sales order items for a specific year.
     */
    @Query("SELECT soi FROM SalesOrderItem soi " +
           "JOIN soi.salesOrder so " +
           "WHERE YEAR(so.createdAt) = :year " +
           "AND so.isActive = true " +
           "ORDER BY so.createdAt ASC")
    List<SalesOrderItem> findByYear(@Param("year") Integer year);
}
