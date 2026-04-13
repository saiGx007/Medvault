package com.saigana.medvault.repository;

import com.saigana.medvault.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId);

    // FIX: Added to support Doctor view
    List<Appointment> findByDoctorId(Long doctorId);

    List<Appointment> findByDoctorIdAndStatus(Long doctorId, Appointment.AppointmentStatus status);
}