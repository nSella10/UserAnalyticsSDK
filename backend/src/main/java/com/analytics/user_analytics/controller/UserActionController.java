package com.analytics.user_analytics.controller;

import com.analytics.user_analytics.model.User;
import com.analytics.user_analytics.model.UserAction;
import com.analytics.user_analytics.model.Developer;
import com.analytics.user_analytics.repository.UserActionRepository;
import com.analytics.user_analytics.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/track")
public class UserActionController {

        @Autowired
        private UserActionRepository repository;

        @Autowired
        private UserRepository userRepository;

        @PostMapping
        public String trackUserAction(@RequestBody UserAction action) {
                if (action.getUserId() == null || action.getActionName() == null) {
                        return "Missing userId or actionName";
                }
                if (action.getApiKey() == null || action.getApiKey().trim().isEmpty()) {
                        return "Missing API Key";
                }
                if (action.getTimestamp() == null) {
                        action.setTimestamp(LocalDateTime.now());
                }
                repository.save(action);
                return "Action tracked successfully";
        }

        @GetMapping("/stats/count")
        public long getTotalActionsCount() {
                return repository.count();
        }

        @GetMapping("/stats/by-action")
        public Map<String, Long> getActionCountByName() {
                return repository.findAll().stream()
                                .collect(Collectors.groupingBy(
                                                UserAction::getActionName,
                                                Collectors.counting()));
        }

        @GetMapping("/stats/all-users")
        public List<User> getAllUsers(@RequestParam(required = false) String apiKey, HttpServletRequest request) {
                if (apiKey == null || apiKey.trim().isEmpty()) {
                        System.out.println("❌ Missing API Key in getAllUsers request");
                        return new ArrayList<>();
                }

                System.out.println("🔍 Getting users for API Key: " + apiKey);

                // סינון משתמשים לפי API Key (שמור לתאימות לאחור) ו-appId
                List<User> filteredUsers = userRepository.findByApiKey(apiKey);

                System.out.println("✅ Found " + filteredUsers.size() + " users for API Key: " + apiKey);
                return filteredUsers;
        }

        @GetMapping("/stats/logs")
        public List<UserAction> getUserLogs(
                        @RequestParam String userId,
                        @RequestParam(required = false) String fromDate,
                        @RequestParam(required = false) String toDate,
                        @RequestParam(required = false) String apiKey) {

                System.out.println("=== USER LOGS REQUEST ===");
                System.out.println("userId: " + userId);
                System.out.println("fromDate: " + fromDate);
                System.out.println("toDate: " + toDate);
                System.out.println("apiKey: " + apiKey);

                List<UserAction> actions = repository.findAll();
                List<UserAction> filteredActions = actions.stream()
                                .filter(action -> action.getUserId().equals(userId))
                                .filter(action -> isInDateRangeFixed(action.getTimestamp(), fromDate, toDate))
                                .filter(action -> apiKey == null || apiKey.equals(action.getApiKey()))
                                .sorted(Comparator.comparing(UserAction::getTimestamp).reversed())
                                .collect(Collectors.toList());

                System.out.println("Found " + filteredActions.size() + " actions for user " + userId + " with API Key: "
                                + apiKey);
                return filteredActions;
        }

        @GetMapping("/stats/by-category")
        public Map<String, Long> getClicksByCategory(
                        @RequestParam(required = false) String fromDate,
                        @RequestParam(required = false) String toDate,
                        @RequestParam(required = false) List<String> userIds,
                        @RequestParam(required = false) String apiKey) {

                System.out.println("=== BY CATEGORY REQUEST ===");
                System.out.println("fromDate: " + fromDate);
                System.out.println("toDate: " + toDate);
                System.out.println("userIds: " + userIds);
                System.out.println("apiKey: " + apiKey);

                return repository.findAll().stream()
                                .filter(action -> "click_category".equals(action.getActionName()) &&
                                                action.getProperties() != null &&
                                                action.getProperties().containsKey("category") &&
                                                isInDateRangeFixed(action.getTimestamp(), fromDate, toDate) &&
                                                (userIds == null || userIds.isEmpty()
                                                                || userIds.contains(action.getUserId()))
                                                &&
                                                (apiKey == null || apiKey.equals(action.getApiKey())))
                                .collect(Collectors.groupingBy(
                                                action -> action.getProperties().get("category").toString(),
                                                Collectors.counting()));
        }

        @GetMapping("/stats/by-subcategory")
        public Object getClicksBySubcategory(
                        @RequestParam String category,
                        @RequestParam(required = false) String fromDate,
                        @RequestParam(required = false) String toDate,
                        @RequestParam(required = false) List<String> userIds,
                        @RequestParam(required = false) String apiKey) {

                boolean hasUserFilter = userIds != null && !userIds.isEmpty();

                if (!hasUserFilter) {
                        // החזר מבנה פשוט אם אין יוזרים מסוננים
                        return repository.findAll().stream()
                                        .filter(action -> "click_subcategory".equals(action.getActionName()) &&
                                                        action.getProperties() != null &&
                                                        category.equals(action.getProperties().get("category")) &&
                                                        action.getProperties().containsKey("subcategory") &&
                                                        isInDateRangeFixed(action.getTimestamp(), fromDate, toDate) &&
                                                        (apiKey == null || apiKey.equals(action.getApiKey())))
                                        .collect(Collectors.groupingBy(
                                                        action -> action.getProperties().get("subcategory").toString(),
                                                        Collectors.counting()));
                }

                // אם כן יש יוזרים מסוננים — מחזיר רשימה של אובייקטים עם שדות
                return repository.findAll().stream()
                                .filter(action -> "click_subcategory".equals(action.getActionName()) &&
                                                action.getProperties() != null &&
                                                category.equals(action.getProperties().get("category")) &&
                                                action.getProperties().containsKey("subcategory") &&
                                                isInDateRangeFixed(action.getTimestamp(), fromDate, toDate) &&
                                                userIds.contains(action.getUserId()) &&
                                                (apiKey == null || apiKey.equals(action.getApiKey())))
                                .collect(Collectors.groupingBy(
                                                action -> Map.of(
                                                                "subcategory",
                                                                action.getProperties().get("subcategory").toString(),
                                                                "userId", action.getUserId()),
                                                Collectors.counting()))
                                .entrySet().stream()
                                .map(entry -> {
                                        Map<String, Object> result = new HashMap<>(entry.getKey());
                                        result.put("count", entry.getValue());
                                        return result;
                                })
                                .collect(Collectors.toList());
        }

        @GetMapping("/stats/by-item")
        public Object getClicksByItem(
                        @RequestParam String category,
                        @RequestParam(required = false) String subcategory,
                        @RequestParam(required = false) String fromDate,
                        @RequestParam(required = false) String toDate,
                        @RequestParam(required = false) List<String> userIds,
                        @RequestParam(required = false) String apiKey) {

                boolean hasUserFilter = userIds != null && !userIds.isEmpty();

                if (!hasUserFilter) {
                        // אם אין יוזרים מסוננים – מחזיר מפת item => count
                        return repository.findAll().stream()
                                        .filter(action -> "click_item".equals(action.getActionName()) &&
                                                        action.getProperties() != null &&
                                                        category.equals(action.getProperties().get("category")) &&
                                                        (subcategory == null || subcategory.equals(
                                                                        action.getProperties().get("subcategory")))
                                                        &&
                                                        action.getProperties().containsKey("item") &&
                                                        isInDateRangeFixed(action.getTimestamp(), fromDate, toDate) &&
                                                        (apiKey == null || apiKey.equals(action.getApiKey())))
                                        .collect(Collectors.groupingBy(
                                                        action -> action.getProperties().get("item").toString(),
                                                        Collectors.counting()));
                }

                // אם יש יוזרים מסוננים – מחזיר רשימת אובייקטים עם שדות item, userId, count
                return repository.findAll().stream()
                                .filter(action -> "click_item".equals(action.getActionName()) &&
                                                action.getProperties() != null &&
                                                category.equals(action.getProperties().get("category")) &&
                                                (subcategory == null || subcategory
                                                                .equals(action.getProperties().get("subcategory")))
                                                &&
                                                action.getProperties().containsKey("item") &&
                                                isInDateRangeFixed(action.getTimestamp(), fromDate, toDate) &&
                                                userIds.contains(action.getUserId()) &&
                                                (apiKey == null || apiKey.equals(action.getApiKey())))
                                .collect(Collectors.groupingBy(
                                                action -> Map.of(
                                                                "item", action.getProperties().get("item").toString(),
                                                                "userId", action.getUserId()),
                                                Collectors.counting()))
                                .entrySet().stream()
                                .map(entry -> {
                                        Map<String, Object> result = new HashMap<>(entry.getKey());
                                        result.put("count", entry.getValue());
                                        return result;
                                })
                                .collect(Collectors.toList());
        }

        private boolean isInDateRange(LocalDateTime timestamp, String fromDate, String toDate) {
                if (fromDate == null || toDate == null)
                        return true;
                // LocalDateTime from = LocalDateTime.parse(fromDate);
                // LocalDateTime to = LocalDateTime.parse(toDate);
                // return !timestamp.isBefore(from) && !timestamp.isAfter(to);
                try {
                        // ניקוי פורמט: הסרת Z או +00:00 אם קיימים
                        String cleanFrom = fromDate.replace("Z", "").replace("+00:00", "");
                        String cleanTo = toDate.replace("Z", "").replace("+00:00", "");

                        LocalDateTime from, to;

                        if (cleanFrom.contains("T")) {
                                from = LocalDateTime.parse(cleanFrom);
                        } else {
                                from = LocalDateTime.parse(cleanFrom + "T00:00:00");
                        }

                        if (cleanTo.contains("T")) {
                                to = LocalDateTime.parse(cleanTo);
                        } else {
                                to = LocalDateTime.parse(cleanTo + "T23:59:59");
                        }

                        return (!timestamp.isBefore(from)) && (!timestamp.isAfter(to));

                } catch (Exception e) {
                        System.err.println("Error parsing date range: " + e.getMessage());
                        return true;
                }
        }

        @GetMapping("/stats/by-category-stacked")
        public List<Map<String, Object>> getCategoryCountsByUser(
                        @RequestParam(required = false) List<String> userIds,
                        @RequestParam(required = false) String fromDate,
                        @RequestParam(required = false) String toDate,
                        @RequestParam(required = false) String apiKey) {

                return repository.findAll().stream()
                                .filter(action -> "click_category".equals(action.getActionName()) &&
                                                action.getProperties() != null &&
                                                action.getProperties().containsKey("category") &&
                                                isInDateRangeFixed(action.getTimestamp(), fromDate, toDate) &&
                                                (userIds == null || userIds.isEmpty()
                                                                || userIds.contains(action.getUserId()))
                                                &&
                                                (apiKey == null || apiKey.equals(action.getApiKey())))
                                .collect(Collectors.groupingBy(
                                                action -> Map.of(
                                                                "category",
                                                                action.getProperties().get("category").toString(),
                                                                "userId", action.getUserId()),
                                                Collectors.counting()))
                                .entrySet().stream()
                                .map(entry -> {
                                        Map<String, Object> result = new HashMap<>(entry.getKey());
                                        result.put("count", entry.getValue());
                                        return result;
                                })
                                .collect(Collectors.toList());
        }

        @GetMapping("/user-actions/users")
        public List<String> getAllUserIds() {
                return repository.findAll().stream()
                                .map(UserAction::getUserId)
                                .distinct()
                                .sorted()
                                .collect(Collectors.toList());
        }

        private boolean isInDateRangeFixed(LocalDateTime timestamp, String fromDate, String toDate) {
                if (fromDate == null || toDate == null) {
                        System.out.println("No date filter applied");
                        return true;
                }

                try {
                        // המרה של תאריכים מ-ISO format ל-LocalDateTime
                        LocalDateTime from = parseISODateTime(fromDate);
                        LocalDateTime to = parseISODateTime(toDate);

                        System.out.println(
                                        "Checking timestamp: " + timestamp + " against range: " + from + " to " + to);

                        boolean inRange = !timestamp.isBefore(from) && !timestamp.isAfter(to);
                        System.out.println("In range: " + inRange);

                        return inRange;
                } catch (Exception e) {
                        System.err.println("❌ Error parsing date range: " + e.getMessage());
                        e.printStackTrace();
                        return true;
                }
        }

        private LocalDateTime parseISODateTime(String dateStr) {
                if (dateStr == null)
                        return null;

                try {
                        // המרה מ-ISO string ל-LocalDateTime עם התחשבות ב-timezone
                        java.time.Instant instant = java.time.Instant.parse(dateStr);
                        // המרה לזמן מקומי (ישראל) - זה יתאים את הזמן לזמן המקומי
                        LocalDateTime result = instant.atZone(java.time.ZoneId.of("Asia/Jerusalem")).toLocalDateTime();
                        System.out.println("🕐 Parsed date: " + dateStr + " -> " + result + " (Israel time)");
                        return result;
                } catch (Exception e) {
                        System.err.println("❌ Error parsing date: " + dateStr + " - " + e.getMessage());
                        // fallback - ננסה עם הפורמט הישן
                        try {
                                String clean = dateStr.replace("Z", "").split("\\+")[0];
                                if (clean.contains(".")) {
                                        clean = clean.substring(0, clean.indexOf("."));
                                }
                                return LocalDateTime.parse(clean);
                        } catch (Exception e2) {
                                System.err.println("❌ Fallback parsing also failed: " + e2.getMessage());
                                return LocalDateTime.now();
                        }
                }
        }

}
