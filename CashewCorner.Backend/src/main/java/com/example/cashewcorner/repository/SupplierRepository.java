package com.example.cashewcorner.repository;

import com.example.cashewcorner.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {

    List<Supplier> findByIsActiveTrue();

    Optional<Supplier> findBySupplierIdAndIsActiveTrue(Long supplierId);

    @Query("SELECT s FROM Supplier s WHERE s.isActive = true AND " +
           "(LOWER(s.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(s.phone) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Supplier> searchSuppliers(@Param("searchTerm") String searchTerm);

    @Query("SELECT s FROM Supplier s WHERE s.isApproved = true AND s.isActive = true")
    List<Supplier> findApprovedSuppliers();
}
