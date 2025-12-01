package com.example.cashewcorner.repository;

import com.example.cashewcorner.entity.SalesOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {

    List<SalesOrder> findByIsActiveTrue();

    Optional<SalesOrder> findBySalesOrderIdAndIsActiveTrue(Long salesOrderId);

    @Query("SELECT so FROM SalesOrder so WHERE so.customer.customerId = :customerId AND so.isActive = true ORDER BY so.orderDate DESC")
    List<SalesOrder> findByCustomerIdAndIsActiveTrue(@Param("customerId") Long customerId);

    @Query("SELECT so FROM SalesOrder so WHERE so.status = :status AND so.isActive = true")
    List<SalesOrder> findByStatus(@Param("status") String status);

    Optional<SalesOrder> findBySoNumber(String soNumber);

    @Query("SELECT so FROM SalesOrder so WHERE LOWER(so.soNumber) LIKE LOWER(CONCAT('%', :orderNo, '%')) AND so.isActive = true")
    List<SalesOrder> searchByOrderNumber(@Param("orderNo") String orderNo);

    @Query("SELECT MAX(so.soNumber) FROM SalesOrder so WHERE so.soNumber LIKE CONCAT('SO', :year, '%')")
    String findLatestSoNumberForYear(@Param("year") String year);
}
