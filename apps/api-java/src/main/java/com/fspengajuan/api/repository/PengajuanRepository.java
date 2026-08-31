package com.fspengajuan.api.repository;

import com.fspengajuan.api.model.Pengajuan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface PengajuanRepository extends JpaRepository<Pengajuan, Long> {
    List<Pengajuan> findByNimOrNamaContainingIgnoreCaseOrderByCreatedAtDesc(String nim, String nama);
    
    @Query("SELECT p FROM Pengajuan p WHERE LOWER(p.nama) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.nim) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.jenisBerkas) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Pengajuan> searchAll(String search, Pageable pageable);

    Page<Pengajuan> findByStatus(String status, Pageable pageable);

    @Query("SELECT p FROM Pengajuan p WHERE (LOWER(p.nama) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.nim) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.jenisBerkas) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND p.status = :status")
    Page<Pengajuan> searchAllAndStatus(String search, String status, Pageable pageable);

    long countByStatus(String status);
    
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    
    List<Pengajuan> findTop4ByOrderByUpdatedAtDesc();
}
