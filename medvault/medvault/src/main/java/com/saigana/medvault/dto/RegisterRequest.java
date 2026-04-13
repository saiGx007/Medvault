package com.saigana.medvault.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.saigana.medvault.entity.Role;

@JsonIgnoreProperties(ignoreUnknown = true) // Ignores any unexpected fields from JSON
public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private Role role;
    private String gender;
    private String dob;
    private String bloodGroup;
    private String occupation;
    private String designation;
    private String specialization;
    private Double consultationFees;

    public RegisterRequest() {}

    // Getters and Setters
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
    public Double getConsultationFees() { return consultationFees; }
    public void setConsultationFees(Double consultationFees) { this.consultationFees = consultationFees; }
}