package com.example.cashewcorner.service;

import com.example.cashewcorner.dto.*;
import com.example.cashewcorner.entity.Employee;
import com.example.cashewcorner.entity.EmployeeDuty;
import com.example.cashewcorner.entity.PurchaseOrder;
import com.example.cashewcorner.entity.SalesOrder;
import com.example.cashewcorner.exception.DuplicateResourceException;
import com.example.cashewcorner.exception.ResourceNotFoundException;
import com.example.cashewcorner.repository.EmployeeDutyRepository;
import com.example.cashewcorner.repository.EmployeeRepository;
import com.example.cashewcorner.repository.PurchaseOrderRepository;
import com.example.cashewcorner.repository.SalesOrderRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final EmployeeDutyRepository dutyRepository;
    private final SalesOrderRepository salesOrderRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;

    public EmployeeService(EmployeeRepository employeeRepository,
                          EmployeeDutyRepository dutyRepository,
                          SalesOrderRepository salesOrderRepository,
                          PurchaseOrderRepository purchaseOrderRepository) {
        this.employeeRepository = employeeRepository;
        this.dutyRepository = dutyRepository;
        this.salesOrderRepository = salesOrderRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
    }

    public EmployeeDto createEmployee(CreateEmployeeRequestDto request) {
        log.info("Creating employee - [code={}, name={}]", request.getEmployeeCode(), request.getFirstName());

        // Check for duplicate employee code
        employeeRepository.findByEmployeeCode(request.getEmployeeCode()).ifPresent(e -> {
            throw new DuplicateResourceException("Employee with code " + request.getEmployeeCode() + " already exists");
        });

        Employee employee = Employee.builder()
                .employeeCode(request.getEmployeeCode())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .designation(request.getDesignation())
                .department(request.getDepartment())
                .phone(request.getPhone())
                .email(request.getEmail())
                .hireDate(request.getHireDate())
                .salaryBase(request.getSalaryBase())
                .isActive(true)
                .build();

        employee = employeeRepository.save(employee);
        log.info("Employee created successfully - [employeeId={}, code={}]", 
                employee.getEmployeeId(), employee.getEmployeeCode());

        return mapToDto(employee);
    }

    public EmployeeDto updateEmployee(Long employeeId, UpdateEmployeeRequestDto request) {
        log.info("Updating employee - [employeeId={}]", employeeId);

        Employee employee = employeeRepository.findByEmployeeIdAndIsActiveTrue(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));

        if (request.getFirstName() != null) {
            employee.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            employee.setLastName(request.getLastName());
        }
        if (request.getDesignation() != null) {
            employee.setDesignation(request.getDesignation());
        }
        if (request.getDepartment() != null) {
            employee.setDepartment(request.getDepartment());
        }
        if (request.getPhone() != null) {
            employee.setPhone(request.getPhone());
        }
        if (request.getEmail() != null) {
            employee.setEmail(request.getEmail());
        }
        if (request.getHireDate() != null) {
            employee.setHireDate(request.getHireDate());
        }
        if (request.getSalaryBase() != null) {
            employee.setSalaryBase(request.getSalaryBase());
        }

        employee = employeeRepository.save(employee);
        log.info("Employee updated successfully - [employeeId={}]", employeeId);

        return mapToDto(employee);
    }

    public void deleteEmployee(Long employeeId) {
        log.info("Deleting employee - [employeeId={}]", employeeId);

        Employee employee = employeeRepository.findByEmployeeIdAndIsActiveTrue(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));

        employee.setIsActive(false);
        employeeRepository.save(employee);

        log.info("Employee deleted successfully - [employeeId={}]", employeeId);
    }

    @Transactional(readOnly = true)
    public List<EmployeeDto> getAllEmployees() {
        log.info("Fetching all active employees");
        return employeeRepository.findByIsActiveTrue().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EmployeeDto getEmployeeById(Long employeeId) {
        log.info("Fetching employee - [employeeId={}]", employeeId);
        Employee employee = employeeRepository.findByEmployeeIdAndIsActiveTrue(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));
        return mapToDto(employee);
    }

    @Transactional(readOnly = true)
    public List<EmployeeDto> searchEmployees(String searchTerm) {
        log.info("Searching employees - [searchTerm={}]", searchTerm);
        return employeeRepository.searchEmployees(searchTerm).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public EmployeeDutyDto assignDuty(Long employeeId, AssignDutyRequestDto request) {
        log.info("Assigning duty to employee - [employeeId={}, taskType={}]", employeeId, request.getTaskType());

        Employee employee = employeeRepository.findByEmployeeIdAndIsActiveTrue(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));

        EmployeeDuty duty = EmployeeDuty.builder()
                .employee(employee)
                .taskType(request.getTaskType())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status("assigned")
                .notes(request.getNotes())
                .build();

        // Link to sales order if provided
        if (request.getSalesOrderId() != null) {
            SalesOrder salesOrder = salesOrderRepository.findBySalesOrderIdAndIsActiveTrue(request.getSalesOrderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Sales order not found with id: " + request.getSalesOrderId()));
            duty.setSalesOrder(salesOrder);
        }

        // Link to purchase order if provided
        if (request.getPurchaseOrderId() != null) {
            PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(request.getPurchaseOrderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Purchase order not found with id: " + request.getPurchaseOrderId()));
            duty.setPurchaseOrder(purchaseOrder);
        }

        duty = dutyRepository.save(duty);
        log.info("Duty assigned successfully - [dutyId={}, employeeId={}]", duty.getDutyId(), employeeId);

        return mapDutyToDto(duty);
    }

    public EmployeeDutyDto updateDutyStatus(Long dutyId, String status) {
        log.info("Updating duty status - [dutyId={}, status={}]", dutyId, status);

        EmployeeDuty duty = dutyRepository.findById(dutyId)
                .orElseThrow(() -> new ResourceNotFoundException("Duty not found with id: " + dutyId));

        duty.setStatus(status);
        duty = dutyRepository.save(duty);

        log.info("Duty status updated successfully - [dutyId={}]", dutyId);
        return mapDutyToDto(duty);
    }

    @Transactional(readOnly = true)
    public List<EmployeeDutyDto> getEmployeeDuties(Long employeeId) {
        log.info("Fetching duties for employee - [employeeId={}]", employeeId);

        // Verify employee exists
        employeeRepository.findByEmployeeIdAndIsActiveTrue(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));

        return dutyRepository.findByEmployeeId(employeeId).stream()
                .map(this::mapDutyToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EmployeeDutyDto> getDutiesByStatus(String status) {
        log.info("Fetching duties by status - [status={}]", status);
        return dutyRepository.findByStatus(status).stream()
                .map(this::mapDutyToDto)
                .collect(Collectors.toList());
    }

    private EmployeeDto mapToDto(Employee employee) {
        return EmployeeDto.builder()
                .employeeId(employee.getEmployeeId())
                .employeeCode(employee.getEmployeeCode())
                .firstName(employee.getFirstName())
                .lastName(employee.getLastName())
                .fullName(employee.getFullName())
                .designation(employee.getDesignation())
                .department(employee.getDepartment())
                .phone(employee.getPhone())
                .email(employee.getEmail())
                .hireDate(employee.getHireDate())
                .salaryBase(employee.getSalaryBase())
                .isActive(employee.getIsActive())
                .createdAt(employee.getCreatedAt())
                .updatedAt(employee.getUpdatedAt())
                .build();
    }

    private EmployeeDutyDto mapDutyToDto(EmployeeDuty duty) {
        return EmployeeDutyDto.builder()
                .dutyId(duty.getDutyId())
                .employeeId(duty.getEmployee().getEmployeeId())
                .employeeName(duty.getEmployee().getFullName())
                .taskType(duty.getTaskType())
                .salesOrderId(duty.getSalesOrder() != null ? duty.getSalesOrder().getSalesOrderId() : null)
                .salesOrderNumber(duty.getSalesOrder() != null ? duty.getSalesOrder().getSoNumber() : null)
                .purchaseOrderId(duty.getPurchaseOrder() != null ? duty.getPurchaseOrder().getPurchaseOrderId() : null)
                .purchaseOrderNumber(duty.getPurchaseOrder() != null ? duty.getPurchaseOrder().getPoNumber() : null)
                .startDate(duty.getStartDate())
                .endDate(duty.getEndDate())
                .status(duty.getStatus())
                .notes(duty.getNotes())
                .createdAt(duty.getCreatedAt())
                .updatedAt(duty.getUpdatedAt())
                .build();
    }
}
