package com.saigana.medvault.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "doctors")
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer experienceYears;
    private String hospitalName;
    private String licenseNumber;
    private String specialization;

    // FIX: Establish a real relationship so getUser() works
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    public Doctor() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }
    public String getHospitalName() { return hospitalName; }
    public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }
    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    // This is the method AppointmentService is looking for
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}