package com.example.cashewcorner.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "suppliers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = {"purchaseOrders", "cashewType"})
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "supplier_id")
    @EqualsAndHashCode.Include
    private Long supplierId;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "phone", length = 50)
    private String phone;

    @Column(name = "email", length = 150)
    private String email;

    @Column(name = "contact_person", length = 150)
    private String contactPerson;

    @Column(name = "payment_terms", length = 255)
    private String paymentTerms;

    @Column(name = "is_approved")
    @Builder.Default
    private Boolean isApproved = false;

    // New fields for cashew-related data
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cashew_type_id")
    private RawCashew cashewType;

    @Column(name = "quantity", precision = 18, scale = 4)
    private BigDecimal quantity;

    @Column(name = "quality", length = 100)
    private String quality;

    @Column(name = "cost_per_unit", precision = 15, scale = 2)
    private BigDecimal costPerUnit;

    @Column(name = "season", length = 100)
    private String season;

    @Column(name = "payment_method", length = 100)
    private String paymentMethod;

    @Column(name = "distance", precision = 15, scale = 2)
    private BigDecimal distance;

    @Column(name = "delivery_method", length = 100)
    private String deliveryMethod;

    @Column(name = "delivery_cost", precision = 15, scale = 2)
    private BigDecimal deliveryCost;

    @Column(name = "time_taken_to_receive")
    private Integer timeTakenToReceive;

    @Column(name = "average_cost_per_unit", precision = 15, scale = 2)
    private BigDecimal averageCostPerUnit;

    @Column(name = "average_delivery_time")
    private Integer averageDeliveryTime;

    @Column(name = "average_delivery_cost", precision = 15, scale = 2)
    private BigDecimal averageDeliveryCost;

    @Column(name = "performances", columnDefinition = "TEXT")
    private String performances;

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

    @OneToMany(mappedBy = "supplier", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PurchaseOrder> purchaseOrders;
}
