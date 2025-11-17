package com.example.fooddelivery.controller;

import com.example.fooddelivery.model.Customer;
import com.example.fooddelivery.model.Order;
import com.example.fooddelivery.model.Restaurant;
import com.example.fooddelivery.service.CustomerService;
import com.example.fooddelivery.service.OrderService;
import com.example.fooddelivery.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@CrossOrigin(
    origins = {"http://localhost:5173", "http://127.0.0.1:5173"},
    allowedHeaders = "*",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
    allowCredentials = "true"
)
public class AdminController {
    
    private final RestaurantService restaurantService;
    private final OrderService orderService;
    private final CustomerService customerService;
    
    @Autowired
    public AdminController(RestaurantService restaurantService,
                          OrderService orderService,
                          CustomerService customerService) {
        this.restaurantService = restaurantService;
        this.orderService = orderService;
        this.customerService = customerService;
    }
    
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        List<Restaurant> restaurants = restaurantService.getAllRestaurants();
        List<Order> orders = orderService.getAllOrders();
        List<Customer> customers = customerService.getAllCustomers();
        
        // Calculate total revenue from all orders
        double totalRevenue = orders.stream()
            .flatMap(order -> order.getOrderItems().stream())
            .mapToDouble(item -> item.getUnitPrice() * item.getQuantity())
            .sum();
        
        stats.put("totalRestaurants", restaurants.size());
        stats.put("totalOrders", orders.size());
        stats.put("totalCustomers", customers.size());
        stats.put("totalRevenue", totalRevenue);
        stats.put("restaurants", restaurants);
        stats.put("recentOrders", orders);
        stats.put("customers", customers);
        
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/restaurants")
    public ResponseEntity<List<Restaurant>> getAllRestaurants() {
        return ResponseEntity.ok(restaurantService.getAllRestaurants());
    }
    
    @PostMapping("/restaurants")
    public ResponseEntity<Restaurant> createRestaurant(@RequestBody Restaurant restaurant) {
        return ResponseEntity.ok(restaurantService.createRestaurant(restaurant));
    }
    
    @PutMapping("/restaurants/{id}")
    public ResponseEntity<Restaurant> updateRestaurant(
            @PathVariable Long id,
            @RequestBody Restaurant restaurant) {
        return ResponseEntity.ok(restaurantService.updateRestaurant(id, restaurant));
    }
    
    @DeleteMapping("/restaurants/{id}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable Long id) {
        restaurantService.deleteRestaurant(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
    
    @GetMapping("/customers")
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }
}