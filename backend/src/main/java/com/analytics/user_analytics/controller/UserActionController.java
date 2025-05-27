package com.analytics.user_analytics.controller;

import com.analytics.user_analytics.model.User;
import com.analytics.user_analytics.model.UserAction;
import com.analytics.user_analytics.repository.UserActionRepository;
import com.analytics.user_analytics.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
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
        public List<User> getAllUsers() {
                return userRepository.findAll();
        }

        @GetMapping("/stats/by-date")
        public Map<String, Long> getActionCountByDate() {
                return repository.findAll().stream()
                                .collect(Collectors.groupingBy(
                                                action -> action.getTimestamp().toLocalDate().toString(),
                                                TreeMap::new,
                                                Collectors.counting()));
        }

        @GetMapping("/stats/most-popular-action")
        public String getMostPopularAction() {
                return repository.findAll().stream()
                                .collect(Collectors.groupingBy(UserAction::getActionName, Collectors.counting()))
                                .entrySet().stream()
                                .max(Map.Entry.comparingByValue())
                                .map(Map.Entry::getKey)
                                .orElse("No actions found");
        }

        @DeleteMapping("/delete")
        public String deleteAllActions() {
                repository.deleteAll();
                return "All actions deleted successfully";
        }

        @GetMapping("/stats/logs")
        public List<UserAction> getUserLogs(@RequestParam String userId) {
                List<UserAction> actions = repository.findAll();
                return actions.stream()
                                .filter(action -> action.getUserId().equals(userId))
                                .sorted(Comparator.comparing(UserAction::getTimestamp).reversed())
                                .collect(Collectors.toList());
        }

        @GetMapping("/stats/by-category")
        public Map<String, Long> getClicksByCategory(
                        @RequestParam(required = false) String fromDate,
                        @RequestParam(required = false) String toDate,
                        @RequestParam(required = false) List<String> userIds) {

                return repository.findAll().stream()
                                .filter(action -> "click_category".equals(action.getActionName()) &&
                                                action.getProperties() != null &&
                                                action.getProperties().containsKey("category") &&
                                                isInDateRange(action.getTimestamp(), fromDate, toDate) &&
                                                (userIds == null || userIds.isEmpty()
                                                                || userIds.contains(action.getUserId())))
                                .collect(Collectors.groupingBy(
                                                action -> action.getProperties().get("category").toString(),
                                                Collectors.counting()));
        }

      

        @GetMapping("/stats/by-subcategory")
        public Object getClicksBySubcategory(
                        @RequestParam String category,
                        @RequestParam(required = false) String fromDate,
                        @RequestParam(required = false) String toDate,
                        @RequestParam(required = false) List<String> userIds) {

                boolean hasUserFilter = userIds != null && !userIds.isEmpty();

                if (!hasUserFilter) {
                        // החזר מבנה פשוט אם אין יוזרים מסוננים
                        return repository.findAll().stream()
                                        .filter(action -> "click_subcategory".equals(action.getActionName()) &&
                                                        action.getProperties() != null &&
                                                        category.equals(action.getProperties().get("category")) &&
                                                        action.getProperties().containsKey("subcategory") &&
                                                        isInDateRange(action.getTimestamp(), fromDate, toDate))
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
                                                isInDateRange(action.getTimestamp(), fromDate, toDate) &&
                                                userIds.contains(action.getUserId()))
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
                        @RequestParam(required = false) String fromDate,
                        @RequestParam(required = false) String toDate,
                        @RequestParam(required = false) List<String> userIds) {

                boolean hasUserFilter = userIds != null && !userIds.isEmpty();

                if (!hasUserFilter) {
                        // אם אין יוזרים מסוננים – מחזיר מפת item => count
                        return repository.findAll().stream()
                                        .filter(action -> "click_item".equals(action.getActionName()) &&
                                                        action.getProperties() != null &&
                                                        category.equals(action.getProperties().get("category")) &&
                                                        action.getProperties().containsKey("item") &&
                                                        isInDateRange(action.getTimestamp(), fromDate, toDate))
                                        .collect(Collectors.groupingBy(
                                                        action -> action.getProperties().get("item").toString(),
                                                        Collectors.counting()));
                }

                // אם יש יוזרים מסוננים – מחזיר רשימת אובייקטים עם שדות item, userId, count
                return repository.findAll().stream()
                                .filter(action -> "click_item".equals(action.getActionName()) &&
                                                action.getProperties() != null &&
                                                category.equals(action.getProperties().get("category")) &&
                                                action.getProperties().containsKey("item") &&
                                                isInDateRange(action.getTimestamp(), fromDate, toDate) &&
                                                userIds.contains(action.getUserId()))
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
                LocalDateTime from = LocalDateTime.parse(fromDate);
                LocalDateTime to = LocalDateTime.parse(toDate);
                return !timestamp.isBefore(from) && !timestamp.isAfter(to);
        }

        @GetMapping("/stats/by-category-stacked")
        public List<Map<String, Object>> getCategoryCountsByUser(
                        @RequestParam(required = false) List<String> userIds,
                        @RequestParam(required = false) String fromDate,
                        @RequestParam(required = false) String toDate) {

                return repository.findAll().stream()
                                .filter(action -> "click_category".equals(action.getActionName()) &&
                                                action.getProperties() != null &&
                                                action.getProperties().containsKey("category") &&
                                                isInDateRange(action.getTimestamp(), fromDate, toDate) &&
                                                (userIds == null || userIds.isEmpty()
                                                                || userIds.contains(action.getUserId())))
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

}
