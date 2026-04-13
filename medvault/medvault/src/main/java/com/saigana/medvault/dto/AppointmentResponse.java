package com.saigana.medvault.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class AppointmentResponse {

    private Long id;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String reason;
    private String status;
    private String doctorName;
    private String patientName;

    public AppointmentResponse(Long id,
                               LocalDate appointmentDate,
                               LocalTime appointmentTime,
                               String reason,
                               String status,
                               String doctorName,
                               String patientName) {
        this.id = id;
        this.appointmentDate = appointmentDate;
        this.appointmentTime = appointmentTime;
        this.reason = reason;
        this.status = status;
        this.doctorName = doctorName;
        this.patientName = patientName;
    }

    public Long getId() { return id; }
    public LocalDate getAppointmentDate() { return appointmentDate; }
    public LocalTime getAppointmentTime() { return appointmentTime; }
    public String getReason() { return reason; }
    public String getStatus() { return status; }
    public String getDoctorName() { return doctorName; }
    public String getPatientName() { return patientName; }
}