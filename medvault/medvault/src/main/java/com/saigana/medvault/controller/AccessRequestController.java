package com.saigana.medvault.controller;

import com.saigana.medvault.entity.AccessRequest;
import com.saigana.medvault.entity.Doctor;
import com.saigana.medvault.repository.AccessRequestRepository;
import com.saigana.medvault.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/access-requests")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AccessRequestController {

    @Autowired
    private AccessRequestRepository accessRequestRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    // 🔍 Endpoint for checking active vault permission parameters
    @GetMapping("/check/{doctorId}/{patientId}")
    public ResponseEntity<?> checkPermission(@PathVariable Long doctorId, @PathVariable Long patientId) {
        boolean hasAccess = accessRequestRepository.findActivePermission(doctorId, patientId, LocalDateTime.now()).isPresent();
        return ResponseEntity.ok(Map.of("active", hasAccess));
    }

    // 📊 Endpoint that returns live pending counts to the doctor dashboard metrics card
    @GetMapping("/doctor/pending-count/{doctorUserId}")
    public ResponseEntity<?> getDoctorPendingCount(@PathVariable Long doctorUserId) {
        try {
            Doctor doctor = doctorRepository.findByUserId(doctorUserId)
                    .orElseThrow(() -> new RuntimeException("Doctor profile record not found"));

            long pendingCount = accessRequestRepository.countByDoctorIdAndStatus(doctor.getId(), AccessRequest.RequestStatus.PENDING);
            return ResponseEntity.ok(Map.of("pendingCount", pendingCount));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("pendingCount", 0));
        }
    }
}