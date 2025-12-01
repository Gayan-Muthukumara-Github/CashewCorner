package com.example.cashewcorner.repository;

import com.example.cashewcorner.entity.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Long> {

    @Query("SELECT p FROM Payroll p WHERE p.employee.employeeId = :employeeId ORDER BY p.periodEnd DESC")
    List<Payroll> findByEmployeeId(@Param("employeeId") Long employeeId);

    @Query("SELECT p FROM Payroll p WHERE p.periodStart >= :startDate AND p.periodEnd <= :endDate ORDER BY p.periodEnd DESC")
    List<Payroll> findByPeriodRange(@Param("startDate") LocalDate startDate, 
                                    @Param("endDate") LocalDate endDate);

    @Query("SELECT p FROM Payroll p WHERE p.employee.employeeId = :employeeId AND " +
           "p.periodStart = :periodStart AND p.periodEnd = :periodEnd")
    Optional<Payroll> findByEmployeeAndPeriod(@Param("employeeId") Long employeeId,
                                               @Param("periodStart") LocalDate periodStart,
                                               @Param("periodEnd") LocalDate periodEnd);

    @Query("SELECT p FROM Payroll p WHERE p.paymentDate IS NULL ORDER BY p.periodEnd DESC")
    List<Payroll> findUnpaidPayrolls();

    @Query("SELECT p FROM Payroll p WHERE p.paymentDate BETWEEN :startDate AND :endDate ORDER BY p.paymentDate DESC")
    List<Payroll> findByPaymentDateRange(@Param("startDate") LocalDate startDate, 
                                         @Param("endDate") LocalDate endDate);
}
