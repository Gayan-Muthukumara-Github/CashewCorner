package com.example.cashewcorner.controller;

import com.example.cashewcorner.dto.*;
import com.example.cashewcorner.service.EmployeeService;
import com.example.cashewcorner.service.PayrollService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * REST Controller for employee, duties, and payroll management endpoints.
 * Handles employee CRUD, duty assignments, and payroll operations.
 */
@Slf4j
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", maxAge = 3600)
public class EmployeeController {

    private final EmployeeService employeeService;
    private final PayrollService payrollService;

    public EmployeeController(EmployeeService employeeService, PayrollService payrollService) {
        this.employeeService = employeeService;
        this.payrollService = payrollService;
    }

    // ==================== Employee Endpoints ====================

    /**
     * Create a new employee.
     * Accessible by ADMIN and MANAGER roles.
     */
    @PostMapping("/employees")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<EmployeeDto> createEmployee(@Valid @RequestBody CreateEmployeeRequestDto request) {
        log.info("Employee creation request - [code={}, name={}]", request.getEmployeeCode(), request.getFirstName());
        EmployeeDto employee = employeeService.createEmployee(request);
        return new ResponseEntity<>(employee, HttpStatus.CREATED);
    }

    /**
     * Update employee information.
     * Accessible by ADMIN and MANAGER roles.
     */
    @PutMapping("/employees/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<EmployeeDto> updateEmployee(@PathVariable Long employeeId,
                                                      @Valid @RequestBody UpdateEmployeeRequestDto request) {
        log.info("Employee update request - [employeeId={}]", employeeId);
        EmployeeDto employee = employeeService.updateEmployee(employeeId, request);
        return ResponseEntity.ok(employee);
    }

    /**
     * Delete (deactivate) an employee.
     * Only accessible by ADMIN role.
     */
    @DeleteMapping("/employees/{employeeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long employeeId) {
        log.info("Employee deletion request - [employeeId={}]", employeeId);
        employeeService.deleteEmployee(employeeId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get all active employees.
     * Accessible by authenticated users.
     */
    @GetMapping("/employees")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<EmployeeDto>> getAllEmployees() {
        log.info("Fetching all employees");
        List<EmployeeDto> employees = employeeService.getAllEmployees();
        return ResponseEntity.ok(employees);
    }

    /**
     * Get employee by ID.
     * Accessible by authenticated users.
     */
    @GetMapping("/employees/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<EmployeeDto> getEmployeeById(@PathVariable Long employeeId) {
        log.info("Fetching employee - [employeeId={}]", employeeId);
        EmployeeDto employee = employeeService.getEmployeeById(employeeId);
        return ResponseEntity.ok(employee);
    }

    /**
     * Search employees by name or code.
     * Accessible by authenticated users.
     */
    @GetMapping("/employees/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<EmployeeDto>> searchEmployees(@RequestParam String searchTerm) {
        log.info("Searching employees - [searchTerm={}]", searchTerm);
        List<EmployeeDto> employees = employeeService.searchEmployees(searchTerm);
        return ResponseEntity.ok(employees);
    }

    // ==================== Employee Duty Endpoints ====================

    /**
     * Assign a duty to an employee.
     * Accessible by ADMIN and MANAGER roles.
     */
    @PostMapping("/employees/{employeeId}/duties")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<EmployeeDutyDto> assignDuty(@PathVariable Long employeeId,
                                                      @Valid @RequestBody AssignDutyRequestDto request) {
        log.info("Assigning duty to employee - [employeeId={}, taskType={}]", employeeId, request.getTaskType());
        EmployeeDutyDto duty = employeeService.assignDuty(employeeId, request);
        return new ResponseEntity<>(duty, HttpStatus.CREATED);
    }

    /**
     * Get all duties for a specific employee.
     * Accessible by authenticated users.
     */
    @GetMapping("/employees/{employeeId}/duties")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<EmployeeDutyDto>> getEmployeeDuties(@PathVariable Long employeeId) {
        log.info("Fetching duties for employee - [employeeId={}]", employeeId);
        List<EmployeeDutyDto> duties = employeeService.getEmployeeDuties(employeeId);
        return ResponseEntity.ok(duties);
    }

    /**
     * Update duty status.
     * Accessible by ADMIN and MANAGER roles.
     */
    @PatchMapping("/duties/{dutyId}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<EmployeeDutyDto> updateDutyStatus(@PathVariable Long dutyId,
                                                            @RequestParam String status) {
        log.info("Updating duty status - [dutyId={}, status={}]", dutyId, status);
        EmployeeDutyDto duty = employeeService.updateDutyStatus(dutyId, status);
        return ResponseEntity.ok(duty);
    }

    /**
     * Get duties by status.
     * Accessible by ADMIN and MANAGER roles.
     */
    @GetMapping("/duties/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<EmployeeDutyDto>> getDutiesByStatus(@PathVariable String status) {
        log.info("Fetching duties by status - [status={}]", status);
        List<EmployeeDutyDto> duties = employeeService.getDutiesByStatus(status);
        return ResponseEntity.ok(duties);
    }

    // ==================== Payroll Endpoints ====================

    /**
     * Generate/create payroll for an employee.
     * Accessible by ADMIN and MANAGER roles.
     */
    @PostMapping("/payrolls")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<PayrollDto> createPayroll(@Valid @RequestBody CreatePayrollRequestDto request) {
        log.info("Payroll creation request - [employeeId={}, period={} to {}]", 
                request.getEmployeeId(), request.getPeriodStart(), request.getPeriodEnd());
        PayrollDto payroll = payrollService.createPayroll(request);
        return new ResponseEntity<>(payroll, HttpStatus.CREATED);
    }

    /**
     * Update payroll information.
     * Accessible by ADMIN and MANAGER roles.
     */
    @PutMapping("/payrolls/{payrollId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<PayrollDto> updatePayroll(@PathVariable Long payrollId,
                                                    @Valid @RequestBody CreatePayrollRequestDto request) {
        log.info("Payroll update request - [payrollId={}]", payrollId);
        PayrollDto payroll = payrollService.updatePayroll(payrollId, request);
        return ResponseEntity.ok(payroll);
    }

    /**
     * Get all payrolls.
     * Accessible by ADMIN and MANAGER roles.
     */
    @GetMapping("/payrolls")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<PayrollDto>> getAllPayrolls() {
        log.info("Fetching all payrolls");
        List<PayrollDto> payrolls = payrollService.getAllPayrolls();
        return ResponseEntity.ok(payrolls);
    }

    /**
     * Get payroll by ID.
     * Accessible by ADMIN and MANAGER roles.
     */
    @GetMapping("/payrolls/{payrollId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<PayrollDto> getPayrollById(@PathVariable Long payrollId) {
        log.info("Fetching payroll - [payrollId={}]", payrollId);
        PayrollDto payroll = payrollService.getPayrollById(payrollId);
        return ResponseEntity.ok(payroll);
    }

    /**
     * Get all payrolls for a specific employee.
     * Accessible by ADMIN and MANAGER roles.
     */
    @GetMapping("/employees/{employeeId}/payrolls")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<PayrollDto>> getEmployeePayrolls(@PathVariable Long employeeId) {
        log.info("Fetching payrolls for employee - [employeeId={}]", employeeId);
        List<PayrollDto> payrolls = payrollService.getPayrollsByEmployee(employeeId);
        return ResponseEntity.ok(payrolls);
    }

    /**
     * Get payrolls by period.
     * Accessible by ADMIN and MANAGER roles.
     */
    @GetMapping("/payrolls/period")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<PayrollDto>> getPayrollsByPeriod(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        log.info("Fetching payrolls for period - [{} to {}]", startDate, endDate);
        List<PayrollDto> payrolls = payrollService.getPayrollsByPeriod(startDate, endDate);
        return ResponseEntity.ok(payrolls);
    }

    /**
     * Get unpaid payrolls.
     * Accessible by ADMIN and MANAGER roles.
     */
    @GetMapping("/payrolls/unpaid")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<PayrollDto>> getUnpaidPayrolls() {
        log.info("Fetching unpaid payrolls");
        List<PayrollDto> payrolls = payrollService.getUnpaidPayrolls();
        return ResponseEntity.ok(payrolls);
    }
}
