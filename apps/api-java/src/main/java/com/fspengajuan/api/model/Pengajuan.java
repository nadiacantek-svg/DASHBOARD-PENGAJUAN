package com.fspengajuan.api.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "pengajuans")
@Data
public class Pengajuan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nama;

    @Column(nullable = false)
    private String nim;

    @JsonProperty("jenis_berkas")
    @Column(name = "jenis_berkas", nullable = false)
    private String jenisBerkas;

    @Column(columnDefinition = "TEXT")
    private String keterangan;

    @Column(nullable = false)
    private String status = "Diproses";

    @JsonProperty("catatan_admin")
    @Column(name = "catatan_admin", columnDefinition = "TEXT")
    private String catatanAdmin;

    @JsonProperty("created_at")
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @JsonProperty("updated_at")
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
