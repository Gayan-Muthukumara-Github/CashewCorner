package com.example.cashewcorner.repository;

import com.example.cashewcorner.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    Optional<Inventory> findByProductProductIdAndLocation(Long productId, String location);

    List<Inventory> findByProductProductId(Long productId);

    @Query("SELECT i FROM Inventory i WHERE i.location = :location")
    List<Inventory> findByLocation(@Param("location") String location);

    @Query("SELECT i FROM Inventory i WHERE i.quantityOnHand > 0 ORDER BY i.product.name")
    List<Inventory> findAllWithStock();

    @Query("SELECT i FROM Inventory i WHERE i.quantityOnHand <= i.product.reorderLevel")
    List<Inventory> findLowStockItems();

    @Query("SELECT i FROM Inventory i JOIN i.product p WHERE " +
           "(:productName IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :productName, '%'))) AND " +
           "(:location IS NULL OR LOWER(i.location) LIKE LOWER(CONCAT('%', :location, '%')))")
    List<Inventory> searchInventory(@Param("productName") String productName, 
                                    @Param("location") String location);
}
