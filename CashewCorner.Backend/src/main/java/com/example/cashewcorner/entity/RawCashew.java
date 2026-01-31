package com.example.cashewcorner.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * RawCashew entity mapped to the raw_cashew table.
 * Represents different types and qualities of raw cashew nuts.
 */
@Entity
@Table(name = "raw_cashew")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RawCashew {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cashew_type_id")
    private Long cashewTypeId;

    @Column(name = "cashew_type", nullable = false, length = 100)
    private String cashewType;

    @Column(name = "cashew_quality", length = 100)
    private String cashewQuality;

    @Column(name = "created_by")
    private Long createdBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_by")
    private Long updatedBy;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}

