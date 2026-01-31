package com.example.cashewcorner.repository;

import com.example.cashewcorner.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    List<Employee> findByIsActiveTrue();

    Optional<Employee> findByEmployeeIdAndIsActiveTrue(Long employeeId);

    Optional<Employee> findByEmployeeCode(String employeeCode);

    @Query(value = "SELECT * FROM employees e WHERE e.is_active = true AND " +
           "(LOWER(e.first_name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.last_name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.employee_code) LIKE LOWER(CONCAT('%', :searchTerm, '%')))",
           nativeQuery = true)
    List<Employee> searchEmployees(@Param("searchTerm") String searchTerm);

    @Query("SELECT e FROM Employee e WHERE e.department = :department AND e.isActive = true")
    List<Employee> findByDepartment(@Param("department") String department);

    @Query("SELECT e FROM Employee e WHERE e.designation = :designation AND e.isActive = true")
    List<Employee> findByDesignation(@Param("designation") String designation);
}
