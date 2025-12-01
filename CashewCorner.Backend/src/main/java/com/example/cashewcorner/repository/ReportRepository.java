package com.example.cashewcorner.repository;

import com.example.cashewcorner.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    @Query("SELECT r FROM Report r WHERE r.reportType = :reportType ORDER BY r.generatedAt DESC")
    List<Report> findByReportType(@Param("reportType") String reportType);

    @Query("SELECT r FROM Report r WHERE r.generatedBy.userId = :userId ORDER BY r.generatedAt DESC")
    List<Report> findByGeneratedBy(@Param("userId") Long userId);

    @Query("SELECT r FROM Report r WHERE r.generatedAt BETWEEN :startDate AND :endDate ORDER BY r.generatedAt DESC")
    List<Report> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                  @Param("endDate") LocalDateTime endDate);

    @Query("SELECT r FROM Report r ORDER BY r.generatedAt DESC")
    List<Report> findAllOrderByGeneratedAtDesc();
}
