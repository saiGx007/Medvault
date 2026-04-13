package com.saigana.medvault.controller;

import com.saigana.medvault.entity.Prescription;
import com.saigana.medvault.service.AppointmentService;
import com.saigana.medvault.service.PrescriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    private final AppointmentService appointmentService;
    private final PrescriptionService prescriptionService; // ADD THIS

    // FIX: Inject both services
    public PrescriptionController(AppointmentService appointmentService, PrescriptionService prescriptionService) {
        this.appointmentService = appointmentService;
        this.prescriptionService = prescriptionService;
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitPrescription(@RequestBody Map<String, Object> payload) {
        Long appointmentId = Long.valueOf(payload.get("appointmentId").toString());
        String medicines = payload.get("medicines").toString();
        String notes = payload.get("notes").toString();

        appointmentService.savePrescriptionAndComplete(appointmentId, medicines, notes);
        return ResponseEntity.ok("Prescription sent and appointment completed.");
    }

    @GetMapping("/patient/my-records")
    public ResponseEntity<List<Prescription>> getMyRecords(Principal principal) {
        // FIX: Use the injected instance, not a static call
        return ResponseEntity.ok(prescriptionService.getPrescriptionsForPatient(principal.getName()));
    }
}