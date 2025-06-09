package com.analytics.user_analytics;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.analytics")
public class UserAnalyticsApplication implements CommandLineRunner {

	public static void main(String[] args) {
		System.out.println("🚀 Starting User Analytics Application...");
		System.out.println("📊 Environment Variables:");
		System.out.println("   PORT: " + System.getenv("PORT"));
		System.out.println("   SPRING_DATA_MONGODB_URI: "
				+ (System.getenv("SPRING_DATA_MONGODB_URI") != null ? "SET" : "NOT SET"));
		System.out.println("   JWT_SECRET: " + (System.getenv("JWT_SECRET") != null ? "SET" : "NOT SET"));

		SpringApplication.run(UserAnalyticsApplication.class, args);
		System.out.println("✅ User Analytics Application started successfully!");
	}

	@Override
	public void run(String... args) throws Exception {
		System.out.println("✅ Application startup completed - no demo data created");
	}

}
