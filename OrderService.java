package com.example.fooddelivery.service;

import com.example.fooddelivery.dto.OrderRequest;
import com.example.fooddelivery.dto.OrderItemRequest;  // Add this import
import com.example.fooddelivery.exception.ResourceNotFoundException;
import com.example.fooddelivery.model.*;
import com.example.fooddelivery.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;
    private final OrderItemRepository orderItemRepository;
    
    @Autowired
    public OrderService(OrderRepository orderRepository,
                       CustomerRepository customerRepository,
                       RestaurantRepository restaurantRepository,
                       MenuItemRepository menuItemRepository,
                       OrderItemRepository orderItemRepository) {
        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
        this.restaurantRepository = restaurantRepository;
        this.menuItemRepository = menuItemRepository;
        this.orderItemRepository = orderItemRepository;
    }
    
    @Transactional
    public Order createOrder(OrderRequest orderRequest, String customerEmail) {
        System.out.println("=== CREATE ORDER START ===");
        System.out.println("Customer Email: " + customerEmail);
        System.out.println("Restaurant ID: " + orderRequest.getRestaurantId());
        System.out.println("Number of items: " + orderRequest.getItems().size());
        
        Customer customer = customerRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with email: " + customerEmail));
        
        System.out.println("Customer found: " + customer.getName());
        
        Restaurant restaurant = restaurantRepository.findById(orderRequest.getRestaurantId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + orderRequest.getRestaurantId()));
        
        System.out.println("Restaurant found: " + restaurant.getName());
        
        Order order = new Order();
        order.setCustomer(customer);
        order.setRestaurant(restaurant);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PLACED);
        order.setDeliveryAddress(customer.getAddress());
        
        Order savedOrder = orderRepository.save(order);
        System.out.println("Order saved with ID: " + savedOrder.getId());
        
        List<OrderItem> orderItems = new ArrayList<>();
        
        for (OrderItemRequest itemRequest : orderRequest.getItems()) {  // Changed from OrderRequest.OrderItemRequest
            System.out.println("--- Processing Item ---");
            System.out.println("Menu Item ID: " + itemRequest.getMenuItemId());
            System.out.println("Quantity from request: " + itemRequest.getQuantity());
            
            if (itemRequest.getQuantity() == null) {
                throw new IllegalArgumentException("Quantity cannot be null for menu item: " + itemRequest.getMenuItemId());
            }
            
            if (itemRequest.getQuantity() <= 0) {
                throw new IllegalArgumentException("Quantity must be positive for menu item: " + itemRequest.getMenuItemId());
            }
            
            MenuItem menuItem = menuItemRepository.findById(itemRequest.getMenuItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + itemRequest.getMenuItemId()));
            
            System.out.println("Menu Item found: " + menuItem.getName());
            System.out.println("Menu Item price: " + menuItem.getPrice());
            
            double unitPrice = menuItem.getPrice();
            if (menuItem.getDiscountPercentage() != null && menuItem.getDiscountPercentage() > 0) {
                unitPrice = unitPrice * (1 - menuItem.getDiscountPercentage() / 100);
                System.out.println("Discounted price: " + unitPrice);
            }
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setMenuItem(menuItem);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setUnitPrice(unitPrice);
            
            System.out.println("OrderItem created:");
            System.out.println("  - Quantity: " + orderItem.getQuantity());
            System.out.println("  - Unit Price: " + orderItem.getUnitPrice());
            
            orderItems.add(orderItem);
        }
        
        System.out.println("Total order items to save: " + orderItems.size());
        
        List<OrderItem> savedOrderItems = orderItemRepository.saveAll(orderItems);
        System.out.println("Order items saved: " + savedOrderItems.size());
        
        savedOrder.setOrderItems(savedOrderItems);
        
        System.out.println("=== CREATE ORDER END ===");
        return savedOrder;
    }
    
    @Transactional(readOnly = true)
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }
    
    @Transactional(readOnly = true)
    public List<Order> getOrdersByCustomer(String customerEmail) {
        Customer customer = customerRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with email: " + customerEmail));
        return orderRepository.findByCustomer(customer);
    }
    
    @Transactional(readOnly = true)
    public List<Order> getOrdersByRestaurant(Long restaurantId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + restaurantId));
        return orderRepository.findByRestaurant(restaurant);
    }
    
    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
    
    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = getOrderById(orderId);
        order.setStatus(status);
        return orderRepository.save(order);
    }
    
    @Transactional
    public void cancelOrder(Long orderId) {
        Order order = getOrderById(orderId);
        
        if (order.getStatus() == OrderStatus.EN_ROUTE || order.getStatus() == OrderStatus.DELIVERED) {
            throw new IllegalStateException("Cannot cancel order that is already en route or delivered");
        }
        
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }
}