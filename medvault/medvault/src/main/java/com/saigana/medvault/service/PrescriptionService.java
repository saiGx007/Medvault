package com.saigana.medvault.service;

import com.saigana.medvault.entity.Prescription;
import com.saigana.medvault.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PrescriptionService {

    private static PrescriptionRepository prescriptionRepository = null;

    public PrescriptionService(PrescriptionRepository prescriptionRepository) {
        this.prescriptionRepository = prescriptionRepository;
    }

    public static List<Prescription> getPrescriptionsForPatient(String email) {
        // This logic finds all prescriptions where the associated appointment belongs to this patient email
        return prescriptionRepository.findAll().stream()
                .filter(p -> p.getAppointment().getPatient().getUser().getEmail().equals(email))
                .toList();
    }
}