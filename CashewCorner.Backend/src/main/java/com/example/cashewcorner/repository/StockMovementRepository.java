package com.example.cashewcorner.repository;

import com.example.cashewcorner.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {

    List<StockMovement> findByProductProductIdOrderByMovementDateDesc(Long productId);

    @Query("SELECT sm FROM StockMovement sm WHERE sm.movementType = :movementType ORDER BY sm.movementDate DESC")
    List<StockMovement> findByMovementType(@Param("movementType") String movementType);

    @Query("SELECT sm FROM StockMovement sm WHERE sm.movementDate BETWEEN :startDate AND :endDate ORDER BY sm.movementDate DESC")
    List<StockMovement> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                        @Param("endDate") LocalDateTime endDate);

    @Query("SELECT sm FROM StockMovement sm WHERE sm.relatedType = :relatedType AND sm.relatedId = :relatedId")
    List<StockMovement> findByRelatedEntity(@Param("relatedType") String relatedType, 
                                            @Param("relatedId") Long relatedId);

    @Query(value = "SELECT sm.* FROM stock_movements sm JOIN products p ON sm.product_id = p.product_id WHERE " +
           "(:productName = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :productName, '%'))) AND " +
           "(:movementType IS NULL OR sm.movement_type = :movementType) AND " +
           "(:startDate IS NULL OR sm.movement_date >= :startDate) AND " +
           "(:endDate IS NULL OR sm.movement_date <= :endDate) " +
           "ORDER BY sm.movement_date DESC",
           nativeQuery = true)
    List<StockMovement> searchMovements(@Param("productName") String productName,
                                        @Param("movementType") String movementType,
                                        @Param("startDate") LocalDateTime startDate,
                                        @Param("endDate") LocalDateTime endDate);
}
