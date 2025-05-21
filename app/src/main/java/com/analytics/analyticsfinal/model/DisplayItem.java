package com.analytics.analyticsfinal.model;

public class DisplayItem {
    private final String name;
    private final int imageResId;

    public DisplayItem(String name, int imageResId) {
        this.name = name;
        this.imageResId = imageResId;

    }

    public String getName() {
        return name;
    }

    public int getImageResId() {
        return imageResId;
    }


}
