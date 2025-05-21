package com.analytics.analyticsfinal.pages;

import android.content.Intent;
import android.os.Bundle;
import android.widget.*;
import androidx.appcompat.app.AppCompatActivity;

import com.analytics.analyticsfinal.MainActivity;
import com.analytics.analyticsfinal.R;
import com.analytics.analyticsfinal.utils.UserManager;
import com.analytics.analyticstracker.model.AuthResponse;
import com.analytics.analyticstracker.model.LoginRequest;
import com.analytics.analyticsfinal.utils.TokenManager;
import com.analytics.analyticstracker.AnalyticsTracker;
import com.analytics.analyticstracker.model.User;


import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AuthActivity extends AppCompatActivity {

    private ViewFlipper formSwitcher;
    private Button loginTab, signupTab;

    // Login views
    private EditText loginEmail, loginPassword;
    private Button loginButton;

    // Signup views
    private EditText signupFirstName, signupLastName, signupEmail, signupPassword, signupAge;
    private Spinner signupGender;
    private Button signupButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_auth);

        initViews();
        setupTabs();
        setupGenderSpinner();
        setupLoginLogic();
        setupSignupLogic();
    }

    private void initViews() {
        formSwitcher = findViewById(R.id.formSwitcher);
        loginTab = findViewById(R.id.loginTab);
        signupTab = findViewById(R.id.signupTab);

        loginEmail = findViewById(R.id.loginEmail);
        loginPassword = findViewById(R.id.loginPassword);
        loginButton = findViewById(R.id.loginButton);

        signupFirstName = findViewById(R.id.signupFirstName);
        signupLastName = findViewById(R.id.signupLastName);
        signupEmail = findViewById(R.id.signupEmail);
        signupPassword = findViewById(R.id.signupPassword);
        signupAge = findViewById(R.id.signupAge);
        signupGender = findViewById(R.id.signupGender);
        signupButton = findViewById(R.id.signupButton);
    }

    private void setupTabs() {
        loginTab.setOnClickListener(v -> switchToForm(0));
        signupTab.setOnClickListener(v -> switchToForm(1));
    }

    private void switchToForm(int index) {
        formSwitcher.setDisplayedChild(index);
        if (index == 0) {
            loginTab.setBackgroundResource(R.drawable.tab_selected);
            signupTab.setBackgroundColor(getResources().getColor(android.R.color.transparent));
        } else {
            signupTab.setBackgroundResource(R.drawable.tab_selected);
            loginTab.setBackgroundColor(getResources().getColor(android.R.color.transparent));
        }
    }

    private void setupGenderSpinner() {
        ArrayAdapter<String> genderAdapter = new ArrayAdapter<>(this,
                android.R.layout.simple_spinner_item,
                new String[]{"MALE", "FEMALE", "OTHER"});
        genderAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        signupGender.setAdapter(genderAdapter);
    }

    private void setupLoginLogic() {
        loginButton.setOnClickListener(v -> {
            String email = loginEmail.getText().toString().trim();
            String password = loginPassword.getText().toString();

            if (email.isEmpty() || password.isEmpty()) {
                showToast("Please fill in all fields.");
                return;
            }

            LoginRequest request = new LoginRequest(email, password);

            AnalyticsTracker.loginUser(request, new Callback<AuthResponse>() {
                @Override
                public void onResponse(Call<AuthResponse> call, Response<AuthResponse> response) {
                    if (response.isSuccessful() && response.body() != null) {
                        // ✅ התחברות מוצלחת
                        String token = response.body().getToken();
                        TokenManager.saveToken(AuthActivity.this, token);

                        String userId = response.body().getUser().getId();
                        UserManager.saveUserId(AuthActivity.this, userId);

                        showToast("Welcome " + response.body().getUser().getFirstName());
                        goToMainActivity();

                    } else {
                        // ❌ טיפול בשגיאות לפי קוד תגובה
                        switch (response.code()) {
                            case 404:
                                showToast("User not found. Please check your email.");
                                break;
                            case 401:
                                showToast("Incorrect password. Please try again.");
                                break;
                            default:
                                showToast("Login failed: " + response.code());
                                break;
                        }
                    }
                }

                @Override
                public void onFailure(Call<AuthResponse> call, Throwable t) {
                    showToast("Network error: " + t.getMessage());
                }
            });
        });
    }


    private void setupSignupLogic() {
        signupButton.setOnClickListener(v -> {
            String first = signupFirstName.getText().toString().trim();
            String last = signupLastName.getText().toString().trim();
            String email = signupEmail.getText().toString().trim();
            String password = signupPassword.getText().toString();
            String ageText = signupAge.getText().toString().trim();

            if (first.isEmpty() || last.isEmpty() || email.isEmpty() || password.isEmpty() || ageText.isEmpty()) {
                showToast("Please fill in all fields.");
                return;
            }

            if (!first.matches("^[A-Za-z]+$") || !last.matches("^[A-Za-z]+$")) {
                showToast("Names must not contain numbers or symbols.");
                return;
            }

            if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
                showToast("Please enter a valid email address.");
                return;
            }


            int age;
            try {
                age = Integer.parseInt(ageText);
            } catch (NumberFormatException e) {
                showToast("Age must be a number.");
                return;
            }

            User.Gender gender = User.Gender.valueOf(signupGender.getSelectedItem().toString());
            User user = new User(null,first, last, age, gender, email, password);

            AnalyticsTracker.signupUser(user, new Callback<Void>() {
                @Override
                public void onResponse(Call<Void> call, Response<Void> response) {
                    if (response.isSuccessful()) {
                        showToast("Signup successful. Please log in.");
                        clearSignupFields();
                        switchToForm(0);
                    } else if (response.code() == 409) {
                        showToast("Email already exists.");
                    } else {
                        showToast("Signup failed: " + response.code());
                    }
                }

                @Override
                public void onFailure(Call<Void> call, Throwable t) {
                    showToast("Network error: " + t.getMessage());
                }
            });
        });
    }

    private void goToMainActivity() {
        Intent intent = new Intent(AuthActivity.this, MainActivity.class);
        startActivity(intent);
        finish();
    }

    private void clearSignupFields() {
        signupFirstName.setText("");
        signupLastName.setText("");
        signupEmail.setText("");
        signupPassword.setText("");
        signupAge.setText("");
        signupGender.setSelection(0);
    }

    private void showToast(String msg) {
        Toast.makeText(this, msg, Toast.LENGTH_SHORT).show();
    }

    private void saveToken(String token) {
        getSharedPreferences("auth", MODE_PRIVATE)
                .edit()
                .putString("jwt_token", token)
                .apply();
    }
    
}

