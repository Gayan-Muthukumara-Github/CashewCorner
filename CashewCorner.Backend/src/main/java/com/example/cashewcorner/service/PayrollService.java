package com.example.cashewcorner.service;

import com.example.cashewcorner.dto.CreatePayrollRequestDto;
import com.example.cashewcorner.dto.PayrollDto;
import com.example.cashewcorner.entity.Employee;
import com.example.cashewcorner.entity.Payroll;
import com.example.cashewcorner.exception.DuplicateResourceException;
import com.example.cashewcorner.exception.ResourceNotFoundException;
import com.example.cashewcorner.repository.EmployeeRepository;
import com.example.cashewcorner.repository.PayrollRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class PayrollService {

    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;

    public PayrollService(PayrollRepository payrollRepository, EmployeeRepository employeeRepository) {
        this.payrollRepository = payrollRepository;
        this.employeeRepository = employeeRepository;
    }

    public PayrollDto createPayroll(CreatePayrollRequestDto request) {
        log.info("Creating payroll - [employeeId={}, period={} to {}]", 
                request.getEmployeeId(), request.getPeriodStart(), request.getPeriodEnd());

        Employee employee = employeeRepository.findByEmployeeIdAndIsActiveTrue(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + request.getEmployeeId()));

        // Check for duplicate payroll for same period
        payrollRepository.findByEmployeeAndPeriod(request.getEmployeeId(), request.getPeriodStart(), request.getPeriodEnd())
                .ifPresent(p -> {
                    throw new DuplicateResourceException("Payroll already exists for this employee and period");
                });

        BigDecimal deductions = request.getDeductions() != null ? request.getDeductions() : BigDecimal.ZERO;
        BigDecimal netPay = request.getGrossPay().subtract(deductions);

        Payroll payroll = Payroll.builder()
                .employee(employee)
                .periodStart(request.getPeriodStart())
                .periodEnd(request.getPeriodEnd())
                .grossPay(request.getGrossPay())
                .deductions(deductions)
                .netPay(netPay)
                .paymentDate(request.getPaymentDate())
                .paymentMethod(request.getPaymentMethod())
                .notes(request.getNotes())
                .build();

        payroll = payrollRepository.save(payroll);
        log.info("Payroll created successfully - [payrollId={}, netPay={}]", 
                payroll.getPayrollId(), payroll.getNetPay());

        return mapToDto(payroll);
    }

    public PayrollDto updatePayroll(Long payrollId, CreatePayrollRequestDto request) {
        log.info("Updating payroll - [payrollId={}]", payrollId);

        Payroll payroll = payrollRepository.findById(payrollId)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll not found with id: " + payrollId));

        if (request.getGrossPay() != null) {
            payroll.setGrossPay(request.getGrossPay());
        }
        if (request.getDeductions() != null) {
            payroll.setDeductions(request.getDeductions());
        }
        if (request.getPaymentDate() != null) {
            payroll.setPaymentDate(request.getPaymentDate());
        }
        if (request.getPaymentMethod() != null) {
            payroll.setPaymentMethod(request.getPaymentMethod());
        }
        if (request.getNotes() != null) {
            payroll.setNotes(request.getNotes());
        }

        // Recalculate net pay
        payroll.setNetPay(payroll.getGrossPay().subtract(payroll.getDeductions()));

        payroll = payrollRepository.save(payroll);
        log.info("Payroll updated successfully - [payrollId={}]", payrollId);

        return mapToDto(payroll);
    }

    @Transactional(readOnly = true)
    public List<PayrollDto> getAllPayrolls() {
        log.info("Fetching all payrolls");
        return payrollRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PayrollDto getPayrollById(Long payrollId) {
        log.info("Fetching payroll - [payrollId={}]", payrollId);
        Payroll payroll = payrollRepository.findById(payrollId)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll not found with id: " + payrollId));
        return mapToDto(payroll);
    }

    @Transactional(readOnly = true)
    public List<PayrollDto> getPayrollsByEmployee(Long employeeId) {
        log.info("Fetching payrolls for employee - [employeeId={}]", employeeId);

        // Verify employee exists
        employeeRepository.findByEmployeeIdAndIsActiveTrue(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));

        return payrollRepository.findByEmployeeId(employeeId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PayrollDto> getPayrollsByPeriod(LocalDate startDate, LocalDate endDate) {
        log.info("Fetching payrolls for period - [{} to {}]", startDate, endDate);
        return payrollRepository.findByPeriodRange(startDate, endDate).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PayrollDto> getUnpaidPayrolls() {
        log.info("Fetching unpaid payrolls");
        return payrollRepository.findUnpaidPayrolls().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private PayrollDto mapToDto(Payroll payroll) {
        return PayrollDto.builder()
                .payrollId(payroll.getPayrollId())
                .employeeId(payroll.getEmployee().getEmployeeId())
                .employeeName(payroll.getEmployee().getFullName())
                .employeeCode(payroll.getEmployee().getEmployeeCode())
                .periodStart(payroll.getPeriodStart())
                .periodEnd(payroll.getPeriodEnd())
                .grossPay(payroll.getGrossPay())
                .deductions(payroll.getDeductions())
                .netPay(payroll.getNetPay())
                .paymentDate(payroll.getPaymentDate())
                .paymentMethod(payroll.getPaymentMethod())
                .notes(payroll.getNotes())
                .createdAt(payroll.getCreatedAt())
                .build();
    }
}
