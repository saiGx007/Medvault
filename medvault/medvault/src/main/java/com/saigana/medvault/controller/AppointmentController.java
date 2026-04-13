package com.saigana.medvault.controller;

import com.saigana.medvault.entity.Appointment;
import com.saigana.medvault.service.AppointmentService;
import com.saigana.medvault.repository.AppointmentRepository; // Added this
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private AppointmentRepository appointmentRepository; // Injection fixed here

    @PostMapping("/book")
    public ResponseEntity<?> book(@RequestBody Map<String, String> payload, Authentication authentication) {
        String patientEmail = authentication.getName();
        Long doctorUserId = Long.parseLong(payload.get("doctorId"));
        String reason = payload.get("reason");
        String date = payload.get("date");
        String time = payload.get("time");

        Appointment appointment = appointmentService.bookAppointment(
                patientEmail, doctorUserId, reason, date, time
        );

        return ResponseEntity.ok(appointment);
    }

    @GetMapping("/patient/my-bookings")
    public ResponseEntity<List<Appointment>> getMyBookings(Authentication authentication) {
        String email = authentication.getName();
        List<Appointment> bookings = appointmentService.getPatientAppointments(email);
        return ResponseEntity.ok(bookings);
    }

    @PostMapping("/pay/{id}")
    public ResponseEntity<?> payForAppointment(@PathVariable Long id, Authentication authentication) {
        try {
            String patientEmail = authentication.getName();
            Appointment updatedAppointment = appointmentService.processPayment(patientEmail, id);
            return ResponseEntity.ok(updatedAppointment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/doctor/stats")
    public ResponseEntity<Map<LocalDate, Long>> getStats(Authentication auth) {
        return ResponseEntity.ok(appointmentService.getAppointmentStats(auth.getName()));
    }

    // This fixed method now uses the injected repository
    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        return appointmentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}