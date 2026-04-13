package com.saigana.medvault.repository;

import com.saigana.medvault.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    // This looks for the 'id' field inside the 'user' object of the Doctor entity
    Optional<Doctor> findByUserId(Long userId);
}