package com.saigana.medvault;

import com.saigana.medvault.entity.Role;
import com.saigana.medvault.entity.User;
import com.saigana.medvault.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MedvaultApplication {

	@Autowired

	public static void main(String[] args) {
		SpringApplication.run(MedvaultApplication.class, args);
	}

}
