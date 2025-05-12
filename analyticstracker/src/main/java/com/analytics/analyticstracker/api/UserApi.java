package com.analytics.analyticstracker.api;

import com.analytics.analyticstracker.model.User;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Query;

public interface UserApi {
    @POST("users/register")
    Call<Void> registerUser(@Body User user);

    @GET("users/login")
    Call<User> loginUser(@Query("email")String email, @Query("password") String password);

}
