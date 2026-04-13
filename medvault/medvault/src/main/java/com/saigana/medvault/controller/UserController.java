package com.saigana.medvault.controller;

import com.saigana.medvault.entity.User;
import com.saigana.medvault.entity.Role; // Ensure this import is here
import com.saigana.medvault.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/doctors")
    public ResponseEntity<List<User>> getAllDoctors() {
        // Now findByRole will be recognized by the compiler
        List<User> doctors = userRepository.findByRole(Role.DOCTOR);
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }
    // Add this to src/main/java/com/saigana/medvault/controller/UserController.java

    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@RequestBody User updatedData, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update common User fields
        user.setFullName(updatedData.getFullName());
        user.setGender(updatedData.getGender());
        user.setDob(updatedData.getDob());
        user.setBloodGroup(updatedData.getBloodGroup());
        user.setOccupation(updatedData.getOccupation());

        // Update Role-specific fields if Doctor
        if (user.getRole() == Role.DOCTOR) {
            user.setSpecialization(updatedData.getSpecialization());
            user.setDesignation(updatedData.getDesignation());
            user.setConsultationFees(updatedData.getConsultationFees());
        }

        userRepository.save(user);
        return ResponseEntity.ok("Profile updated successfully");
    }
}