package com.saigana.medvault.service;

import com.saigana.medvault.entity.*;
import com.saigana.medvault.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    @Autowired private AppointmentRepository appointmentRepository;
    @Autowired private DoctorRepository doctorRepository;
    @Autowired private PatientRepository patientRepository;
    @Autowired private UserRepository userRepository;
    private final PrescriptionRepository prescriptionRepository;
    public AppointmentService(AppointmentRepository appointmentRepository, PrescriptionRepository prescriptionRepository) {
        this.appointmentRepository = appointmentRepository;
        this.prescriptionRepository = prescriptionRepository;
    }
    @Transactional
    public void savePrescriptionAndComplete(Long appointmentId, String medicines, String notes) {
        // 1. Find the appointment
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // 2. Create and save the prescription
        Prescription prescription = new Prescription();
        prescription.setAppointment(appointment);
        prescription.setMedicines(medicines);
        prescription.setDoctorNotes(notes);
        prescription.setIssuedDate(LocalDate.now());

        prescriptionRepository.save(prescription);

        // 3. Update status to COMPLETED (Using your Enum)
        // This is the trigger that unlocks the feedback button for the patient
        appointment.setStatus(Appointment.AppointmentStatus.COMPLETED);
        appointmentRepository.save(appointment);
    }

    @Transactional
    public Appointment bookAppointment(String patientEmail, Long doctorUserId, String reason, String date, String time) {
        User user = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        Patient patient = patientRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));

        Doctor doctor = doctorRepository.findByUserId(doctorUserId)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setReason(reason);
        appointment.setAppointmentDate(LocalDate.parse(date));
        appointment.setAppointmentTime(LocalTime.parse(time));
        appointment.setStatus(Appointment.AppointmentStatus.PENDING);

        return appointmentRepository.save(appointment);
    }

    // Fetch all appointments for a doctor (Used for general list)
    public List<Appointment> getDoctorAppointments(String doctorEmail) {
        Doctor doctor = findDoctorByEmail(doctorEmail);
        return appointmentRepository.findByDoctorId(doctor.getId());
    }

    // NEW: Fetch specific appointments by status (Needed for your Consultation vs History tabs)
    public List<Appointment> getDoctorAppointmentsByStatus(String doctorEmail, Appointment.AppointmentStatus status) {
        Doctor doctor = findDoctorByEmail(doctorEmail);
        return appointmentRepository.findByDoctorIdAndStatus(doctor.getId(), status);
    }

    @Transactional
    public Appointment approveAppointment(String doctorEmail, Long appointmentId) {
        Appointment appointment = getVerifiedAppointment(doctorEmail, appointmentId);
        appointment.setStatus(Appointment.AppointmentStatus.APPROVED);
        return appointmentRepository.save(appointment);
    }

    @Transactional
    public Appointment rejectAppointment(String doctorEmail, Long appointmentId) {
        Appointment appointment = getVerifiedAppointment(doctorEmail, appointmentId);
        appointment.setStatus(Appointment.AppointmentStatus.REJECTED);
        return appointmentRepository.save(appointment);
    }

    @Transactional
    public Appointment completeAppointment(String doctorEmail, Long appointmentId) {
        Appointment appointment = getVerifiedAppointment(doctorEmail, appointmentId);
        appointment.setStatus(Appointment.AppointmentStatus.COMPLETED);
        return appointmentRepository.save(appointment);
    }

    // --- Private Helpers to keep code DRY (Don't Repeat Yourself) ---

    private Doctor findDoctorByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Doctor not found with email: " + email));
        return doctorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Doctor profile not found for user: " + user.getFullName()));
    }
    public Map<LocalDate, Long> getAppointmentStats(String doctorEmail) {
        User user = userRepository.findByEmail(doctorEmail).orElseThrow();
        Doctor doctor = doctorRepository.findByUserId(user.getId()).orElseThrow();

        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctor.getId());

        // Changing the Map key to LocalDate matches your entity's return type
        return appointments.stream()
                .collect(Collectors.groupingBy(Appointment::getAppointmentDate, Collectors.counting()));
    }

    private Appointment getVerifiedAppointment(String email, Long appointmentId) {
        Doctor doctor = findDoctorByEmail(email);
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + appointmentId));

        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            throw new RuntimeException("Access Denied: You are not assigned to this appointment.");
        }
        return appointment;
    }
    // Add this to src/main/java/com/saigana.medvault.service/AppointmentService.java

    public List<Appointment> getPatientAppointments(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Patient patient = patientRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));
        return appointmentRepository.findByPatientId(patient.getId());
    }
    // AppointmentService.java

    @Transactional
    public Appointment processPayment(String patientEmail, Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // FIX: Use equalsIgnoreCase to prevent email mismatch errors
        String ownerEmail = appointment.getPatient().getUser().getEmail();
        if (!ownerEmail.equalsIgnoreCase(patientEmail)) {
            throw new RuntimeException("Unauthorized: This appointment belongs to " + ownerEmail);
        }

        // Double check the status in your Database (MySQL)
        if (appointment.getStatus() != Appointment.AppointmentStatus.APPROVED) {
            throw new RuntimeException("Payment failed: Appointment status is " + appointment.getStatus() + " but must be APPROVED");
        }

        appointment.setStatus(Appointment.AppointmentStatus.PAID);
        return appointmentRepository.save(appointment);
    }
    }
