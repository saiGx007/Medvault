package com.saigana.medvault.dto;

public class FeedbackRequest {
    private Long appointmentId;
    private Long doctorId;
    private int rating;
    private String comment;

    // Getters
    public Long getAppointmentId() { return appointmentId; }
    public Long getDoctorId() { return doctorId; }
    public int getRating() { return rating; }
    public String getComment() { return comment; }

    // Setters
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    public void setRating(int rating) { this.rating = rating; }
    public void setComment(String comment) { this.comment = comment; }
}