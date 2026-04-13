package com.saigana.medvault.service;

import com.saigana.medvault.dto.PatientProfileRequest;
import com.saigana.medvault.entity.Patient;
import com.saigana.medvault.entity.User;
import com.saigana.medvault.repository.PatientRepository;
import com.saigana.medvault.repository.UserRepository;
import com.saigana.medvault.security.JwtService;
import org.springframework.stereotype.Service;

@Service
public class PatientService {
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public PatientService(PatientRepository patientRepository,
                          UserRepository userRepository,
                          JwtService jwtService) {
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    public String extractEmailFromToken(String token) {
        return jwtService.extractAllClaims(token).getSubject();
    }

    public String createPatientProfile(String email, PatientProfileRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getRole().name().equals("PATIENT")) {
            throw new RuntimeException("Only PATIENT can create profile");
        }

        Patient patient = new Patient();
        patient.setPhone(request.getPhone());
        patient.setAddress(request.getAddress());
        patient.setBloodGroup(request.getBloodGroup());
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setUser(user);

        patientRepository.save(patient);

        return "Patient profile created";
    }
}