package com.analytics.analyticsfinal.pages;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.text.InputType;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.*;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import com.analytics.analyticsfinal.R;
import com.analytics.analyticsfinal.pages.AuthActivity;
import com.analytics.analyticsfinal.utils.TokenManager;
import com.analytics.analyticsfinal.utils.UserManager;
import com.analytics.analyticstracker.AnalyticsTracker;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class UserProfileActivity extends AppCompatActivity {

    private TextView nameView, emailView, ageView, genderView;
    private Button editNameBtn;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_profile);



        // Views
        nameView = findViewById(R.id.profile_name);
        emailView = findViewById(R.id.profile_email);
        ageView = findViewById(R.id.profile_age);
        genderView = findViewById(R.id.profile_gender);
        editNameBtn = findViewById(R.id.btn_edit_name);

        updateUI();

        editNameBtn.setOnClickListener(v -> showEditNameDialog());
    }

    @SuppressLint("SetTextI18n")
    private void updateUI() {
        nameView.setText("שם: " + UserManager.getFirstName(this) + " " + UserManager.getLastName(this));
        emailView.setText("מייל: " + UserManager.getEmail(this));
        ageView.setText("גיל: " + UserManager.getAge(this));
        genderView.setText("מין: " + UserManager.getGender(this));
    }

    private void showEditNameDialog() {
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);

        EditText inputFirst = new EditText(this);
        inputFirst.setHint("שם פרטי");
        inputFirst.setInputType(InputType.TYPE_CLASS_TEXT);
        inputFirst.setText(UserManager.getFirstName(this));
        layout.addView(inputFirst);

        EditText inputLast = new EditText(this);
        inputLast.setHint("שם משפחה");
        inputLast.setInputType(InputType.TYPE_CLASS_TEXT);
        inputLast.setText(UserManager.getLastName(this));
        layout.addView(inputLast);

        new AlertDialog.Builder(this)
                .setTitle("ערוך שם")
                .setView(layout)
                .setPositiveButton("שמור", (dialog, which) -> {
                    String first = inputFirst.getText().toString().trim();
                    String last = inputLast.getText().toString().trim();

                    if (!first.isEmpty() && !last.isEmpty()) {
                        String userId = UserManager.getUserId(this);

                        // בדיקה - לוודא שהuserId תקין
                        Log.d("UPDATE_NAME", "🔄 userId=" + userId + ", first=" + first + ", last=" + last);

                        if (userId == null || userId.isEmpty()) {
                            Toast.makeText(this, "שגיאה: מזהה משתמש לא קיים", Toast.LENGTH_SHORT).show();
                            return;
                        }

                        AnalyticsTracker.updateUserName(userId, first, last, new Callback<Void>() {
                            @Override
                            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                                if (response.isSuccessful()) {
                                    UserManager.setFirstName(UserProfileActivity.this, first);
                                    UserManager.setLastName(UserProfileActivity.this, last);
                                    updateUI();
                                    Toast.makeText(UserProfileActivity.this, "השם עודכן בהצלחה", Toast.LENGTH_SHORT).show();
                                } else {
                                    Toast.makeText(UserProfileActivity.this, "שגיאה מהשרת: " + response.code(), Toast.LENGTH_SHORT).show();
                                    Log.e("UPDATE_NAME", "❌ Server error: " + response.code());
                                }
                            }

                            @Override
                            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                                Toast.makeText(UserProfileActivity.this, "שגיאת רשת: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                                Log.e("UPDATE_NAME", "❌ Network error: " + t.getMessage());
                            }
                        });
                    } else {
                        Toast.makeText(this, "נא למלא את שני השדות", Toast.LENGTH_SHORT).show();
                    }
                })
                .setNegativeButton("ביטול", null)
                .show();
    }


}

