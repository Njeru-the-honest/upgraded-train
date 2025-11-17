package com.example.fooddelivery.controller;

import com.example.fooddelivery.dto.FeedbackRequest;
import com.example.fooddelivery.dto.FeedbackDTO;
import com.example.fooddelivery.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/feedback")
@CrossOrigin(
    origins = {"http://localhost:5173", "http://127.0.0.1:5173"},
    allowedHeaders = "*",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
    allowCredentials = "true"
)
public class FeedbackController {
    
    private final FeedbackService feedbackService;
    
    @Autowired
    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }
    
    @PostMapping
    public ResponseEntity<?> createFeedback(
            @RequestBody FeedbackRequest feedbackRequest,
            Authentication authentication) {
        try {
            String customerEmail = authentication.getName();
            FeedbackDTO feedback = feedbackService.createFeedback(feedbackRequest, customerEmail);
            return ResponseEntity.ok(feedback);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                Map.of("message", e.getMessage())
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                Map.of("message", "Failed to submit feedback: " + e.getMessage())
            );
        }
    }
    
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<?> getRestaurantFeedbacks(@PathVariable Long restaurantId) {
        try {
            List<FeedbackDTO> feedbacks = feedbackService.getFeedbacksByRestaurant(restaurantId);
            return ResponseEntity.ok(feedbacks);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                Map.of("message", "Failed to fetch feedbacks: " + e.getMessage())
            );
        }
    }
    
    @GetMapping("/restaurant/{restaurantId}/rating")
    public ResponseEntity<?> getRestaurantRating(@PathVariable Long restaurantId) {
        try {
            Double averageRating = feedbackService.getAverageRating(restaurantId);
            return ResponseEntity.ok(Map.of(
                "restaurantId", restaurantId,
                "averageRating", averageRating
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                Map.of("message", "Failed to fetch rating: " + e.getMessage())
            );
        }
    }
    
    @GetMapping("/my-feedbacks")
    public ResponseEntity<?> getMyFeedbacks(Authentication authentication) {
        try {
            String customerEmail = authentication.getName();
            List<FeedbackDTO> feedbacks = feedbackService.getFeedbacksByCustomer(customerEmail);
            return ResponseEntity.ok(feedbacks);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                Map.of("message", "Failed to fetch feedbacks: " + e.getMessage())
            );
        }
    }
}