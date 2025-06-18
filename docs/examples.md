# Examples

Practical examples and use cases for the User Analytics SDK based on the MyInterest application.

## 📚 Table of Contents

- [Basic Setup](#basic-setup)
- [MyInterest App Examples](#myinterest-app-examples)
- [Category Browsing](#category-browsing)
- [User Profile Management](#user-profile-management)
- [Screen Time Tracking](#screen-time-tracking)
- [Advanced Patterns](#advanced-patterns)

## Basic Setup

### MyInterest MainActivity Setup

```java
public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Initialize SDK with your API key
        AnalyticsTracker.init("https://d1xb34m3k0zeus.cloudfront.net/", "ak_your_api_key");

        // Track app launch
        String userId = UserManager.getUserId(this);
        Map<String, Object> properties = new HashMap<>();
        properties.put("app_version", BuildConfig.VERSION_NAME);
        properties.put("user_type", "registered");
        AnalyticsTracker.trackEvent(userId, "app_launched", properties);

        // Setup categories
        setupCategoryGrid();
    }

    @Override
    protected void onResume() {
        super.onResume();
        AnalyticsTracker.startScreen("MainActivity");
    }

    @Override
    protected void onPause() {
        super.onPause();
        String userId = UserManager.getUserId(this);
        AnalyticsTracker.endScreen(userId);
    }
}
```

## MyInterest App Examples

### Category Selection Tracking

```java
public class MainActivity extends AppCompatActivity {

    private void setupCategoryGrid() {
        List<DisplayItem> categoryList = generateCategories();

        GenericItemAdapter adapter = new GenericItemAdapter(this, categoryList, item -> {
            String userId = UserManager.getUserId(this);

            // Track category click
            Map<String, Object> props = new HashMap<>();
            props.put("category", item.getName());
            props.put("source", "main_screen");
            props.put("position", categoryList.indexOf(item));

            AnalyticsTracker.trackEvent(userId, "click_category", props);

            // Navigate to category screen
            Intent intent = new Intent(this, CategoryActivity.class);
            intent.putExtra("category", item.getName());
            startActivity(intent);
        });

        categoryRecycler.setAdapter(adapter);
    }

    private List<DisplayItem> generateCategories() {
        List<DisplayItem> list = new ArrayList<>();

        list.add(new DisplayItem("ספורט", R.drawable.icon_sports));
        list.add(new DisplayItem("מוזיקה", R.drawable.icon_musics));
        list.add(new DisplayItem("סרטים", R.drawable.icon_movies));
        list.add(new DisplayItem("משחקים", R.drawable.icon_games));
        list.add(new DisplayItem("ספרים", R.drawable.icon_books));
        list.add(new DisplayItem("אוכל", R.drawable.icon_foods));
        list.add(new DisplayItem("טיולים", R.drawable.icon_travels));
        list.add(new DisplayItem("טכנולוגיה", R.drawable.icon_techs));

        return list;
    }
}
```

## Category Browsing

### CategoryActivity - Subcategory Selection

```java
public class CategoryActivity extends AppCompatActivity {
    private String category;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_category);

        category = getIntent().getStringExtra("category");

        // Track category view
        String userId = UserManager.getUserId(this);
        Map<String, Object> properties = new HashMap<>();
        properties.put("category", category);
        properties.put("source", "main_screen");
        AnalyticsTracker.trackEvent(userId, "category_viewed", properties);

        setupSubcategories();
    }

    private void setupSubcategories() {
        List<DisplayItem> subcategories = loadSubcategories(category);

        GenericItemAdapter adapter = new GenericItemAdapter(this, subcategories, item -> {
            String userId = UserManager.getUserId(this);

            // Track subcategory click
            Map<String, Object> props = new HashMap<>();
            props.put("category", category);
            props.put("subcategory", item.getName());
            props.put("position", subcategories.indexOf(item));

            AnalyticsTracker.trackEvent(userId, "click_subcategory", props);

            // End current screen tracking before navigation
            AnalyticsTracker.endScreen(userId);

            // Navigate to items
            Intent intent = new Intent(this, ItemDetailActivity.class);
            intent.putExtra("category", category);
            intent.putExtra("subcategory", item.getName());
            startActivity(intent);
        });

        subcategoryRecycler.setAdapter(adapter);
    }

    private List<DisplayItem> loadSubcategories(String category) {
        List<DisplayItem> list = new ArrayList<>();

        switch (category) {
            case "ספורט":
                list.add(new DisplayItem("כדורגל", R.drawable.icons_sub_soccer));
                list.add(new DisplayItem("כדורסל", R.drawable.icons_sub_basketball));
                list.add(new DisplayItem("טניס", R.drawable.icons_sub_tennis));
                list.add(new DisplayItem("שחייה", R.drawable.icons_sub_swimming));
                list.add(new DisplayItem("ריצה", R.drawable.icons_sub_running));
                break;
            case "מוזיקה":
                list.add(new DisplayItem("פופ", R.drawable.icons_sub_pop));
                list.add(new DisplayItem("רוק", R.drawable.icons_sub_rock));
                list.add(new DisplayItem("ג'אז", R.drawable.icons_sub_jazz));
                list.add(new DisplayItem("היפ הופ", R.drawable.icons_sub_hiphop));
                break;
            case "סרטים":
                list.add(new DisplayItem("אקשן", R.drawable.icons_sub_action));
                list.add(new DisplayItem("קומדיה", R.drawable.icons_sub_comedy));
                list.add(new DisplayItem("דרמה", R.drawable.icons_sub_drama));
                break;
            // Add more categories as needed
        }

        return list;
    }

    @Override
    protected void onResume() {
        super.onResume();
        // Track screen with specific category
        String screenName = "CategoryActivity_" + category;
        AnalyticsTracker.startScreen(screenName);
    }

    @Override
    protected void onPause() {
        super.onPause();
        String userId = UserManager.getUserId(this);
        if (userId != null) {
            AnalyticsTracker.endScreen(userId);
        }
    }
}
```

### ItemDetailActivity - Interest Items

```java
public class ItemDetailActivity extends AppCompatActivity {
    private String category;
    private String subcategory;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_item_detail);

        category = getIntent().getStringExtra("category");
        subcategory = getIntent().getStringExtra("subcategory");

        // Track subcategory items view
        String userId = UserManager.getUserId(this);
        Map<String, Object> properties = new HashMap<>();
        properties.put("category", category);
        properties.put("subcategory", subcategory);
        AnalyticsTracker.trackEvent(userId, "items_viewed", properties);

        setupItemsList();
    }

    private void setupItemsList() {
        List<ItemDetail> items = loadItems(category, subcategory);

        ItemDetailAdapter adapter = new ItemDetailAdapter(this, items, category, subcategory);
        itemRecycler.setAdapter(adapter);
    }

    private List<ItemDetail> loadItems(String category, String subcategory) {
        List<ItemDetail> list = new ArrayList<>();

        if (category.equals("ספורט")) {
            switch (subcategory) {
                case "כדורגל":
                    list.add(new ItemDetail("כריסטיאנו רונאלדו", "כוכב פורטוגלי, זוכה 5 פעמים בכדור הזהב."));
                    list.add(new ItemDetail("ליאונל מסי", "כוכב ארגנטינאי, זוכה 7 פעמים בכדור הזהב."));
                    list.add(new ItemDetail("קיליאן אמבפה", "כוכב צעיר מצרפת, זכה במונדיאל 2018."));
                    break;
                case "כדורסל":
                    list.add(new ItemDetail("לברון ג'יימס", "אגדת NBA, אלוף 4 פעמים."));
                    list.add(new ItemDetail("מייקל ג'ורדן", "נחשב לשחקן הטוב ביותר בכל הזמנים."));
                    break;
            }
        } else if (category.equals("מוזיקה")) {
            switch (subcategory) {
                case "פופ":
                    list.add(new ItemDetail("טיילור סוויפט", "זמרת פופ אמריקאית מצליחה."));
                    list.add(new ItemDetail("אד שירן", "זמר-יוצר בריטי פופולרי."));
                    break;
                case "רוק":
                    list.add(new ItemDetail("קווין", "להקת רוק בריטית אגדית."));
                    list.add(new ItemDetail("לד זפלין", "להקת רוק קלאסית."));
                    break;
            }
        }

        return list;
    }

    @Override
    protected void onResume() {
        super.onResume();
        String screenName = "ItemDetailActivity_" + category + "_" + subcategory;
        AnalyticsTracker.startScreen(screenName);
    }

    @Override
    protected void onPause() {
        super.onPause();
        String userId = UserManager.getUserId(this);
        if (userId != null) {
            AnalyticsTracker.endScreen(userId);
        }
    }
}
```

### ItemDetailAdapter - Individual Item Clicks

```java
public class ItemDetailAdapter extends RecyclerView.Adapter<ItemDetailAdapter.ItemViewHolder> {
    private final Context context;
    private final List<ItemDetail> items;
    private final String categoryName;
    private final String subcategoryName;

    public ItemDetailAdapter(Context context, List<ItemDetail> items,
                           String categoryName, String subcategoryName) {
        this.context = context;
        this.items = items;
        this.categoryName = categoryName;
        this.subcategoryName = subcategoryName;
    }

    @Override
    public void onBindViewHolder(@NonNull ItemViewHolder holder, int position) {
        ItemDetail item = items.get(position);
        holder.title.setText(item.getTitle());

        holder.itemView.setOnClickListener(v -> {
            String userId = UserManager.getUserId(context);

            // Track specific item click
            Map<String, Object> props = new HashMap<>();
            props.put("category", categoryName);
            props.put("subcategory", subcategoryName);
            props.put("item", item.getTitle());
            props.put("position", position);
            props.put("total_items", items.size());

            AnalyticsTracker.trackEvent(userId, "click_item", props);

            // Show item details dialog
            new AlertDialog.Builder(context)
                    .setTitle(item.getTitle())
                    .setMessage(item.getDescription())
                    .setPositiveButton("סגור", (dialog, which) -> {
                        // Track dialog close
                        Map<String, Object> closeProps = new HashMap<>();
                        closeProps.put("item", item.getTitle());
                        closeProps.put("action", "close_dialog");
                        AnalyticsTracker.trackEvent(userId, "item_dialog_closed", closeProps);
                    })
                    .show();
        });
    }
}
```

## User Profile Management

### UserProfileActivity - Profile Interactions

```java
public class UserProfileActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_profile);

        // Track profile view
        String userId = UserManager.getUserId(this);
        Map<String, Object> properties = new HashMap<>();
        properties.put("user_age", UserManager.getAge(this));
        properties.put("user_gender", UserManager.getGender(this));
        AnalyticsTracker.trackEvent(userId, "profile_viewed", properties);

        setupProfileViews();
    }

    private void setupProfileViews() {
        editNameBtn.setOnClickListener(v -> {
            String userId = UserManager.getUserId(this);

            // Track edit name button click
            Map<String, Object> props = new HashMap<>();
            props.put("action", "edit_name_clicked");
            AnalyticsTracker.trackEvent(userId, "profile_action", props);

            showEditNameDialog();
        });
    }

    private void showEditNameDialog() {
        // Dialog setup...

        new AlertDialog.Builder(this)
                .setTitle("ערוך שם")
                .setView(layout)
                .setPositiveButton("שמור", (dialog, which) -> {
                    String first = inputFirst.getText().toString().trim();
                    String last = inputLast.getText().toString().trim();

                    if (!first.isEmpty() && !last.isEmpty()) {
                        updateUserName(first, last);
                    }
                })
                .setNegativeButton("ביטול", (dialog, which) -> {
                    // Track dialog cancellation
                    String userId = UserManager.getUserId(this);
                    Map<String, Object> props = new HashMap<>();
                    props.put("action", "edit_name_cancelled");
                    AnalyticsTracker.trackEvent(userId, "profile_action", props);
                })
                .show();
    }

    private void updateUserName(String firstName, String lastName) {
        String userId = UserManager.getUserId(this);

        AnalyticsTracker.updateUserName(userId, firstName, lastName, new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    // Track successful name update
                    Map<String, Object> props = new HashMap<>();
                    props.put("action", "name_updated_success");
                    props.put("first_name_length", firstName.length());
                    props.put("last_name_length", lastName.length());
                    AnalyticsTracker.trackEvent(userId, "profile_updated", props);

                    updateUI();
                } else {
                    // Track failed name update
                    Map<String, Object> props = new HashMap<>();
                    props.put("action", "name_update_failed");
                    props.put("error_code", response.code());
                    AnalyticsTracker.trackEvent(userId, "profile_error", props);
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                // Track network error
                String userId = UserManager.getUserId(UserProfileActivity.this);
                Map<String, Object> props = new HashMap<>();
                props.put("action", "name_update_network_error");
                props.put("error_message", t.getMessage());
                AnalyticsTracker.trackEvent(userId, "profile_error", props);
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        AnalyticsTracker.startScreen("UserProfileActivity");
    }

    @Override
    protected void onPause() {
        super.onPause();
        String userId = UserManager.getUserId(this);
        AnalyticsTracker.endScreen(userId);
    }
}
```

## Screen Time Tracking

### Automatic Screen Time Measurement

```java
public class CategoryActivity extends AppCompatActivity {
    private String category;
    private long screenEnterTime;

    @Override
    protected void onResume() {
        super.onResume();
        screenEnterTime = System.currentTimeMillis();

        // Start automatic screen time tracking with specific category
        String screenName = "CategoryActivity_" + category;
        AnalyticsTracker.startScreen(screenName);

        // Track screen entry
        String userId = UserManager.getUserId(this);
        Map<String, Object> props = new HashMap<>();
        props.put("category", category);
        props.put("screen_type", "category_browse");
        props.put("entry_time", System.currentTimeMillis());
        AnalyticsTracker.trackEvent(userId, "screen_entered", props);
    }

    @Override
    protected void onPause() {
        super.onPause();
        String userId = UserManager.getUserId(this);

        if (userId != null) {
            // Calculate manual screen time
            long screenDuration = System.currentTimeMillis() - screenEnterTime;

            // Track screen exit with duration
            Map<String, Object> props = new HashMap<>();
            props.put("category", category);
            props.put("screen_type", "category_browse");
            props.put("manual_duration_ms", screenDuration);
            props.put("exit_time", System.currentTimeMillis());
            AnalyticsTracker.trackEvent(userId, "screen_exited", props);

            // End automatic screen time tracking
            AnalyticsTracker.endScreen(userId);
        }
    }
}
```

### Manual Screen Time Tracking

```java
public class ItemDetailActivity extends AppCompatActivity {
    private long itemViewStartTime;
    private String currentItem;

    private void trackItemViewTime(String itemName) {
        itemViewStartTime = System.currentTimeMillis();
        currentItem = itemName;

        String userId = UserManager.getUserId(this);
        Map<String, Object> props = new HashMap<>();
        props.put("item", itemName);
        props.put("category", category);
        props.put("subcategory", subcategory);
        props.put("view_start_time", itemViewStartTime);

        AnalyticsTracker.trackEvent(userId, "item_view_started", props);
    }

    private void endItemViewTracking() {
        if (currentItem != null && itemViewStartTime > 0) {
            long viewDuration = System.currentTimeMillis() - itemViewStartTime;
            String userId = UserManager.getUserId(this);

            // Manual screen time tracking for specific item
            AnalyticsTracker.trackScreenTime(
                userId,
                "ItemView_" + currentItem,
                itemViewStartTime,
                System.currentTimeMillis(),
                viewDuration
            );

            // Track item engagement based on view time
            Map<String, Object> props = new HashMap<>();
            props.put("item", currentItem);
            props.put("view_duration_ms", viewDuration);
            props.put("engagement_level", getEngagementLevel(viewDuration));

            AnalyticsTracker.trackEvent(userId, "item_view_ended", props);

            currentItem = null;
            itemViewStartTime = 0;
        }
    }

    private String getEngagementLevel(long durationMs) {
        if (durationMs < 3000) return "low";        // Less than 3 seconds
        if (durationMs < 10000) return "medium";    // 3-10 seconds
        if (durationMs < 30000) return "high";      // 10-30 seconds
        return "very_high";                         // More than 30 seconds
    }
}
```

## Advanced Patterns

### MyInterest User Journey Tracking

```java
public class InterestJourneyTracker {
    private String userId;
    private List<String> interestPath;
    private long journeyStartTime;

    public InterestJourneyTracker(String userId) {
        this.userId = userId;
        this.interestPath = new ArrayList<>();
        this.journeyStartTime = System.currentTimeMillis();
    }

    public void trackInterestStep(String category, String subcategory, String item) {
        String step = category + " > " + subcategory + " > " + item;
        interestPath.add(step);

        Map<String, Object> properties = new HashMap<>();
        properties.put("category", category);
        properties.put("subcategory", subcategory);
        properties.put("item", item);
        properties.put("step_number", interestPath.size());
        properties.put("journey_path", String.join(" | ", interestPath));
        properties.put("time_since_start", System.currentTimeMillis() - journeyStartTime);

        AnalyticsTracker.trackEvent(userId, "interest_journey_step", properties);
    }

    public void completeInterestExploration() {
        long totalJourneyTime = System.currentTimeMillis() - journeyStartTime;

        Map<String, Object> properties = new HashMap<>();
        properties.put("total_interests_explored", interestPath.size());
        properties.put("journey_duration_ms", totalJourneyTime);
        properties.put("full_journey_path", String.join(" | ", interestPath));
        properties.put("exploration_depth", calculateExplorationDepth());

        AnalyticsTracker.trackEvent(userId, "interest_exploration_completed", properties);

        // Reset for new journey
        interestPath.clear();
        journeyStartTime = System.currentTimeMillis();
    }

    private String calculateExplorationDepth() {
        Set<String> uniqueCategories = new HashSet<>();
        Set<String> uniqueSubcategories = new HashSet<>();

        for (String step : interestPath) {
            String[] parts = step.split(" > ");
            if (parts.length >= 2) {
                uniqueCategories.add(parts[0]);
                uniqueSubcategories.add(parts[1]);
            }
        }

        if (uniqueCategories.size() >= 4) return "very_deep";
        if (uniqueCategories.size() >= 2) return "deep";
        if (uniqueSubcategories.size() >= 3) return "medium";
        return "shallow";
    }
}
```

### Interest Preference Analysis

```java
public class InterestAnalyzer {

    public static void trackUserPreferences(String userId, Context context) {
        // Analyze user's interest patterns
        Map<String, Integer> categoryClicks = getCategoryClickCounts(context);
        Map<String, Long> categoryTimeSpent = getCategoryTimeSpent(context);

        Map<String, Object> properties = new HashMap<>();
        properties.put("most_clicked_category", getMostClickedCategory(categoryClicks));
        properties.put("most_time_spent_category", getMostTimeSpentCategory(categoryTimeSpent));
        properties.put("total_categories_explored", categoryClicks.size());
        properties.put("average_time_per_category", calculateAverageTime(categoryTimeSpent));
        properties.put("user_interest_diversity", calculateDiversityScore(categoryClicks));

        AnalyticsTracker.trackEvent(userId, "interest_preferences_analyzed", properties);
    }

    public static void trackInterestRecommendation(String userId, String recommendedCategory, String reason) {
        Map<String, Object> properties = new HashMap<>();
        properties.put("recommended_category", recommendedCategory);
        properties.put("recommendation_reason", reason);
        properties.put("user_current_interests", getCurrentUserInterests(userId));

        AnalyticsTracker.trackEvent(userId, "interest_recommended", properties);
    }

    private static String getMostClickedCategory(Map<String, Integer> categoryClicks) {
        return categoryClicks.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("none");
    }

    private static double calculateDiversityScore(Map<String, Integer> categoryClicks) {
        if (categoryClicks.isEmpty()) return 0.0;

        int totalClicks = categoryClicks.values().stream().mapToInt(Integer::intValue).sum();
        double entropy = 0.0;

        for (int clicks : categoryClicks.values()) {
            if (clicks > 0) {
                double probability = (double) clicks / totalClicks;
                entropy -= probability * Math.log(probability) / Math.log(2);
            }
        }

        return entropy;
    }
}
```

### Error Tracking for MyInterest

```java
public class MyInterestErrorTracker {

    public static void trackCategoryLoadError(String userId, String category, Exception error) {
        Map<String, Object> properties = new HashMap<>();
        properties.put("error_type", "category_load_failed");
        properties.put("category", category);
        properties.put("error_message", error.getMessage());
        properties.put("error_class", error.getClass().getSimpleName());
        properties.put("app_version", BuildConfig.VERSION_NAME);
        properties.put("device_model", Build.MODEL);

        AnalyticsTracker.trackEvent(userId, "myinterest_error", properties);
    }

    public static void trackProfileUpdateError(String userId, String operation, int errorCode) {
        Map<String, Object> properties = new HashMap<>();
        properties.put("error_type", "profile_update_failed");
        properties.put("operation", operation);
        properties.put("error_code", errorCode);
        properties.put("user_age", UserManager.getAge(null));
        properties.put("user_gender", UserManager.getGender(null));

        AnalyticsTracker.trackEvent(userId, "myinterest_error", properties);
    }

    public static void trackNavigationError(String userId, String fromScreen, String toScreen, String errorReason) {
        Map<String, Object> properties = new HashMap<>();
        properties.put("error_type", "navigation_failed");
        properties.put("from_screen", fromScreen);
        properties.put("to_screen", toScreen);
        properties.put("error_reason", errorReason);
        properties.put("timestamp", System.currentTimeMillis());

        AnalyticsTracker.trackEvent(userId, "myinterest_error", properties);
    }
}
```

## 🎯 Best Practices for MyInterest

### 1. Consistent User ID Management
```java
// Use UserManager for consistent user identification
public class UserManager {
    public static String getUserId(Context context) {
        SharedPreferences prefs = context.getSharedPreferences("auth", Context.MODE_PRIVATE);
        return prefs.getString("user_id", null);
    }

    public static String getFirstName(Context context) {
        SharedPreferences prefs = context.getSharedPreferences("auth", Context.MODE_PRIVATE);
        return prefs.getString("first_name", "");
    }

    // Always use the same user ID across all activities
    String userId = UserManager.getUserId(this);
    AnalyticsTracker.trackEvent(userId, "action", properties);
}
```

### 2. MyInterest Event Naming Convention
```java
// Use consistent naming for MyInterest events
"click_category"        // User clicks on main category
"click_subcategory"     // User clicks on subcategory
"click_item"           // User clicks on specific item
"profile_viewed"       // User views profile
"profile_updated"      // User updates profile
"interest_exploration_completed"  // User completes browsing session
```

### 3. MyInterest Property Structure
```java
// Keep properties consistent and meaningful for interest tracking
Map<String, Object> properties = new HashMap<>();
properties.put("category", "ספורט");           // Main interest category
properties.put("subcategory", "כדורגל");       // Specific interest area
properties.put("item", "כריסטיאנו רונאלדו");    // Specific item/person
properties.put("position", 0);                // Position in list
properties.put("total_items", 5);             // Total items available
properties.put("user_age", UserManager.getAge(context));  // User demographics
```

### 4. Screen Time Best Practices
```java
// Always pair startScreen() and endScreen()
@Override
protected void onResume() {
    super.onResume();
    // Use descriptive screen names with context
    String screenName = "CategoryActivity_" + category;
    AnalyticsTracker.startScreen(screenName);
}

@Override
protected void onPause() {
    super.onPause();
    String userId = UserManager.getUserId(this);
    if (userId != null) {
        AnalyticsTracker.endScreen(userId);
    }
}
```

### 5. Interest Journey Tracking
```java
// Track complete user interest exploration journey
InterestJourneyTracker journeyTracker = new InterestJourneyTracker(userId);

// In CategoryActivity
journeyTracker.trackInterestStep(category, null, null);

// In ItemDetailActivity
journeyTracker.trackInterestStep(category, subcategory, itemName);

// When user exits or completes exploration
journeyTracker.completeInterestExploration();
```

---

**For more advanced usage, see [API Reference](api-reference.md)**
