package com.saigana.medvault.controller;

import com.saigana.medvault.dto.FeedbackRequest;
import com.saigana.medvault.entity.Feedback;
import com.saigana.medvault.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    // src/main/java/com/saigana/medvault/controller/FeedbackController.java

    @PostMapping("/submit")
    public ResponseEntity<?> submitFeedback(@RequestBody FeedbackRequest request, Authentication authentication) {
        String email = authentication.getName();
        // Ensure these 5 arguments match the Service method exactly
        Feedback feedback = feedbackService.submitFeedback(
                email,
                request.getAppointmentId(),
                request.getDoctorId(),
                request.getRating(),
                request.getComment()
        );
        return ResponseEntity.ok("Feedback submitted successfully");
    }
    // FeedbackController.java

    @GetMapping("/doctor/my-reviews")
    public ResponseEntity<List<Feedback>> getDoctorReviews(Authentication authentication) {
        String email = authentication.getName();
        // Assuming you have a method in service to find doctor by email first
        List<Feedback> reviews = feedbackService.getReviewsForDoctor(email);
        return ResponseEntity.ok(reviews);
    }
}