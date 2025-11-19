package com.example.fooddelivery.dto;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public class OrderRequest {
    
    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;
    
    @NotNull(message = "Items are required")
    private List<OrderItemRequest> items;  // Now uses the separate class
    
    // Constructors
    public OrderRequest() {
    }
    
    public OrderRequest(Long restaurantId, List<OrderItemRequest> items) {
        this.restaurantId = restaurantId;
        this.items = items;
    }
    
    // Getters and Setters
    public Long getRestaurantId() {
        return restaurantId;
    }
    
    public void setRestaurantId(Long restaurantId) {
        this.restaurantId = restaurantId;
    }
    
    public List<OrderItemRequest> getItems() {
        return items;
    }
    
    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }
    
    @Override
    public String toString() {
        return "OrderRequest{" +
                "restaurantId=" + restaurantId +
                ", items=" + items +
                '}';
    }
}