package com.analytics.user_analytics;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.analytics")
public class UserAnalyticsApplication {

	public static void main(String[] args) {
		SpringApplication.run(UserAnalyticsApplication.class, args);
	}

}
