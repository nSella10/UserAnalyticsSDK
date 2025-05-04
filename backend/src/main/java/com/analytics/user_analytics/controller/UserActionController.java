
package com.analytics.user_analytics.controller;

import com.analytics.user_analytics.model.UserAction;
import com.analytics.user_analytics.repository.UserActionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")

@RestController // מסמן ששזה מחלקת controller שמחזירה json
@RequestMapping("/track")
public class UserActionController {

    @Autowired // הספרינג יזריק את הrepository שלנו
    private UserActionRepository repository;

    @PostMapping // מאזין לבקשות post
    public String trackUserAction(@RequestBody UserAction action) { // ממיר json לאובייקט user action
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

        return repository.count(); // מחזיר מספר מסמכים במסד נתונים
    }

    @GetMapping("/stats/by-action")
    public Map<String, Long> getActionCountByName() {
        return repository.findAll().stream()
                .collect(Collectors.groupingBy(
                        UserAction::getActionName,
                        Collectors.counting()));
    }

    @GetMapping("/stats/by-user")
    public Map<String, Long> getActionCountByUser() {
        return repository.findAll().stream()
                .collect(Collectors.groupingBy(
                        UserAction::getUserId,
                        Collectors.counting()));
    }

    @GetMapping("/stats/by-user/by-date")
    public Map<String, Long> getUserActionsByDate(@RequestParam String userId) {
        return repository.findAll().stream()
                .filter(action -> action.getUserId().equals(userId))
                .collect(Collectors.groupingBy(
                        action -> action.getTimestamp().toLocalDate().toString(),
                        TreeMap::new,
                        Collectors.counting()));
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

    @GetMapping("/stats/top-action-by-user")
    public String getTopActionByUser(@RequestParam String userId) {
        List<UserAction> userActions = repository.findAll().stream()
                .filter(action -> action.getUserId().equals(userId))
                .collect(Collectors.toList());

        return userActions.stream()
                .collect(Collectors.groupingBy(UserAction::getActionName, Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("No actions found for user");
    }

    @GetMapping("/stats/by-user-and-action")
    public Map<String, Long> getActionsGroupedByUserAndAction(@RequestParam String userId) {
        return repository.findAll().stream()
                .filter(action -> action.getUserId().equals(userId))
                .collect(Collectors.groupingBy(UserAction::getActionName, Collectors.counting()));
    }

    @DeleteMapping("/delete")
    public String deleteAllActions() {
        repository.deleteAll();
        return "All actions deleted successfully";
    }

}
