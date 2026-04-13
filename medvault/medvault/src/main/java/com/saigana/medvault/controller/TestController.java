package com.saigana.medvault.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/patient/dashboard")
    public String patientDashboard() {
        return "Patient dashboard";
    }

    @GetMapping("/api/admin/dashboard")
    public String adminDashboard() {
        return "Admin dashboard";
    }
}