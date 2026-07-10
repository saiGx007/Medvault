package com.saigana.medvault.repository;

import com.saigana.medvault.entity.AccessRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AccessRequestRepository extends JpaRepository<AccessRequest, Long> {

    Optional<AccessRequest> findByDoctorIdAndPatientIdAndStatus(Long doctorId, Long patientId, AccessRequest.RequestStatus status);

    List<AccessRequest> findByPatientIdAndStatus(Long patientId, AccessRequest.RequestStatus status);

    // Counts the pending requests for the doctor dashboard metrics
    long countByDoctorIdAndStatus(Long doctorId, AccessRequest.RequestStatus status);

    @Query("SELECT a FROM AccessRequest a WHERE a.doctor.id = :doctorId " +
            "AND a.patient.id = :patientId " +
            "AND a.status = 'APPROVED' " +
            "AND a.expiryDate > :currentTime")
    Optional<AccessRequest> findActivePermission(
            @Param("doctorId") Long doctorId,
            @Param("patientId") Long patientId,
            @Param("currentTime") LocalDateTime currentTime
    );
}