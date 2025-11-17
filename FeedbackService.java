package com.example.fooddelivery.service;

import com.example.fooddelivery.dto.FeedbackRequest;
import com.example.fooddelivery.dto.FeedbackDTO;
import com.example.fooddelivery.exception.ResourceNotFoundException;
import com.example.fooddelivery.model.Customer;
import com.example.fooddelivery.model.Feedback;
import com.example.fooddelivery.model.Restaurant;
import com.example.fooddelivery.repository.CustomerRepository;
import com.example.fooddelivery.repository.FeedbackRepository;
import com .example.fooddelivery.repository.RestaurantRepository; 
import org.springframework.beans.factory.annotation.Autowired; 
import org.springframework.stereotype.Service; 
import org.springframework.transaction.annotation.Transactional;
import java.time.format.DateTimeFormatter; 
import java.util.List; 
import java.util.stream.Collectors;

@Service 
public class FeedbackService {
    private final FeedbackRepository feedbackRepository;
private final CustomerRepository customerRepository;
private final RestaurantRepository restaurantRepository;

@Autowired
public FeedbackService(FeedbackRepository feedbackRepository,
                      CustomerRepository customerRepository,
                      RestaurantRepository restaurantRepository) {
    this.feedbackRepository = feedbackRepository;
    this.customerRepository = customerRepository;
    this.restaurantRepository = restaurantRepository;
}

@Transactional
public FeedbackDTO createFeedback(FeedbackRequest feedbackRequest, String customerEmail) {
    Customer customer = customerRepository.findByEmail(customerEmail)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found with email: " + customerEmail));
    
    Restaurant restaurant = restaurantRepository.findById(feedbackRequest.getRestaurantId())
            .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + feedbackRequest.getRestaurantId()));
    
    // Validate rating
    if (feedbackRequest.getRating() < 1 || feedbackRequest.getRating() > 5) {
        throw new IllegalArgumentException("Rating must be between 1 and 5");
    }
    
    Feedback feedback = new Feedback();
    feedback.setCustomer(customer);
    feedback.setRestaurant(restaurant);
    feedback.setRating(feedbackRequest.getRating());
    feedback.setComment(feedbackRequest.getComment());
    
    Feedback savedFeedback = feedbackRepository.save(feedback);
    
    return convertToDTO(savedFeedback);
}

@Transactional(readOnly = true)
public List<FeedbackDTO> getFeedbacksByRestaurant(Long restaurantId) {
    Restaurant restaurant = restaurantRepository.findById(restaurantId)
            .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + restaurantId));
    
    List<Feedback> feedbacks = feedbackRepository.findByRestaurant(restaurant);
    
    return feedbacks.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
}

@Transactional(readOnly = true)
public List<FeedbackDTO> getFeedbacksByCustomer(String customerEmail) {
    Customer customer = customerRepository.findByEmail(customerEmail)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found with email: " + customerEmail));
    
    List<Feedback> feedbacks = feedbackRepository.findByCustomer(customer);
    
    return feedbacks.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
}

@Transactional(readOnly = true)
public Double getAverageRating(Long restaurantId) {
    Restaurant restaurant = restaurantRepository.findById(restaurantId)
            .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + restaurantId));
    
    List<Feedback> feedbacks = feedbackRepository.findByRestaurant(restaurant);
    
    if (feedbacks.isEmpty()) {
        return 0.0;
    }
    
    return feedbacks.stream()
            .mapToInt(Feedback::getRating)
            .average()
            .orElse(0.0);
}

private FeedbackDTO convertToDTO(Feedback feedback) {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    return new FeedbackDTO(
        feedback.getId(),
        feedback.getCustomer().getId(),
        feedback.getCustomer().getName(),
        feedback.getRestaurant().getId(),
        feedback.getRestaurant().getName(),
        feedback.getRating(),
        feedback.getComment(),
        feedback.getDate().format(formatter)
    );
}
}