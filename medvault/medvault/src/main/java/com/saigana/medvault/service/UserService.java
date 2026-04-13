package com.saigana.medvault.service;

import com.saigana.medvault.dto.RegisterRequest;
import com.saigana.medvault.dto.LoginRequest;
import com.saigana.medvault.entity.User;
import com.saigana.medvault.entity.Patient;
import com.saigana.medvault.entity.Doctor;
import com.saigana.medvault.entity.Role;
import com.saigana.medvault.repository.UserRepository;
import com.saigana.medvault.repository.PatientRepository;
import com.saigana.medvault.repository.DoctorRepository;
import com.saigana.medvault.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private PatientRepository patientRepository;
    @Autowired private DoctorRepository doctorRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtService jwtService;

    public String loginUser(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        return jwtService.generateToken(user.getEmail(), user.getRole().name());
    }

    @Transactional
    public String registerUser(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRole(request.getRole());
        user.setGender(request.getGender());
        user.setDob(request.getDob());
        user.setBloodGroup(request.getBloodGroup());
        user.setSpecialization(request.getSpecialization());
        user.setConsultationFees(request.getConsultationFees());
        user.setDesignation(request.getDesignation());
        user.setOccupation(request.getOccupation());
        user.setActive(true);

        User savedUser = userRepository.save(user);

        if (request.getRole() == Role.PATIENT) {
            Patient patient = new Patient();
            patient.setUser(savedUser); // FIX: Pass the user object, not just ID
            patient.setBloodGroup(request.getBloodGroup());
            patient.setDateOfBirth(request.getDob());
            patient.setAddress("Not Provided");
            patient.setPhone("Not Provided");
            patientRepository.save(patient);

        } else if (request.getRole() == Role.DOCTOR) {
            Doctor doctor = new Doctor();
            doctor.setUser(savedUser); // FIX: Pass the user object, not just ID
            doctor.setSpecialization(request.getSpecialization());
            doctor.setExperienceYears(0);
            doctor.setHospitalName("Not Provided");
            doctor.setLicenseNumber("PENDING");
            doctorRepository.save(doctor);
        }

        return "User registered and profile created successfully";
    }
}