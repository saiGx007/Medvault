package com.saigana.medvault.repository;

import com.saigana.medvault.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    // Helper to find prescription by appointment for the Patient's Medical Records page
    Optional<Prescription> findByAppointmentId(Long appointmentId);
}