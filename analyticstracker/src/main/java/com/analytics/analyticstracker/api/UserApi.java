package com.analytics.analyticstracker.api;

import com.analytics.analyticstracker.model.LoginRequest;
import com.analytics.analyticstracker.model.UpdateNameRequest;
import com.analytics.analyticstracker.model.User;
import com.analytics.analyticstracker.model.AuthResponse;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;
import retrofit2.http.Query;

public interface UserApi {
    @POST("users/register")
    Call<Void> registerUser(@Body User user);

    @POST("users/login")
    Call<AuthResponse> loginUser(@Body LoginRequest request);

    @POST("users/update-name")
    Call<Void> updateUserName(@Body UpdateNameRequest request);


}
