package com.analytics.user_analytics;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.core.MongoTemplate;

@SpringBootApplication(scanBasePackages = "com.analytics")
public class UserAnalyticsApplication implements CommandLineRunner {

	@Autowired
	private MongoTemplate mongoTemplate;

	public static void main(String[] args) {
		SpringApplication.run(UserAnalyticsApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		// מחיקת אינדקסים ישנים מהאוסף developers
		try {
			if (mongoTemplate.collectionExists("developers")) {
				mongoTemplate.getCollection("developers").dropIndexes();
				System.out.println("✅ Dropped old indexes from developers collection");
			}
		} catch (Exception e) {
			System.out.println("⚠️ Could not drop indexes: " + e.getMessage());
		}
	}
}
