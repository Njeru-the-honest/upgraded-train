package com.example.fooddelivery.service;

import com.example.fooddelivery.dto.PaymentRequest;
import com.example.fooddelivery.exception.ResourceNotFoundException;
import com.example.fooddelivery.model.Order;
import com.example.fooddelivery.model.Payment;
import com.example.fooddelivery.model.PaymentMethod;
import com.example.fooddelivery.model.PaymentStatus;
import com.example.fooddelivery.repository.OrderRepository;
import com.example.fooddelivery.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final MockPaymentService mockPaymentService;
    
    @Autowired
    public PaymentService(PaymentRepository paymentRepository, 
                         OrderRepository orderRepository,
                         MockPaymentService mockPaymentService) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.mockPaymentService = mockPaymentService;
    }
    
    @Transactional
    public Payment processPayment(Long orderId, PaymentRequest paymentRequest) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        
        // Check if payment already exists
        if (order.getPayment() != null) {
            throw new IllegalStateException("Payment already processed for this order");
        }
        
        // Calculate total amount from order items
        double totalAmount = order.getOrderItems().stream()
                .mapToDouble(item -> item.getUnitPrice() * item.getQuantity())
                .sum();
        
        // Process payment through mock service
        PaymentStatus paymentStatus = mockPaymentService.processPayment(
                paymentRequest.getPaymentMethod(), 
                totalAmount
        );
        
        // Create payment record
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(totalAmount);
        payment.setPaymentMethod(paymentRequest.getPaymentMethod());
        payment.setPaymentStatus(paymentStatus);
        payment.setPaymentDate(LocalDateTime.now());
        
        Payment savedPayment = paymentRepository.save(payment);
        
        // Update order with payment
        order.setPayment(savedPayment);
        orderRepository.save(order);
        
        return savedPayment;
    }
    
    @Transactional(readOnly = true)
    public Payment getPaymentByOrderId(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        
        if (order.getPayment() == null) {
            throw new ResourceNotFoundException("Payment not found for order id: " + orderId);
        }
        
        return order.getPayment();
    }
}