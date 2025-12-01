package com.example.cashewcorner.repository;

import com.example.cashewcorner.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    List<Customer> findByIsActiveTrue();

    Optional<Customer> findByCustomerIdAndIsActiveTrue(Long customerId);

    @Query("SELECT c FROM Customer c WHERE c.isActive = true AND " +
           "(LOWER(c.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.phone) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Customer> searchByNameOrPhone(@Param("searchTerm") String searchTerm);

    Optional<Customer> findByEmail(String email);

    Optional<Customer> findByPhone(String phone);
}
