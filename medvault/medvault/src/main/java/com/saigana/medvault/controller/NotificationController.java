package com.saigana.medvault.controller;

import com.saigana.medvault.entity.Notification;
import com.saigana.medvault.entity.User;
import com.saigana.medvault.service.NotificationService;
import com.saigana.medvault.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired private NotificationService notificationService;
    @Autowired private UserRepository userRepository;

    @GetMapping("/my-alerts")
    public ResponseEntity<List<Notification>> getMyNotifications(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(notificationService.getNotificationsForUser(user.getId()));
    }
}