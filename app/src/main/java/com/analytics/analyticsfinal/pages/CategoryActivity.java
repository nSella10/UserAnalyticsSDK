package com.analytics.analyticsfinal.pages;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.analytics.analyticsfinal.R;
import com.analytics.analyticsfinal.adapter.GenericItemAdapter;
import com.analytics.analyticsfinal.model.DisplayItem;
import com.analytics.analyticsfinal.utils.UserManager;
import com.analytics.analyticstracker.AnalyticsTracker;

import java.util.*;

public class CategoryActivity extends AppCompatActivity {

    private RecyclerView subcategoryRecycler;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_category);

        String category = getIntent().getStringExtra("category");

        TextView categoryTitle = findViewById(R.id.categoryTitle);
        categoryTitle.setText("קטגוריה: " + category);

        subcategoryRecycler = findViewById(R.id.subcategoryRecycler);
        subcategoryRecycler.setLayoutManager(new GridLayoutManager(this, 2));

        List<DisplayItem> subcategories = loadSubcategories(category);

        GenericItemAdapter adapter = new GenericItemAdapter(this, subcategories, item -> {
            String userId = UserManager.getUserId(this);

            Map<String, Object> props = new HashMap<>();
            props.put("category", category);
            props.put("subcategory", item.getName());

            AnalyticsTracker.trackEvent(userId, "click_subcategory", props);

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
                list.add(new DisplayItem("אנימציה", R.drawable.icons_sub_animation));
                list.add(new DisplayItem("אימה", R.drawable.icons_sub_horror));
                break;

            case "משחקים":
                list.add(new DisplayItem("מחשב", R.drawable.icons_sub_pc));
                list.add(new DisplayItem("קונסולה", R.drawable.icons_sub_console));
                list.add(new DisplayItem("מובייל", R.drawable.icons_sub_mobile));
                list.add(new DisplayItem("לוח", R.drawable.icons_sub_board));
                list.add(new DisplayItem("יריות", R.drawable.icons_sub_shooting));
                break;

            case "ספרים":
                list.add(new DisplayItem("פנטזיה", R.drawable.icons_sub_fantasy));
                list.add(new DisplayItem("מותחנים", R.drawable.icons_sub_thriller));
                list.add(new DisplayItem("ילדים", R.drawable.icons_sub_family));
                list.add(new DisplayItem("רומנים", R.drawable.icons_sub_romance));
                break;

            case "אוכל":
                list.add(new DisplayItem("איטלקי", R.drawable.icons_sub_italian));
                list.add(new DisplayItem("אסייתי", R.drawable.icons_sub_asian));
                list.add(new DisplayItem("קינוחים", R.drawable.icons_sub_desserts));
                list.add(new DisplayItem("טבעוני", R.drawable.icons_sub_vegan));
                list.add(new DisplayItem("אוכל רחוב", R.drawable.icons_sub_streetfood));
                break;

            case "טיולים":
                list.add(new DisplayItem("אירופה", R.drawable.icons_sub_europe));
                list.add(new DisplayItem("אסיה", R.drawable.icons_sub_asia));
                list.add(new DisplayItem("אמריקה", R.drawable.icons_sub_america));
                list.add(new DisplayItem("ישראל", R.drawable.icons_sub_israel));
                list.add(new DisplayItem("אוסטרליה", R.drawable.icons_sub_australia));
                break;

            case "טכנולוגיה":
                list.add(new DisplayItem("סמארטפונים", R.drawable.icons_sub_smartphone));
                list.add(new DisplayItem("AI", R.drawable.icons_sub_ai));
                list.add(new DisplayItem("גיימינג", R.drawable.icons_sub_tv));
                list.add(new DisplayItem("מדפסות תלת־ממד", R.drawable.icons_sub_3dprint));
                break;

            default:
                list.add(new DisplayItem("לא נמצאו נושאים", R.drawable.icons_sub_noimage));
                break;
        }

        return list;
    }
}
