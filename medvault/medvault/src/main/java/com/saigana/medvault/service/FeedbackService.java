package com.saigana.medvault.service;

import com.saigana.medvault.entity.*;
import com.saigana.medvault.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
// FIX 1: Missing Import for Transactional
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FeedbackService {

    @Autowired private FeedbackRepository feedbackRepository;
    // FIX 2: Missing declaration of appointmentRepository
    @Autowired private AppointmentRepository appointmentRepository;
    @Autowired private DoctorRepository doctorRepository;
    @Autowired private UserRepository userRepository;

    @Transactional
    public Feedback submitFeedback(String patientEmail, Long appointmentId, Long doctorId, int rating, String comment) {
        // 1. Verify Appointment exists
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (appointment.getStatus() != Appointment.AppointmentStatus.COMPLETED) {
            throw new RuntimeException("Cannot rate an incomplete consultation.");
        }

        // 2. Check if feedback already exists
        if (feedbackRepository.existsByAppointmentId(appointmentId)) {
            throw new RuntimeException("Feedback already submitted for this session.");
        }

        // 3. Create Feedback
        Feedback feedback = new Feedback();
        feedback.setAppointment(appointment);
        feedback.setDoctor(appointment.getDoctor());
        feedback.setPatient(appointment.getPatient());
        feedback.setRating(rating);
        feedback.setComment(comment);

        return feedbackRepository.save(feedback);
    }

    public List<Feedback> getReviewsForDoctor(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Doctor doctor = doctorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

        return feedbackRepository.findByDoctorId(doctor.getId());
    }
}