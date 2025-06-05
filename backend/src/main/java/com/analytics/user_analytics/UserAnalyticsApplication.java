package com.analytics.user_analytics;

import com.analytics.user_analytics.model.App;
import com.analytics.user_analytics.model.Developer;
import com.analytics.user_analytics.model.User;
import com.analytics.user_analytics.repository.AppRepository;
import com.analytics.user_analytics.repository.DeveloperRepository;
import com.analytics.user_analytics.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.time.LocalDateTime;
import java.util.List;

@SpringBootApplication(scanBasePackages = "com.analytics")
public class UserAnalyticsApplication implements CommandLineRunner {

	// קבועים לנתוני דמו
	private static final String DEMO_API_KEY = "ak_demo_app_12345678901234567890";
	private static final String DEMO_DEVELOPER_EMAIL = "demo@example.com";
	private static final String DEMO_DEVELOPER_PASSWORD = "demo123";
	private static final String DEMO_APP_NAME = "Demo Analytics App";

	@Autowired
	private MongoTemplate mongoTemplate;

	@Autowired
	private DeveloperRepository developerRepository;

	@Autowired
	private AppRepository appRepository;

	@Autowired
	private UserRepository userRepository;

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

		// יצירת נתוני דמו
		createDemoData();
	}

	private void createDemoData() {
		try {
			// יצירת מפתח דמו
			Developer demoDeveloper = developerRepository.findByEmail(DEMO_DEVELOPER_EMAIL);
			if (demoDeveloper == null) {
				demoDeveloper = new Developer();
				demoDeveloper.setEmail(DEMO_DEVELOPER_EMAIL);
				demoDeveloper.setFirstName("Demo");
				demoDeveloper.setLastName("Developer");
				demoDeveloper.setCompanyName("Demo Company");
				demoDeveloper.setPassword(DEMO_DEVELOPER_PASSWORD); // בפרודקשן צריך להיות מוצפן
				demoDeveloper.setCreatedAt(LocalDateTime.now());
				demoDeveloper = developerRepository.save(demoDeveloper);
				System.out.println("✅ Created demo developer: " + demoDeveloper.getEmail());
			}

			// יצירת אפליקציית דמו
			App demoApp = appRepository.findByApiKey(DEMO_API_KEY);
			if (demoApp == null) {
				demoApp = new App();
				demoApp.setAppName(DEMO_APP_NAME);
				demoApp.setApiKey(DEMO_API_KEY);
				demoApp.setDeveloperId(demoDeveloper.getId());
				demoApp.setDescription("Demo application for testing analytics");
				demoApp.setCreatedAt(LocalDateTime.now());
				demoApp.setActive(true);
				demoApp = appRepository.save(demoApp);
				System.out.println(
						"✅ Created demo app: " + demoApp.getAppName() + " with API Key: " + demoApp.getApiKey());
			} else {
				System.out.println("ℹ️ Demo app already exists: " + demoApp.getAppName() + " with API Key: "
						+ demoApp.getApiKey());
			}

			// יצירת משתמשי דמו
			createDemoUsers(demoApp.getApiKey());

			// יצירת נתוני דמו נוספים עם API Key חדש (אם קיים)
			createAdditionalDemoData();

		} catch (Exception e) {
			System.err.println("❌ Error creating demo data: " + e.getMessage());
			e.printStackTrace();
		}
	}

	private void createDemoUsers(String apiKey) {
		// בדיקה אם כבר יש משתמשים עם ה-API Key הזה
		long existingUsers = userRepository.findAll().stream()
				.filter(user -> apiKey.equals(user.getApiKey()))
				.count();

		if (existingUsers == 0) {
			// יצירת משתמשי דמו
			User user1 = new User();
			user1.setId("demo_user_1");
			user1.setFirstName("אליס");
			user1.setLastName("כהן");
			user1.setEmail("alice@demo.com");
			user1.setAge(25);
			user1.setGender(User.Gender.FEMALE);
			user1.setApiKey(apiKey);
			user1.setRegisterAt(LocalDateTime.now());
			userRepository.save(user1);

			User user2 = new User();
			user2.setId("demo_user_2");
			user2.setFirstName("בוב");
			user2.setLastName("לוי");
			user2.setEmail("bob@demo.com");
			user2.setAge(30);
			user2.setGender(User.Gender.MALE);
			user2.setApiKey(apiKey);
			user2.setRegisterAt(LocalDateTime.now());
			userRepository.save(user2);

			User user3 = new User();
			user3.setId("demo_user_3");
			user3.setFirstName("צ'רלי");
			user3.setLastName("דוד");
			user3.setEmail("charlie@demo.com");
			user3.setAge(28);
			user3.setGender(User.Gender.OTHER);
			user3.setApiKey(apiKey);
			user3.setRegisterAt(LocalDateTime.now());
			userRepository.save(user3);

			System.out.println("✅ Created 3 demo users with API Key: " + apiKey);
		} else {
			System.out.println("ℹ️ Demo users already exist for API Key: " + apiKey);
		}
	}

	private void createAdditionalDemoData() {
		// חיפוש אפליקציות עם API Key שונה מהדמו
		List<App> allApps = appRepository.findAll();
		for (App app : allApps) {
			if (!app.getApiKey().equals(DEMO_API_KEY)) {
				System.out.println("🔍 Found app with different API Key: " + app.getApiKey());

				// בדיקה אם כבר יש נתונים לאפליקציה הזו
				long existingUsers = userRepository.findAll().stream()
						.filter(user -> app.getApiKey().equals(user.getApiKey()))
						.count();

				if (existingUsers == 0) {
					System.out.println("📊 Creating demo data for API Key: " + app.getApiKey());
					createDemoUsers(app.getApiKey());
				} else {
					System.out.println("ℹ️ Demo data already exists for API Key: " + app.getApiKey());
				}
			}
		}
	}
}
