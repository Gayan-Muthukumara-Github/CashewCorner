package com.example.cashewcorner.repository;

import com.example.cashewcorner.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {

    List<PurchaseOrder> findByIsActiveTrue();

    Optional<PurchaseOrder> findByPurchaseOrderIdAndIsActiveTrue(Long purchaseOrderId);

    @Query("SELECT po FROM PurchaseOrder po WHERE po.supplier.supplierId = :supplierId AND po.isActive = true ORDER BY po.orderDate DESC")
    List<PurchaseOrder> findBySupplierIdAndIsActiveTrue(@Param("supplierId") Long supplierId);

    @Query("SELECT po FROM PurchaseOrder po WHERE po.status = :status AND po.isActive = true")
    List<PurchaseOrder> findByStatus(@Param("status") String status);

    Optional<PurchaseOrder> findByPoNumber(String poNumber);

    @Query("SELECT MAX(po.poNumber) FROM PurchaseOrder po WHERE po.poNumber LIKE CONCAT('PO', :year, '%')")
    String findLatestPoNumberForYear(@Param("year") String year);
}
