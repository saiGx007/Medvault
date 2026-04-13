package com.saigana.medvault.service;

import com.saigana.medvault.entity.*;
import com.saigana.medvault.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Transactional
    public void createNotification(User user, String title, String message, String type) {
        Notification n = new Notification();
        n.setUser(user);
        n.setTitle(title);
        n.setMessage(message);
        n.setType(type);
        // Explicitly set timestamp just in case
        n.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(n);
    }

    public List<Notification> getNotificationsForUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // Runs every day at midnight to delete notifications older than 7 days
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void cleanOldNotifications() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        notificationRepository.deleteByCreatedAtBefore(sevenDaysAgo);
    }
}