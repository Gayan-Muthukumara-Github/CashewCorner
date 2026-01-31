package com.example.cashewcorner.repository;

import com.example.cashewcorner.entity.RawCashew;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RawCashewRepository extends JpaRepository<RawCashew, Long> {

    List<RawCashew> findByIsActiveTrue();

    Optional<RawCashew> findByCashewTypeIdAndIsActiveTrue(Long cashewTypeId);

    Optional<RawCashew> findByCashewTypeAndIsActiveTrue(String cashewType);

    @Query(value = "SELECT * FROM raw_cashew r WHERE r.is_active = true " +
           "AND (:cashewType = '' OR LOWER(r.cashew_type) LIKE LOWER(CONCAT('%', :cashewType, '%'))) " +
           "AND (:cashewQuality = '' OR LOWER(COALESCE(r.cashew_quality, '')) LIKE LOWER(CONCAT('%', :cashewQuality, '%')))",
           nativeQuery = true)
    List<RawCashew> searchRawCashew(@Param("cashewType") String cashewType,
                                     @Param("cashewQuality") String cashewQuality);
}

