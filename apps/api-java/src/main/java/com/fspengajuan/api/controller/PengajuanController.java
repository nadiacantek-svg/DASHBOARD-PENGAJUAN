package com.fspengajuan.api.controller;

import com.fspengajuan.api.model.Pengajuan;
import com.fspengajuan.api.repository.PengajuanRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pengajuan")
public class PengajuanController {

    private final PengajuanRepository pengajuanRepository;

    public PengajuanController(PengajuanRepository pengajuanRepository) {
        this.pengajuanRepository = pengajuanRepository;
    }

    @GetMapping
    public ResponseEntity<List<Pengajuan>> index() {
        return ResponseEntity.ok(pengajuanRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")));
    }

    @PostMapping
    public ResponseEntity<?> store(@RequestBody Pengajuan request) {
        if (request.getNama() == null || request.getNim() == null || request.getJenisBerkas() == null) {
            return ResponseEntity.badRequest().body("Nama, NIM, dan Jenis Berkas wajib diisi");
        }
        
        request.setStatus("Diproses");
        Pengajuan saved = pengajuanRepository.save(request);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Pengajuan berhasil dibuat!");
        response.put("data", saved);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{identifier}")
    public ResponseEntity<?> show(@PathVariable String identifier) {
        List<Pengajuan> pengajuans = pengajuanRepository
                .findByNimOrNamaContainingIgnoreCaseOrderByCreatedAtDesc(identifier, identifier);

        if (pengajuans.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Pengajuan tidak ditemukan");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        return ResponseEntity.ok(pengajuans);
    }
}
