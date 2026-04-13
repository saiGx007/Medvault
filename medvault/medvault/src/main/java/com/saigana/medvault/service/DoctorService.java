package com.saigana.medvault.service;

import com.saigana.medvault.dto.DoctorProfileRequest;
import com.saigana.medvault.entity.Doctor;
import com.saigana.medvault.entity.User;
import com.saigana.medvault.repository.DoctorRepository;
import com.saigana.medvault.repository.UserRepository;
import com.saigana.medvault.security.JwtService;
import org.springframework.stereotype.Service;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public DoctorService(DoctorRepository doctorRepository,
                         UserRepository userRepository,
                         JwtService jwtService) {
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public String createDoctorProfile(String token, DoctorProfileRequest request) {

        String email = jwtService.extractAllClaims(token).getSubject();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getRole().name().equals("DOCTOR")) {
            throw new RuntimeException("Only DOCTOR can create profile");
        }

        Doctor doctor = new Doctor();
        doctor.setSpecialization(request.getSpecialization());
        doctor.setHospitalName(request.getHospitalName());
        doctor.setExperienceYears(request.getExperienceYears());
        doctor.setLicenseNumber(request.getLicenseNumber());
        doctor.setUser(user);

        doctorRepository.save(doctor);

        return "Doctor profile created";
    }
}
