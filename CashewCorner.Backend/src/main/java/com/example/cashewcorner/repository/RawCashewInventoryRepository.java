package com.example.cashewcorner.repository;

import com.example.cashewcorner.entity.RawCashewInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RawCashewInventoryRepository extends JpaRepository<RawCashewInventory, Long> {

    Optional<RawCashewInventory> findByRawCashewCashewTypeIdAndLocation(Long cashewTypeId, String location);

    List<RawCashewInventory> findByRawCashewCashewTypeId(Long cashewTypeId);

    @Query("SELECT rci FROM RawCashewInventory rci WHERE rci.location = :location")
    List<RawCashewInventory> findByLocation(@Param("location") String location);

    @Query("SELECT rci FROM RawCashewInventory rci WHERE rci.quantityOnHand > 0 ORDER BY rci.rawCashew.cashewType")
    List<RawCashewInventory> findAllWithStock();

    @Query("SELECT rci FROM RawCashewInventory rci WHERE rci.quantityOnHand <= :threshold")
    List<RawCashewInventory> findLowStockItems(@Param("threshold") java.math.BigDecimal threshold);

    @Query(value = "SELECT rci.* FROM raw_cashew_inventory rci JOIN raw_cashew rc ON rci.cashew_type_id = rc.cashew_type_id WHERE " +
           "(:cashewType = '' OR LOWER(rc.cashew_type) LIKE LOWER(CONCAT('%', :cashewType, '%'))) AND " +
           "(:cashewQuality = '' OR LOWER(rc.cashew_quality) LIKE LOWER(CONCAT('%', :cashewQuality, '%'))) AND " +
           "(:location = '' OR LOWER(rci.location) LIKE LOWER(CONCAT('%', :location, '%')))",
           nativeQuery = true)
    List<RawCashewInventory> searchInventory(@Param("cashewType") String cashewType,
                                              @Param("cashewQuality") String cashewQuality,
                                              @Param("location") String location);
}

