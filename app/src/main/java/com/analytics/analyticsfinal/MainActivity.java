package com.analytics.analyticsfinal;

import android.content.Intent;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.analytics.analyticsfinal.adapter.GenericItemAdapter;
import com.analytics.analyticsfinal.model.DisplayItem;
import com.analytics.analyticsfinal.pages.CategoryActivity;
import com.analytics.analyticsfinal.utils.UserManager;
import com.analytics.analyticstracker.AnalyticsTracker;

import java.util.*;

public class MainActivity extends AppCompatActivity {

    private RecyclerView categoryRecycler;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        AnalyticsTracker.init("http://192.168.7.7:8080");

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
