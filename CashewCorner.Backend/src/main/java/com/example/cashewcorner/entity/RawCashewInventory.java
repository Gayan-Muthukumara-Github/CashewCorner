package com.example.cashewcorner.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * RawCashewInventory entity for tracking raw cashew stock levels.
 * Maintains current inventory snapshot per raw cashew type and location.
 */
@Entity
@Table(name = "raw_cashew_inventory")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = "rawCashew")
public class RawCashewInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "raw_cashew_inventory_id")
    @EqualsAndHashCode.Include
    private Long rawCashewInventoryId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cashew_type_id", nullable = false)
    private RawCashew rawCashew;

    @Column(name = "location", length = 150)
    private String location;

    @Column(name = "quantity_on_hand", precision = 18, scale = 4, nullable = false)
    @Builder.Default
    private BigDecimal quantityOnHand = BigDecimal.ZERO;

    @Column(name = "reserved_quantity", precision = 18, scale = 4, nullable = false)
    @Builder.Default
    private BigDecimal reservedQuantity = BigDecimal.ZERO;

    @Column(name = "last_updated", nullable = false)
    private LocalDateTime lastUpdated;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.lastUpdated = LocalDateTime.now();
    }

    /**
     * Calculate available quantity (on hand minus reserved).
     */
    public BigDecimal getAvailableQuantity() {
        return quantityOnHand.subtract(reservedQuantity);
    }
}

