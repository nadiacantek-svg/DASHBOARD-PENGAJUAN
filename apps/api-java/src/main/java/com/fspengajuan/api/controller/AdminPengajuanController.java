package com.fspengajuan.api.controller;

import com.fspengajuan.api.model.Pengajuan;
import com.fspengajuan.api.repository.PengajuanRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.time.Duration;

@RestController
@RequestMapping("/api/admin/pengajuan")
public class AdminPengajuanController {

    private final PengajuanRepository pengajuanRepository;

    public AdminPengajuanController(PengajuanRepository pengajuanRepository) {
        this.pengajuanRepository = pengajuanRepository;
    }

    @GetMapping
    public ResponseEntity<?> index(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int per_page) {

        Pageable pageable = PageRequest.of(page - 1, per_page, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Pengajuan> result;

        if (search != null && !search.isEmpty() && status != null && !status.isEmpty()) {
            result = pengajuanRepository.searchAllAndStatus(search, status, pageable);
        } else if (search != null && !search.isEmpty()) {
            result = pengajuanRepository.searchAll(search, pageable);
        } else if (status != null && !status.isEmpty()) {
            result = pengajuanRepository.findByStatus(status, pageable);
        } else {
            result = pengajuanRepository.findAll(pageable);
        }

        // Format to match Laravel pagination
        Map<String, Object> response = new HashMap<>();
        response.put("data", result.getContent());
        response.put("current_page", result.getNumber() + 1);
        response.put("total", result.getTotalElements());
        response.put("last_page", result.getTotalPages());
        response.put("per_page", result.getSize());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> show(@PathVariable Long id) {
        return pengajuanRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/progress")
    public ResponseEntity<?> updateProgress(@PathVariable Long id, @RequestBody Map<String, String> request) {
        return pengajuanRepository.findById(id).map(pengajuan -> {
            if (request.containsKey("status")) {
                pengajuan.setStatus(request.get("status"));
            }
            if (request.containsKey("catatan_admin")) {
                pengajuan.setCatatanAdmin(request.get("catatan_admin"));
            }
            pengajuanRepository.save(pengajuan);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Progress berhasil diupdate");
            response.put("data", pengajuan);
            return ResponseEntity.ok(response);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> destroy(@PathVariable Long id) {
        if (pengajuanRepository.existsById(id)) {
            pengajuanRepository.deleteById(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Pengajuan berhasil dihapus");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<?> stats() {
        long total = pengajuanRepository.count();
        long diproses = pengajuanRepository.countByStatus("Diproses");
        long ditandatangani = pengajuanRepository.countByStatus("Ditandatangani");
        long selesai = pengajuanRepository.countByStatus("Selesai");
        long ditolak = pengajuanRepository.countByStatus("Ditolak");

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().plusDays(1).atStartOfDay();
        long hariIni = pengajuanRepository.countByCreatedAtBetween(startOfDay, endOfDay);
        long perhatian = diproses;

        List<Map<String, Object>> weeklyStats = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("E");
        for (int i = 6; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            LocalDateTime start = date.atStartOfDay();
            LocalDateTime end = date.plusDays(1).atStartOfDay();
            
            Map<String, Object> stat = new HashMap<>();
            stat.put("date", date.format(formatter));
            stat.put("count", pengajuanRepository.countByCreatedAtBetween(start, end));
            weeklyStats.add(stat);
        }

        List<Pengajuan> recentPengajuans = pengajuanRepository.findTop4ByOrderByUpdatedAtDesc();
        List<Map<String, Object>> activities = new ArrayList<>();
        
        for (Pengajuan p : recentPengajuans) {
            Duration duration = Duration.between(p.getUpdatedAt(), LocalDateTime.now());
            String timeAgo = duration.toHours() > 0 ? duration.toHours() + " hours ago" : duration.toMinutes() + " minutes ago";
            
            String user, action, icon, iconColor, bgColor;
            if ("Selesai".equals(p.getStatus())) {
                user = "Admin";
                action = "menyelesaikan pengajuan " + p.getJenisBerkas() + " milik " + p.getNama();
                icon = "check_circle";
                iconColor = "text-[#10b981]";
                bgColor = "bg-[#10b981]/10";
            } else if ("Ditandatangani".equals(p.getStatus())) {
                user = "Dekan Fakultas Sains";
                action = "menandatangani berkas " + p.getJenisBerkas() + " milik " + p.getNama();
                icon = "edit";
                iconColor = "text-primary";
                bgColor = "bg-primary/10";
            } else if ("Ditolak".equals(p.getStatus())) {
                user = "Admin";
                action = "menolak pengajuan " + p.getJenisBerkas() + " milik " + p.getNama();
                icon = "error";
                iconColor = "text-error";
                bgColor = "bg-error/10";
            } else {
                user = p.getNama();
                action = "mengirim pengajuan baru: " + p.getJenisBerkas();
                icon = "description";
                iconColor = "text-blue-500";
                bgColor = "bg-blue-500/10";
            }
            
            Map<String, Object> activity = new HashMap<>();
            activity.put("user", user);
            activity.put("action", action);
            activity.put("time", timeAgo);
            activity.put("icon", icon);
            activity.put("iconColor", iconColor);
            activity.put("bgColor", bgColor);
            activities.add(activity);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("total", total);
        response.put("diproses", diproses);
        response.put("ditandatangani", ditandatangani);
        response.put("selesai", selesai);
        response.put("ditolak", ditolak);
        response.put("hari_ini", hariIni);
        response.put("perhatian", perhatian);
        response.put("weekly", weeklyStats);
        response.put("activities", activities);

        return ResponseEntity.ok(response);
    }
}
