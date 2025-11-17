package com.example.fooddelivery.service;

import com.example.fooddelivery.model.PaymentMethod;
import com.example.fooddelivery.model.PaymentStatus;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class MockPaymentService {
    
    private final Random random = new Random();
    
    public PaymentStatus processPayment(PaymentMethod paymentMethod, Double amount) {
        // Simulate payment processing delay
        try {
            Thread.sleep(1000); // 1 second delay
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Cash on Delivery always returns PENDING
        if (paymentMethod == PaymentMethod.COD) {
            return PaymentStatus.PENDING;
        }
        
        // For MPESA and CARD, simulate 80% success rate
        int randomValue = random.nextInt(100);
        if (randomValue < 80) {
            return PaymentStatus.SUCCESS;
        } else {
            return PaymentStatus.FAILED;
        }
    }
}