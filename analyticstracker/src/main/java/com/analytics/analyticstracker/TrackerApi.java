package com.analytics.analyticstracker;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface TrackerApi {

    @POST("/track")
    Call<Void> sendEvent(@Body ActionEvent event);

}
