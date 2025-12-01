package com.example.cashewcorner.repository;

import com.example.cashewcorner.entity.EmployeeDuty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EmployeeDutyRepository extends JpaRepository<EmployeeDuty, Long> {

    @Query("SELECT ed FROM EmployeeDuty ed WHERE ed.employee.employeeId = :employeeId ORDER BY ed.startDate DESC")
    List<EmployeeDuty> findByEmployeeId(@Param("employeeId") Long employeeId);

    @Query("SELECT ed FROM EmployeeDuty ed WHERE ed.status = :status ORDER BY ed.startDate DESC")
    List<EmployeeDuty> findByStatus(@Param("status") String status);

    @Query("SELECT ed FROM EmployeeDuty ed WHERE ed.salesOrder.salesOrderId = :salesOrderId")
    List<EmployeeDuty> findBySalesOrderId(@Param("salesOrderId") Long salesOrderId);

    @Query("SELECT ed FROM EmployeeDuty ed WHERE ed.purchaseOrder.purchaseOrderId = :purchaseOrderId")
    List<EmployeeDuty> findByPurchaseOrderId(@Param("purchaseOrderId") Long purchaseOrderId);

    @Query("SELECT ed FROM EmployeeDuty ed WHERE ed.startDate BETWEEN :startDate AND :endDate ORDER BY ed.startDate DESC")
    List<EmployeeDuty> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                       @Param("endDate") LocalDateTime endDate);

    @Query("SELECT ed FROM EmployeeDuty ed WHERE ed.employee.employeeId = :employeeId AND ed.status = :status")
    List<EmployeeDuty> findByEmployeeIdAndStatus(@Param("employeeId") Long employeeId, 
                                                  @Param("status") String status);
}
