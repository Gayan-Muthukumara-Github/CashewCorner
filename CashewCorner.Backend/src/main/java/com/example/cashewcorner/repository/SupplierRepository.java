package com.example.cashewcorner.repository;

import com.example.cashewcorner.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {

    List<Supplier> findByIsActiveTrue();

    Optional<Supplier> findBySupplierIdAndIsActiveTrue(Long supplierId);

    @Query(value = "SELECT * FROM suppliers s WHERE s.is_active = true AND " +
           "(LOWER(s.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(s.phone) LIKE LOWER(CONCAT('%', :searchTerm, '%')))",
           nativeQuery = true)
    List<Supplier> searchSuppliers(@Param("searchTerm") String searchTerm);

    @Query("SELECT s FROM Supplier s WHERE s.isApproved = true AND s.isActive = true")
    List<Supplier> findApprovedSuppliers();

    @Query(value = "SELECT s.* FROM suppliers s LEFT JOIN raw_cashew ct ON ct.cashew_type_id = s.cashew_type_id WHERE s.is_active = true " +
           // Text filters (partial match) - use empty string check instead of NULL
           "AND (:name = '' OR LOWER(s.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
           "AND (:address = '' OR LOWER(s.address) LIKE LOWER(CONCAT('%', :address, '%'))) " +
           "AND (:phone = '' OR LOWER(s.phone) LIKE LOWER(CONCAT('%', :phone, '%'))) " +
           "AND (:email = '' OR LOWER(s.email) LIKE LOWER(CONCAT('%', :email, '%'))) " +
           "AND (:contactPerson = '' OR LOWER(s.contact_person) LIKE LOWER(CONCAT('%', :contactPerson, '%'))) " +
           "AND (:paymentTerms = '' OR LOWER(s.payment_terms) LIKE LOWER(CONCAT('%', :paymentTerms, '%'))) " +
           "AND (:quality = '' OR LOWER(s.quality) LIKE LOWER(CONCAT('%', :quality, '%'))) " +
           "AND (:season = '' OR LOWER(s.season) LIKE LOWER(CONCAT('%', :season, '%'))) " +
           "AND (:paymentMethod = '' OR LOWER(s.payment_method) LIKE LOWER(CONCAT('%', :paymentMethod, '%'))) " +
           "AND (:deliveryMethod = '' OR LOWER(s.delivery_method) LIKE LOWER(CONCAT('%', :deliveryMethod, '%'))) " +
           "AND (:performances = '' OR LOWER(s.performances) LIKE LOWER(CONCAT('%', :performances, '%'))) " +
           // ID and boolean filters (exact match)
           "AND (:cashewTypeId IS NULL OR ct.cashew_type_id = :cashewTypeId) " +
           "AND (:isApproved IS NULL OR s.is_approved = :isApproved) " +
           // Range filters for numeric fields
           "AND (:minQuantity IS NULL OR s.quantity >= :minQuantity) " +
           "AND (:maxQuantity IS NULL OR s.quantity <= :maxQuantity) " +
           "AND (:minCostPerUnit IS NULL OR s.cost_per_unit >= :minCostPerUnit) " +
           "AND (:maxCostPerUnit IS NULL OR s.cost_per_unit <= :maxCostPerUnit) " +
           "AND (:minDistance IS NULL OR s.distance >= :minDistance) " +
           "AND (:maxDistance IS NULL OR s.distance <= :maxDistance) " +
           "AND (:minDeliveryCost IS NULL OR s.delivery_cost >= :minDeliveryCost) " +
           "AND (:maxDeliveryCost IS NULL OR s.delivery_cost <= :maxDeliveryCost) " +
           "AND (:minTimeTakenToReceive IS NULL OR s.time_taken_to_receive >= :minTimeTakenToReceive) " +
           "AND (:maxTimeTakenToReceive IS NULL OR s.time_taken_to_receive <= :maxTimeTakenToReceive) " +
           "AND (:minAverageCostPerUnit IS NULL OR s.average_cost_per_unit >= :minAverageCostPerUnit) " +
           "AND (:maxAverageCostPerUnit IS NULL OR s.average_cost_per_unit <= :maxAverageCostPerUnit) " +
           "AND (:minAverageDeliveryTime IS NULL OR s.average_delivery_time >= :minAverageDeliveryTime) " +
           "AND (:maxAverageDeliveryTime IS NULL OR s.average_delivery_time <= :maxAverageDeliveryTime) " +
           "AND (:minAverageDeliveryCost IS NULL OR s.average_delivery_cost >= :minAverageDeliveryCost) " +
           "AND (:maxAverageDeliveryCost IS NULL OR s.average_delivery_cost <= :maxAverageDeliveryCost)",
           nativeQuery = true)
    List<Supplier> advancedSearch(
            @Param("name") String name,
            @Param("address") String address,
            @Param("phone") String phone,
            @Param("email") String email,
            @Param("contactPerson") String contactPerson,
            @Param("paymentTerms") String paymentTerms,
            @Param("quality") String quality,
            @Param("season") String season,
            @Param("paymentMethod") String paymentMethod,
            @Param("deliveryMethod") String deliveryMethod,
            @Param("performances") String performances,
            @Param("cashewTypeId") Long cashewTypeId,
            @Param("isApproved") Boolean isApproved,
            @Param("minQuantity") BigDecimal minQuantity,
            @Param("maxQuantity") BigDecimal maxQuantity,
            @Param("minCostPerUnit") BigDecimal minCostPerUnit,
            @Param("maxCostPerUnit") BigDecimal maxCostPerUnit,
            @Param("minDistance") BigDecimal minDistance,
            @Param("maxDistance") BigDecimal maxDistance,
            @Param("minDeliveryCost") BigDecimal minDeliveryCost,
            @Param("maxDeliveryCost") BigDecimal maxDeliveryCost,
            @Param("minTimeTakenToReceive") Integer minTimeTakenToReceive,
            @Param("maxTimeTakenToReceive") Integer maxTimeTakenToReceive,
            @Param("minAverageCostPerUnit") BigDecimal minAverageCostPerUnit,
            @Param("maxAverageCostPerUnit") BigDecimal maxAverageCostPerUnit,
            @Param("minAverageDeliveryTime") Integer minAverageDeliveryTime,
            @Param("maxAverageDeliveryTime") Integer maxAverageDeliveryTime,
            @Param("minAverageDeliveryCost") BigDecimal minAverageDeliveryCost,
            @Param("maxAverageDeliveryCost") BigDecimal maxAverageDeliveryCost);
}
