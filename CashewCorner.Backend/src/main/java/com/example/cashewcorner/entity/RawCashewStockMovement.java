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
 * RawCashewStockMovement entity for tracking raw cashew inventory movements.
 * Acts as a ledger for all stock changes (receives, adjustments, usage, etc.).
 */
@Entity
@Table(name = "raw_cashew_stock_movements")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = "rawCashew")
public class RawCashewStockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "movement_id")
    @EqualsAndHashCode.Include
    private Long movementId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cashew_type_id", nullable = false)
    private RawCashew rawCashew;

    @Column(name = "movement_type", nullable = false, length = 50)
    private String movementType;

    @Column(name = "related_type", length = 50)
    private String relatedType;

    @Column(name = "related_id")
    private Long relatedId;

    @Column(name = "quantity", precision = 18, scale = 4, nullable = false)
    private BigDecimal quantity;

    @Column(name = "balance_after", precision = 18, scale = 4)
    private BigDecimal balanceAfter;

    @Column(name = "movement_date", nullable = false)
    @Builder.Default
    private LocalDateTime movementDate = LocalDateTime.now();

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @PrePersist
    protected void onCreate() {
        if (movementDate == null) {
            movementDate = LocalDateTime.now();
        }
    }
}

