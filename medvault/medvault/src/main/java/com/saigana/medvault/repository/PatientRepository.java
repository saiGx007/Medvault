package com.saigana.medvault.repository;

import com.saigana.medvault.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    // Crucial for finding the profile linked to a User
    Optional<Patient> findByUserId(Long userId);
}