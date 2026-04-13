package com.saigana.medvault.repository;

import com.saigana.medvault.entity.User;
import com.saigana.medvault.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    // FIX: Add this method to allow fetching all Doctors for the booking page
    List<User> findByRole(Role role);
}
