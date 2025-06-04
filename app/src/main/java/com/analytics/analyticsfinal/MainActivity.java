package com.analytics.analyticsfinal;


import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;




import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Toast;

import com.analytics.analyticsfinal.adapter.GenericItemAdapter;
import com.analytics.analyticsfinal.model.DisplayItem;
import com.analytics.analyticsfinal.pages.AuthActivity;
import com.analytics.analyticsfinal.pages.CategoryActivity;
import com.analytics.analyticsfinal.pages.UserProfileActivity;
import com.analytics.analyticsfinal.utils.UserManager;
import com.analytics.analyticstracker.AnalyticsTracker;



import java.util.*;

public class MainActivity extends AppCompatActivity {

    private RecyclerView categoryRecycler;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Set up the toolbar
        Toolbar toolbar = findViewById(R.id.mainToolbar);
        setSupportActionBar(toolbar);
        setTitle("My Interests");

        // Initialize the AnalyticsTracker with the server URL and API Key
        // TODO: Replace with your actual API Key from the dashboard
        String apiKey = "ak_827aeb412aed4b23b8260432"; // API Key של האפליקציה
        AnalyticsTracker.init("http://192.168.7.7:8080/", apiKey);




        categoryRecycler = findViewById(R.id.categoryRecycler);
        categoryRecycler.setLayoutManager(new GridLayoutManager(this, 2));


        List<DisplayItem> categoryList = generateCategories();

        GenericItemAdapter adapter = new GenericItemAdapter(this, categoryList, item -> {
            String userId = UserManager.getUserId(this);

            Map<String, Object> props = new HashMap<>();
            props.put("category", item.getName());

            AnalyticsTracker.trackEvent(userId, "click_category", props);

            Intent intent = new Intent(this, CategoryActivity.class);
            intent.putExtra("category", item.getName());
            startActivity(intent);
        });

        categoryRecycler.setAdapter(adapter);
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
        if (userId != null) {
            AnalyticsTracker.endScreen(userId);
            Log.d("AnalyticsTracker", "Sending screen_duration for screen: ");

        } else {
            Log.w("AnalyticsTracker", "User ID is null in onPause – not sending screen duration.");
        }
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

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main_menu, menu); // Inflate the menu; this adds items to the action bar if it is present.
        return true;


    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
            int id = item.getItemId();
            if (id == R.id.menu_profile) {
                startActivity(new Intent(this, UserProfileActivity.class));
                return true;
            } else if (id == R.id.menu_logout) {
                getSharedPreferences("auth", MODE_PRIVATE).edit().clear().apply();
                startActivity(new Intent(this, AuthActivity.class));
                finish();
                return true;
            }
            return super.onOptionsItemSelected(item);
        }
    }
