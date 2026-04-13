package com.saigana.medvault.controller;

import com.saigana.medvault.entity.Appointment;
import com.saigana.medvault.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor")
public class DoctorController {

    @Autowired
    private AppointmentService appointmentService;

    // FIX: Changed return type from String to Appointment
    @PostMapping("/approve/{id}")
    public ResponseEntity<Appointment> approveAppointment(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        Appointment appointment = appointmentService.approveAppointment(email, id);
        return ResponseEntity.ok(appointment);
    }

    // FIX: Changed return type from String to Appointment
    @PostMapping("/reject/{id}")
    public ResponseEntity<Appointment> rejectAppointment(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        Appointment appointment = appointmentService.rejectAppointment(email, id);
        return ResponseEntity.ok(appointment);
    }

    // FIX: Changed return type from String to Appointment
    @PostMapping("/complete/{id}")
    public ResponseEntity<Appointment> completeAppointment(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        Appointment appointment = appointmentService.completeAppointment(email, id);
        return ResponseEntity.ok(appointment);
    }

    // FIX: Changed return type to List<Appointment> to match Service
    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getDoctorAppointments(Authentication authentication) {
        String email = authentication.getName();
        List<Appointment> appointments = appointmentService.getDoctorAppointments(email);
        return ResponseEntity.ok(appointments);
    }
}