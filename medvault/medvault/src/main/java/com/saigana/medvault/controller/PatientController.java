package com.saigana.medvault.controller;

import com.saigana.medvault.dto.PatientProfileRequest;
import com.saigana.medvault.service.PatientService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patient")
public class PatientController {
    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping("/profile")
    public String createProfile(@RequestHeader("Authorization") String header,
                                @RequestBody PatientProfileRequest request) {

        String token = header.substring(7);
        String email = patientService.extractEmailFromToken(token);

        return patientService.createPatientProfile(email, request);
    }
}