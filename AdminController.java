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
    origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"},
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
        
        stats.put("totalRestaurants", restaurants.size());
        stats.put("totalOrders", orders.size());
        stats.put("totalCustomers", customers.size());
        
        // Calculate total revenue
        double totalRevenue = orders.stream()
            .filter(order -> order.getPayment() != null)
            .mapToDouble(order -> order.getPayment().getAmount())
            .sum();
        stats.put("totalRevenue", totalRevenue);
        
        stats.put("restaurants", restaurants);
        stats.put("recentOrders", orders.stream().limit(10).toList());
        stats.put("customers", customers);
        
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/restaurants")
    public ResponseEntity<List<Restaurant>> getAllRestaurants() {
        return ResponseEntity.ok(restaurantService.getAllRestaurants());
    }
    
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
    
    @GetMapping("/customers")
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
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
}
