package com.analytics.analyticstracker.api;

import com.analytics.analyticstracker.model.ScreenTime;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;
import retrofit2.http.Query;

public interface ScreenTimeApi {
    @POST("screen-time/save")
    Call<Void> trackScreenTime(@Body ScreenTime screenTime, @Query("apiKey") String apiKey);
}
