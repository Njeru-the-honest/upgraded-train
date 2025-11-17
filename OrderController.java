package com.example.fooddelivery.controller;

import com.example.fooddelivery.dto.OrderRequest;
import com.example.fooddelivery.dto.PaymentRequest;
import com.example.fooddelivery.model.Order;
import com.example.fooddelivery.model.OrderStatus;
import com.example.fooddelivery.model.Payment;
import com.example.fooddelivery.service.OrderService;
import com.example.fooddelivery.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/orders")
@CrossOrigin(
    origins = {"http://localhost:5173", "http://127.0.0.1:5173"},
    allowedHeaders = "*",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
    allowCredentials = "true"
)
public class OrderController {
    
    private final OrderService orderService;
    private final PaymentService paymentService;
    
    @Autowired
    public OrderController(OrderService orderService, PaymentService paymentService) {
        this.orderService = orderService;
        this.paymentService = paymentService;
    }
    
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest, 
                                        Authentication authentication) {
        try {
            String customerEmail = authentication.getName();
            Order order = orderService.createOrder(orderRequest, customerEmail);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            System.err.println("Order creation error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(
                Map.of("message", "Failed to create order: " + e.getMessage())
            );
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }
    
    @GetMapping("/{id}/track")
    public ResponseEntity<Order> trackOrder(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }
    
    @GetMapping("/user")
    public ResponseEntity<?> getUserOrders(Authentication authentication) {
        try {
            String customerEmail = authentication.getName();
            return ResponseEntity.ok(orderService.getOrdersByCustomer(customerEmail));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                Map.of("message", "Failed to fetch orders: " + e.getMessage())
            );
        }
    }
    
    // Update order status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        try {
            OrderStatus status = OrderStatus.valueOf(statusUpdate.get("status"));
            Order updatedOrder = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(updatedOrder);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                Map.of("message", "Invalid status: " + statusUpdate.get("status"))
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                Map.of("message", "Failed to update order status: " + e.getMessage())
            );
        }
    }
    
    // Cancel order
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id) {
        try {
            orderService.cancelOrder(id);
            return ResponseEntity.ok(Map.of("message", "Order cancelled successfully"));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(
                Map.of("message", e.getMessage())
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                Map.of("message", "Failed to cancel order: " + e.getMessage())
            );
        }
    }
    
    @PostMapping("/{orderId}/pay")
    public ResponseEntity<?> processPayment(
            @PathVariable Long orderId,
            @RequestBody PaymentRequest paymentRequest) {
        try {
            Payment payment = paymentService.processPayment(orderId, paymentRequest);
            return ResponseEntity.ok(payment);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(
                Map.of("message", e.getMessage())
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                Map.of("message", "Payment processing failed: " + e.getMessage())
            );
        }
    }
    
    @GetMapping("/{orderId}/payment")
    public ResponseEntity<?> getPaymentDetails(@PathVariable Long orderId) {
        try {
            Payment payment = paymentService.getPaymentByOrderId(orderId);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(
                Map.of("message", e.getMessage())
            );
        }
    }
}