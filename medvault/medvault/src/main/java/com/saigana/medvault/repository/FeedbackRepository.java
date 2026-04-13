package com.saigana.medvault.repository;

import com.saigana.medvault.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByDoctorId(Long doctorId);
    boolean existsByAppointmentId(Long appointmentId);
}