package com.saigana.medvault.entity;

public enum AppointmentStatus {
    PENDING,   // Patient just requested
    APPROVED,  // Doctor accepted, waiting for patient to pay
    PAID,      // Patient paid, ready for consultation
    REJECTED,
    COMPLETED
}