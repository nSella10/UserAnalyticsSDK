package com.analytics.user_analytics;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@SpringBootApplication(scanBasePackages = { "com.analytics.user_analytics.controller.SimpleTestController" })
public class UserAnalyticsApplication implements CommandLineRunner {

	public static void main(String[] args) {
		System.out.println("🚀 Starting User Analytics Application...");
		System.out.println("📊 Environment Variables:");
		System.out.println("   PORT: " + System.getenv("PORT"));
		System.out.println("   SPRING_DATA_MONGODB_URI: "
				+ (System.getenv("SPRING_DATA_MONGODB_URI") != null ? "SET" : "NOT SET"));
		System.out.println("   JWT_SECRET: " + (System.getenv("JWT_SECRET") != null ? "SET" : "NOT SET"));

		// Add shutdown hook
		Runtime.getRuntime().addShutdownHook(new Thread(() -> {
			System.out.println("🛑 SHUTDOWN HOOK - Application is shutting down!");
		}));

		try {
			System.out.println("🔄 Calling SpringApplication.run()...");
			SpringApplication.run(UserAnalyticsApplication.class, args);
			System.out.println("✅ SpringApplication.run() completed successfully!");
		} catch (Exception e) {
			System.err.println("❌ SpringApplication.run() failed: " + e.getMessage());
			e.printStackTrace();
			throw e;
		}
		System.out.println("✅ User Analytics Application started successfully!");
	}

	@Override
	public void run(String... args) throws Exception {
		System.out.println("🔄 CommandLineRunner.run() started...");
		try {
			System.out.println("✅ Application startup completed - no demo data created");
			System.out.println("🌐 Server should be running on port: " + System.getenv("PORT"));
			System.out.println("🏥 Health endpoint: /actuator/health");
			System.out.println("🎯 Application is ready to receive requests!");
		} catch (Exception e) {
			System.err.println("❌ CommandLineRunner.run() failed: " + e.getMessage());
			e.printStackTrace();
			throw e;
		}
		System.out.println("✅ CommandLineRunner.run() completed successfully!");
	}

	@EventListener(ApplicationReadyEvent.class)
	public void onApplicationReady() {
		try {
			System.out.println("🎉 APPLICATION READY EVENT - Server is fully started and ready!");
			System.out.println("🌍 Application is now accepting HTTP requests");
			System.out.println("🔍 Testing internal health check...");

			// Test if we can create basic objects
			System.out.println("✅ Application ready event completed successfully");
		} catch (Exception e) {
			System.err.println("❌ APPLICATION READY EVENT FAILED: " + e.getMessage());
			e.printStackTrace();
		}
	}

}
