package com.example.cashewcorner.repository;

import com.example.cashewcorner.entity.RawCashewStockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RawCashewStockMovementRepository extends JpaRepository<RawCashewStockMovement, Long> {

    List<RawCashewStockMovement> findByRawCashewCashewTypeIdOrderByMovementDateDesc(Long cashewTypeId);

    @Query("SELECT sm FROM RawCashewStockMovement sm WHERE sm.movementType = :movementType ORDER BY sm.movementDate DESC")
    List<RawCashewStockMovement> findByMovementType(@Param("movementType") String movementType);

    @Query("SELECT sm FROM RawCashewStockMovement sm WHERE sm.movementDate BETWEEN :startDate AND :endDate ORDER BY sm.movementDate DESC")
    List<RawCashewStockMovement> findByDateRange(@Param("startDate") LocalDateTime startDate,
                                                  @Param("endDate") LocalDateTime endDate);

    @Query("SELECT sm FROM RawCashewStockMovement sm WHERE sm.relatedType = :relatedType AND sm.relatedId = :relatedId")
    List<RawCashewStockMovement> findByRelatedEntity(@Param("relatedType") String relatedType,
                                                      @Param("relatedId") Long relatedId);

    @Query(value = "SELECT sm.* FROM raw_cashew_stock_movements sm JOIN raw_cashew rc ON sm.cashew_type_id = rc.cashew_type_id WHERE " +
           "(:cashewType = '' OR LOWER(rc.cashew_type) LIKE LOWER(CONCAT('%', :cashewType, '%'))) AND " +
           "(:movementType IS NULL OR sm.movement_type = :movementType) AND " +
           "(:startDate IS NULL OR sm.movement_date >= :startDate) AND " +
           "(:endDate IS NULL OR sm.movement_date <= :endDate) " +
           "ORDER BY sm.movement_date DESC",
           nativeQuery = true)
    List<RawCashewStockMovement> searchMovements(@Param("cashewType") String cashewType,
                                                  @Param("movementType") String movementType,
                                                  @Param("startDate") LocalDateTime startDate,
                                                  @Param("endDate") LocalDateTime endDate);
}

