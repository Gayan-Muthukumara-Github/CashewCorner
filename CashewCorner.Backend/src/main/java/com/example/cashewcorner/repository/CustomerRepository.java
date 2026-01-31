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

    @Query(value = "SELECT * FROM customer c WHERE c.is_active = true AND " +
           "(LOWER(c.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.phone) LIKE LOWER(CONCAT('%', :searchTerm, '%')))",
           nativeQuery = true)
    List<Customer> searchByNameOrPhone(@Param("searchTerm") String searchTerm);

    Optional<Customer> findByEmail(String email);

    Optional<Customer> findByPhone(String phone);

    @Query(value = "SELECT * FROM customer c WHERE c.is_active = true " +
           "AND (:name = '' OR LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
           "AND (:phone = '' OR LOWER(c.phone) LIKE LOWER(CONCAT('%', :phone, '%'))) " +
           "AND (:email = '' OR LOWER(c.email) LIKE LOWER(CONCAT('%', :email, '%'))) " +
           "AND (:address = '' OR LOWER(c.address) LIKE LOWER(CONCAT('%', :address, '%'))) " +
           "AND (:type = '' OR LOWER(c.type) = LOWER(:type))",
           nativeQuery = true)
    List<Customer> searchCustomers(@Param("name") String name,
                                   @Param("phone") String phone,
                                   @Param("email") String email,
                                   @Param("address") String address,
                                   @Param("type") String type);
}
