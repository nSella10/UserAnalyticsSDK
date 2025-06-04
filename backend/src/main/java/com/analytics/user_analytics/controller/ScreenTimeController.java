package com.analytics.user_analytics.controller;

import com.analytics.user_analytics.model.ScreenTime;
import com.analytics.user_analytics.repository.ScreenTimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/screen-time")
@CrossOrigin(origins = "*")
public class ScreenTimeController {

    @Autowired
    private ScreenTimeRepository screenTimeRepository;

    // שמירת זמן מסך חדש
    @PostMapping("/save")
    public ResponseEntity<ScreenTime> saveScreenTime(@RequestBody ScreenTime screenTime) {
        try {
            if (screenTime.getApiKey() == null || screenTime.getApiKey().trim().isEmpty()) {
                System.err.println("❌ Missing API Key in screen time request");
                return ResponseEntity.status(400).body(null);
            }
            if (screenTime.getTimestamp() == null) {
                screenTime.setTimestamp(LocalDateTime.now());
            }
            ScreenTime saved = screenTimeRepository.save(screenTime);
            System.out.println("✅ Screen time saved: " + saved);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            System.err.println("❌ Error saving screen time: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    // קבלת כל זמני המסך
    @GetMapping("/all")
    public ResponseEntity<List<ScreenTime>> getAllScreenTimes() {
        try {
            List<ScreenTime> screenTimes = screenTimeRepository.findAll();
            return ResponseEntity.ok(screenTimes);
        } catch (Exception e) {
            System.err.println("❌ Error getting all screen times: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    // קבלת זמני מסך לפי משתמש
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ScreenTime>> getScreenTimesByUser(@PathVariable String userId) {
        try {
            List<ScreenTime> screenTimes = screenTimeRepository.findByUserId(userId);
            return ResponseEntity.ok(screenTimes);
        } catch (Exception e) {
            System.err.println("❌ Error getting screen times for user: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    // סטטיסטיקות זמני מסך לפי מסך
    @GetMapping("/stats/by-screen")
    public ResponseEntity<Map<String, Long>> getScreenTimeStatsByScreen(
            @RequestParam(required = false) List<String> userIds,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate) {
        try {
            System.out.println("=== SCREEN TIME STATS BY SCREEN ===");
            System.out.println("userIds: " + userIds);
            System.out.println("fromDate: " + fromDate);
            System.out.println("toDate: " + toDate);

            List<ScreenTime> screenTimes;

            if (userIds != null && !userIds.isEmpty()) {
                // אם יש משתמשים ספציפיים
                screenTimes = screenTimeRepository.findAll().stream()
                        .filter(st -> userIds.contains(st.getUserId()))
                        .collect(Collectors.toList());
            } else {
                screenTimes = screenTimeRepository.findAll();
            }

            System.out.println("Total screen times before date filter: " + screenTimes.size());

            // פילטר לפי תאריכים אם נדרש
            if (fromDate != null && toDate != null) {
                LocalDateTime from = LocalDateTime.parse(fromDate.replace("Z", ""));
                LocalDateTime to = LocalDateTime.parse(toDate.replace("Z", ""));

                System.out.println("Filtering from: " + from + " to: " + to);

                screenTimes = screenTimes.stream()
                        .filter(st -> {
                            boolean inRange = !st.getTimestamp().isBefore(from) && !st.getTimestamp().isAfter(to);
                            if (!inRange) {
                                System.out.println("Filtered out: " + st.getTimestamp() + " (not in range)");
                            }
                            return inRange;
                        })
                        .collect(Collectors.toList());
            }

            System.out.println("Total screen times after date filter: " + screenTimes.size());

            // חישוב סך זמן לכל מסך
            Map<String, Long> stats = screenTimes.stream()
                    .collect(Collectors.groupingBy(
                            ScreenTime::getScreenName,
                            Collectors.summingLong(ScreenTime::getDuration)));

            System.out.println("Final stats: " + stats);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("❌ Error calculating screen time stats: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    // סטטיסטיקות זמני מסך לפי משתמש
    @GetMapping("/stats/by-user")
    public ResponseEntity<Map<String, Long>> getScreenTimeStatsByUser(
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate) {
        try {
            List<ScreenTime> screenTimes = screenTimeRepository.findAll();

            // פילטר לפי תאריכים אם נדרש
            if (fromDate != null && toDate != null) {
                LocalDateTime from = LocalDateTime.parse(fromDate.replace("Z", ""));
                LocalDateTime to = LocalDateTime.parse(toDate.replace("Z", ""));

                screenTimes = screenTimes.stream()
                        .filter(st -> !st.getTimestamp().isBefore(from) && !st.getTimestamp().isAfter(to))
                        .collect(Collectors.toList());
            }

            // חישוב סך זמן לכל משתמש
            Map<String, Long> stats = screenTimes.stream()
                    .collect(Collectors.groupingBy(
                            ScreenTime::getUserId,
                            Collectors.summingLong(ScreenTime::getDuration)));

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("❌ Error calculating screen time stats by user: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    // פעילות זמני מסך למשתמש עם פורמט קריא
    @GetMapping("/user-screen-time/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getUserScreenTime(
            @PathVariable String userId,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate) {
        try {
            System.out.println("=== USER SCREEN TIME REQUEST ===");
            System.out.println("userId: " + userId);
            System.out.println("fromDate: " + fromDate);
            System.out.println("toDate: " + toDate);

            List<ScreenTime> screenTimes = screenTimeRepository.findByUserId(userId);

            // פילטר לפי תאריכים אם נדרש
            if (fromDate != null && toDate != null) {
                LocalDateTime from = parseISODateTime(fromDate);
                LocalDateTime to = parseISODateTime(toDate);

                System.out.println("Filtering screen times from: " + from + " to: " + to);

                screenTimes = screenTimes.stream()
                        .filter(st -> {
                            boolean inRange = !st.getTimestamp().isBefore(from) && !st.getTimestamp().isAfter(to);
                            if (!inRange) {
                                System.out
                                        .println("Filtered out screen time: " + st.getTimestamp() + " (not in range)");
                            }
                            return inRange;
                        })
                        .collect(Collectors.toList());
            }

            List<Map<String, Object>> result = screenTimes.stream()
                    .map(screenTime -> {
                        Map<String, Object> item = new HashMap<>();
                        item.put("id", screenTime.getId());
                        item.put("screenName", screenTime.getScreenName());
                        item.put("duration", formatDuration(screenTime.getDuration()));
                        item.put("durationMs", screenTime.getDuration());
                        item.put("startTime", formatDateTime(screenTime.getStartTime()));
                        item.put("endTime", formatDateTime(screenTime.getEndTime()));
                        item.put("timestamp", formatDateTime(screenTime.getTimestamp()));
                        item.put("sessionId", screenTime.getSessionId());
                        return item;
                    })
                    .sorted((a, b) -> {
                        String timeA = (String) a.get("timestamp");
                        String timeB = (String) b.get("timestamp");
                        return timeB.compareTo(timeA); // מיון לפי זמן יורד
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println("❌ Error getting user screen time: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    private String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null)
            return null;
        return dateTime.format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));
    }

    // סיכום זמני מסך לפי קטגוריות למשתמש
    @GetMapping("/user-screen-summary/{userId}")
    public ResponseEntity<Map<String, Object>> getUserScreenSummary(
            @PathVariable String userId,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate,
            @RequestParam(required = false) String apiKey) {
        try {
            System.out.println("=== USER SCREEN SUMMARY REQUEST ===");
            System.out.println("userId: " + userId);
            System.out.println("fromDate: " + fromDate);
            System.out.println("toDate: " + toDate);
            System.out.println("apiKey: " + apiKey);

            // סינון לפי API Key
            List<ScreenTime> screenTimes = screenTimeRepository.findAll().stream()
                    .filter(st -> st.getUserId().equals(userId))
                    .filter(st -> apiKey == null || apiKey.equals(st.getApiKey()))
                    .collect(Collectors.toList());

            // פילטר לפי תאריכים אם נדרש
            if (fromDate != null && toDate != null) {
                LocalDateTime from = parseISODateTime(fromDate);
                LocalDateTime to = parseISODateTime(toDate);

                System.out.println("Filtering screen summary from: " + from + " to: " + to);

                screenTimes = screenTimes.stream()
                        .filter(st -> {
                            boolean inRange = !st.getTimestamp().isBefore(from) && !st.getTimestamp().isAfter(to);
                            if (!inRange) {
                                System.out
                                        .println("Filtered out screen time: " + st.getTimestamp() + " (not in range)");
                            }
                            return inRange;
                        })
                        .collect(Collectors.toList());
            }

            // קיבוץ לפי קטגוריות (לפי שם המסך)
            Map<String, Long> categoryTotals = new HashMap<>();
            Map<String, Integer> categoryVisits = new HashMap<>();
            long totalTime = 0;

            for (ScreenTime screenTime : screenTimes) {
                String screenName = screenTime.getScreenName();
                String category = getCategoryFromScreenName(screenName);

                categoryTotals.put(category, categoryTotals.getOrDefault(category, 0L) + screenTime.getDuration());
                categoryVisits.put(category, categoryVisits.getOrDefault(category, 0) + 1);
                totalTime += screenTime.getDuration();
            }

            // יצירת תוצאה מפורטת
            Map<String, Object> result = new HashMap<>();
            result.put("userId", userId);
            result.put("totalTimeMs", totalTime);
            result.put("totalTimeFormatted", formatDuration(totalTime));
            result.put("totalScreens", screenTimes.size());

            List<Map<String, Object>> categories = new ArrayList<>();
            for (Map.Entry<String, Long> entry : categoryTotals.entrySet()) {
                String category = entry.getKey();
                Long duration = entry.getValue();

                Map<String, Object> categoryData = new HashMap<>();
                categoryData.put("category", category);
                categoryData.put("durationMs", duration);
                categoryData.put("durationFormatted", formatDuration(duration));
                categoryData.put("visits", categoryVisits.get(category));
                categoryData.put("percentage", totalTime > 0 ? Math.round((duration * 100.0) / totalTime) : 0);
                categoryData.put("averageTimePerVisit",
                        categoryVisits.get(category) > 0 ? formatDuration(duration / categoryVisits.get(category))
                                : "0");

                categories.add(categoryData);
            }

            // מיון לפי זמן (הכי הרבה זמן קודם)
            categories.sort((a, b) -> Long.compare((Long) b.get("durationMs"), (Long) a.get("durationMs")));

            result.put("categories", categories);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println("❌ Error getting user screen summary: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    // פונקציה לזיהוי קטגוריה לפי שם המסך
    private String getCategoryFromScreenName(String screenName) {
        if (screenName == null)
            return "אחר";

        String lowerScreenName = screenName.toLowerCase();

        // זיהוי קטגוריות ספציפיות מתוך שם המסך החדש
        if (lowerScreenName.contains("categoryactivity_")) {
            String category = extractCategoryFromScreenName(screenName, "CategoryActivity_");
            return category != null ? category : "עיון בקטגוריות";
        }

        if (lowerScreenName.contains("itemdetailactivity_")) {
            String category = extractCategoryFromScreenName(screenName, "ItemDetailActivity_");
            return category != null ? category : "צפייה בפרטים";
        }

        // קטגוריות ספורט
        if (lowerScreenName.contains("sport") || lowerScreenName.contains("football") ||
                lowerScreenName.contains("basketball") || lowerScreenName.contains("tennis") ||
                lowerScreenName.contains("soccer") || lowerScreenName.contains("ספורט")) {
            return "ספורט";
        }

        // קטגוריות טכנולוגיה
        if (lowerScreenName.contains("tech") || lowerScreenName.contains("computer") ||
                lowerScreenName.contains("programming") || lowerScreenName.contains("software") ||
                lowerScreenName.contains("טכנולוגיה") || lowerScreenName.contains("מחשב")) {
            return "טכנולוגיה";
        }

        // קטגוריות בידור
        if (lowerScreenName.contains("entertainment") || lowerScreenName.contains("movie") ||
                lowerScreenName.contains("music") || lowerScreenName.contains("game") ||
                lowerScreenName.contains("בידור") || lowerScreenName.contains("סרט") ||
                lowerScreenName.contains("מוזיקה") || lowerScreenName.contains("סרטים") ||
                lowerScreenName.contains("משחקים")) {
            return "בידור";
        }

        // קטגוריות חדשות
        if (lowerScreenName.contains("news") || lowerScreenName.contains("חדשות")) {
            return "חדשות";
        }

        // קטגוריות נוספות
        if (lowerScreenName.contains("ספרים") || lowerScreenName.contains("book")) {
            return "ספרים";
        }

        if (lowerScreenName.contains("אוכל") || lowerScreenName.contains("food")) {
            return "אוכל";
        }

        if (lowerScreenName.contains("טיולים") || lowerScreenName.contains("travel")) {
            return "טיולים";
        }

        // אם זה MainActivity או דף ראשי
        if (lowerScreenName.contains("main") || lowerScreenName.contains("home") ||
                lowerScreenName.contains("ראשי")) {
            return "דף ראשי";
        }

        // אם זה CategoryActivity, ננסה לזהות לפי הקונטקסט
        if (lowerScreenName.contains("category")) {
            return "עיון בקטגוריות";
        }

        // אם זה ItemDetailActivity
        if (lowerScreenName.contains("itemdetail") || lowerScreenName.contains("detail")) {
            return "צפייה בפרטים";
        }

        return "אחר";
    }

    // פונקציה עזר לחילוץ שם הקטגוריה מתוך שם המסך
    private String extractCategoryFromScreenName(String screenName, String prefix) {
        try {
            int startIndex = screenName.indexOf(prefix);
            if (startIndex != -1) {
                String categoryPart = screenName.substring(startIndex + prefix.length());
                // אם יש תת-קטגוריה, נקח רק את הקטגוריה הראשית
                String[] parts = categoryPart.split("_");
                if (parts.length > 0) {
                    return parts[0];
                }
            }
        } catch (Exception e) {
            System.err.println("Error extracting category from screen name: " + e.getMessage());
        }
        return null;
    }

    private LocalDateTime parseISODateTime(String dateStr) {
        if (dateStr == null)
            return null;

        try {
            // המרה מ-ISO string ל-LocalDateTime עם התחשבות ב-timezone
            java.time.Instant instant = java.time.Instant.parse(dateStr);
            // המרה לזמן מקומי (ישראל) - זה יתאים את הזמן לזמן המקומי
            LocalDateTime result = instant.atZone(java.time.ZoneId.of("Asia/Jerusalem")).toLocalDateTime();
            System.out.println("🕐 ScreenTime parsed date: " + dateStr + " -> " + result + " (Israel time)");
            return result;
        } catch (Exception e) {
            System.err.println("❌ Error parsing screen time date: " + dateStr + " - " + e.getMessage());
            // fallback - ננסה עם הפורמט הישן
            try {
                String cleanDate = dateStr.replace("Z", "").replaceAll("\\+\\d{2}:\\d{2}$", "");
                if (cleanDate.contains(".")) {
                    cleanDate = cleanDate.substring(0, cleanDate.indexOf("."));
                }
                return LocalDateTime.parse(cleanDate);
            } catch (Exception e2) {
                System.err.println("❌ Fallback screen time parsing also failed: " + e2.getMessage());
                return LocalDateTime.now();
            }
        }
    }

    private String formatDuration(long durationMs) {
        if (durationMs < 1000) {
            return durationMs + " ms";
        } else if (durationMs < 60000) {
            return String.format("%.1f שניות", durationMs / 1000.0);
        } else if (durationMs < 3600000) {
            return String.format("%.1f דקות", durationMs / 60000.0);
        } else {
            return String.format("%.1f שעות", durationMs / 3600000.0);
        }
    }
}
