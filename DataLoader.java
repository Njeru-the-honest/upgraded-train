package com.example.fooddelivery.config;

import com.example.fooddelivery.model.*;
import com.example.fooddelivery.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Autowired
    public DataLoader(UserRepository userRepository,
                     CustomerRepository customerRepository,
                     RestaurantRepository restaurantRepository,
                     MenuItemRepository menuItemRepository,
                     PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.restaurantRepository = restaurantRepository;
        this.menuItemRepository = menuItemRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Override
    public void run(String... args) throws Exception {
        // Check if data already exists
        if (userRepository.count() > 0) {
            return;
        }
        
        // Create Admin User
        User admin = new User();
        admin.setName("Admin User");
        admin.setEmail("admin@example.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);
        
        // Create Customer Users
        Customer customer1 = new Customer();
        customer1.setName("John Doe");
        customer1.setEmail("john@example.com");
        customer1.setPassword(passwordEncoder.encode("password123"));
        customer1.setRole(Role.CUSTOMER);
        customer1.setAddress("123 Main St, Nairobi");
        customer1.setPhoneNumber("+254700000001");
        customerRepository.save(customer1);
        
        Customer customer2 = new Customer();
        customer2.setName("Jane Smith");
        customer2.setEmail("jane@example.com");
        customer2.setPassword(passwordEncoder.encode("password123"));
        customer2.setRole(Role.CUSTOMER);
        customer2.setAddress("456 Oak Ave, Nairobi");
        customer2.setPhoneNumber("+254700000002");
        customerRepository.save(customer2);
        
        Customer customer3 = new Customer();
        customer3.setName("Michael Johnson");
        customer3.setEmail("michael@example.com");
        customer3.setPassword(passwordEncoder.encode("password123"));
        customer3.setRole(Role.CUSTOMER);
        customer3.setAddress("789 Elm Street, Nairobi");
        customer3.setPhoneNumber("+254700000003");
        customerRepository.save(customer3);
        
        // ========== RESTAURANT 1: Pizza Palace ==========
        Restaurant restaurant1 = new Restaurant("Pizza Palace", "Downtown Nairobi", "+254701234567");
        restaurantRepository.save(restaurant1);
        
        MenuItem pizza1 = new MenuItem();
        pizza1.setName("Margherita Pizza");
        pizza1.setDescription("Classic tomato and mozzarella");
        pizza1.setPrice(12.99);
        pizza1.setDiscountPercentage(0.0);
        pizza1.setRestaurant(restaurant1);
        menuItemRepository.save(pizza1);
        
        MenuItem pizza2 = new MenuItem();
        pizza2.setName("Pepperoni Pizza");
        pizza2.setDescription("Spicy pepperoni with cheese");
        pizza2.setPrice(15.99);
        pizza2.setDiscountPercentage(10.0);
        pizza2.setRestaurant(restaurant1);
        menuItemRepository.save(pizza2);
        
        MenuItem pizza3 = new MenuItem();
        pizza3.setName("Veggie Supreme");
        pizza3.setDescription("Loaded with fresh vegetables");
        pizza3.setPrice(14.99);
        pizza3.setDiscountPercentage(0.0);
        pizza3.setRestaurant(restaurant1);
        menuItemRepository.save(pizza3);
        
        MenuItem pizza4 = new MenuItem();
        pizza4.setName("BBQ Chicken Pizza");
        pizza4.setDescription("Grilled chicken with BBQ sauce");
        pizza4.setPrice(16.99);
        pizza4.setDiscountPercentage(5.0);
        pizza4.setRestaurant(restaurant1);
        menuItemRepository.save(pizza4);
        
        MenuItem pizza5 = new MenuItem();
        pizza5.setName("Hawaiian Pizza");
        pizza5.setDescription("Ham and pineapple");
        pizza5.setPrice(13.99);
        pizza5.setDiscountPercentage(0.0);
        pizza5.setRestaurant(restaurant1);
        menuItemRepository.save(pizza5);
        
        // ========== RESTAURANT 2: Burger House ==========
        Restaurant restaurant2 = new Restaurant("Burger House", "Westlands, Nairobi", "+254702345678");
        restaurantRepository.save(restaurant2);
        
        MenuItem burger1 = new MenuItem();
        burger1.setName("Classic Burger");
        burger1.setDescription("Beef patty with lettuce and tomato");
        burger1.setPrice(8.99);
        burger1.setDiscountPercentage(0.0);
        burger1.setRestaurant(restaurant2);
        menuItemRepository.save(burger1);
        
        MenuItem burger2 = new MenuItem();
        burger2.setName("Cheese Burger");
        burger2.setDescription("Double cheese with bacon");
        burger2.setPrice(10.99);
        burger2.setDiscountPercentage(15.0);
        burger2.setRestaurant(restaurant2);
        menuItemRepository.save(burger2);
        
        MenuItem burger3 = new MenuItem();
        burger3.setName("Chicken Burger");
        burger3.setDescription("Grilled chicken with special sauce");
        burger3.setPrice(9.99);
        burger3.setDiscountPercentage(0.0);
        burger3.setRestaurant(restaurant2);
        menuItemRepository.save(burger3);
        
        MenuItem burger4 = new MenuItem();
        burger4.setName("Veggie Burger");
        burger4.setDescription("Plant-based patty with avocado");
        burger4.setPrice(11.99);
        burger4.setDiscountPercentage(10.0);
        burger4.setRestaurant(restaurant2);
        menuItemRepository.save(burger4);
        
        MenuItem burger5 = new MenuItem();
        burger5.setName("Mushroom Swiss Burger");
        burger5.setDescription("Sautéed mushrooms and Swiss cheese");
        burger5.setPrice(12.99);
        burger5.setDiscountPercentage(0.0);
        burger5.setRestaurant(restaurant2);
        menuItemRepository.save(burger5);
        
        // ========== RESTAURANT 3: Sushi World ==========
        Restaurant restaurant3 = new Restaurant("Sushi World", "Karen, Nairobi", "+254703456789");
        restaurantRepository.save(restaurant3);
        
        MenuItem sushi1 = new MenuItem();
        sushi1.setName("California Roll");
        sushi1.setDescription("Crab, avocado, and cucumber");
        sushi1.setPrice(11.99);
        sushi1.setDiscountPercentage(0.0);
        sushi1.setRestaurant(restaurant3);
        menuItemRepository.save(sushi1);
        
        MenuItem sushi2 = new MenuItem();
        sushi2.setName("Salmon Nigiri");
        sushi2.setDescription("Fresh salmon on rice");
        sushi2.setPrice(13.99);
        sushi2.setDiscountPercentage(20.0);
        sushi2.setRestaurant(restaurant3);
        menuItemRepository.save(sushi2);
        
        MenuItem sushi3 = new MenuItem();
        sushi3.setName("Tuna Sashimi");
        sushi3.setDescription("Premium tuna slices");
        sushi3.setPrice(16.99);
        sushi3.setDiscountPercentage(0.0);
        sushi3.setRestaurant(restaurant3);
        menuItemRepository.save(sushi3);
        
        MenuItem sushi4 = new MenuItem();
        sushi4.setName("Dragon Roll");
        sushi4.setDescription("Eel and avocado with special sauce");
        sushi4.setPrice(18.99);
        sushi4.setDiscountPercentage(15.0);
        sushi4.setRestaurant(restaurant3);
        menuItemRepository.save(sushi4);
        
        MenuItem sushi5 = new MenuItem();
        sushi5.setName("Spicy Tuna Roll");
        sushi5.setDescription("Spicy tuna with cucumber");
        sushi5.setPrice(14.99);
        sushi5.setDiscountPercentage(0.0);
        sushi5.setRestaurant(restaurant3);
        menuItemRepository.save(sushi5);
        
        // ========== RESTAURANT 4: Pasta Paradise ==========
        Restaurant restaurant4 = new Restaurant("Pasta Paradise", "Kilimani, Nairobi", "+254704567890");
        restaurantRepository.save(restaurant4);
        
        MenuItem pasta1 = new MenuItem();
        pasta1.setName("Spaghetti Carbonara");
        pasta1.setDescription("Creamy bacon and egg sauce");
        pasta1.setPrice(13.99);
        pasta1.setDiscountPercentage(0.0);
        pasta1.setRestaurant(restaurant4);
        menuItemRepository.save(pasta1);
        
        MenuItem pasta2 = new MenuItem();
        pasta2.setName("Fettuccine Alfredo");
        pasta2.setDescription("Rich cream and parmesan sauce");
        pasta2.setPrice(14.99);
        pasta2.setDiscountPercentage(10.0);
        pasta2.setRestaurant(restaurant4);
        menuItemRepository.save(pasta2);
        
        MenuItem pasta3 = new MenuItem();
        pasta3.setName("Penne Arrabbiata");
        pasta3.setDescription("Spicy tomato sauce");
        pasta3.setPrice(12.99);
        pasta3.setDiscountPercentage(0.0);
        pasta3.setRestaurant(restaurant4);
        menuItemRepository.save(pasta3);
        
        MenuItem pasta4 = new MenuItem();
        pasta4.setName("Lasagna");
        pasta4.setDescription("Layered pasta with meat sauce");
        pasta4.setPrice(15.99);
        pasta4.setDiscountPercentage(5.0);
        pasta4.setRestaurant(restaurant4);
        menuItemRepository.save(pasta4);
        
        MenuItem pasta5 = new MenuItem();
        pasta5.setName("Seafood Linguine");
        pasta5.setDescription("Mixed seafood in white wine sauce");
        pasta5.setPrice(18.99);
        pasta5.setDiscountPercentage(0.0);
        pasta5.setRestaurant(restaurant4);
        menuItemRepository.save(pasta5);
        
        // ========== RESTAURANT 5: Taco Fiesta ==========
        Restaurant restaurant5 = new Restaurant("Taco Fiesta", "Upperhill, Nairobi", "+254705678901");
        restaurantRepository.save(restaurant5);
        
        MenuItem taco1 = new MenuItem();
        taco1.setName("Beef Tacos");
        taco1.setDescription("Seasoned ground beef with toppings");
        taco1.setPrice(9.99);
        taco1.setDiscountPercentage(0.0);
        taco1.setRestaurant(restaurant5);
        menuItemRepository.save(taco1);
        
        MenuItem taco2 = new MenuItem();
        taco2.setName("Chicken Quesadilla");
        taco2.setDescription("Grilled chicken with melted cheese");
        taco2.setPrice(11.99);
        taco2.setDiscountPercentage(15.0);
        taco2.setRestaurant(restaurant5);
        menuItemRepository.save(taco2);
        
        MenuItem taco3 = new MenuItem();
        taco3.setName("Fish Tacos");
        taco3.setDescription("Crispy fish with cabbage slaw");
        taco3.setPrice(12.99);
        taco3.setDiscountPercentage(0.0);
        taco3.setRestaurant(restaurant5);
        menuItemRepository.save(taco3);
        
        MenuItem taco4 = new MenuItem();
        taco4.setName("Burrito Bowl");
        taco4.setDescription("Rice, beans, meat, and toppings");
        taco4.setPrice(13.99);
        taco4.setDiscountPercentage(10.0);
        taco4.setRestaurant(restaurant5);
        menuItemRepository.save(taco4);
        
        MenuItem taco5 = new MenuItem();
        taco5.setName("Nachos Supreme");
        taco5.setDescription("Loaded nachos with all toppings");
        taco5.setPrice(10.99);
        taco5.setDiscountPercentage(0.0);
        taco5.setRestaurant(restaurant5);
        menuItemRepository.save(taco5);
        
        // ========== RESTAURANT 6: Indian Spice ==========
        Restaurant restaurant6 = new Restaurant("Indian Spice", "Parklands, Nairobi", "+254706789012");
        restaurantRepository.save(restaurant6);
        
        MenuItem indian1 = new MenuItem();
        indian1.setName("Chicken Tikka Masala");
        indian1.setDescription("Creamy tomato curry with chicken");
        indian1.setPrice(14.99);
        indian1.setDiscountPercentage(0.0);
        indian1.setRestaurant(restaurant6);
        menuItemRepository.save(indian1);
        
        MenuItem indian2 = new MenuItem();
        indian2.setName("Butter Chicken");
        indian2.setDescription("Rich and creamy chicken curry");
        indian2.setPrice(15.99);
        indian2.setDiscountPercentage(20.0);
        indian2.setRestaurant(restaurant6);
        menuItemRepository.save(indian2);
        
        MenuItem indian3 = new MenuItem();
        indian3.setName("Vegetable Biryani");
        indian3.setDescription("Fragrant rice with mixed vegetables");
        indian3.setPrice(12.99);
        indian3.setDiscountPercentage(0.0);
        indian3.setRestaurant(restaurant6);
        menuItemRepository.save(indian3);
        
        MenuItem indian4 = new MenuItem();
        indian4.setName("Lamb Rogan Josh");
        indian4.setDescription("Spicy lamb curry");
        indian4.setPrice(17.99);
        indian4.setDiscountPercentage(10.0);
        indian4.setRestaurant(restaurant6);
        menuItemRepository.save(indian4);
        
        MenuItem indian5 = new MenuItem();
        indian5.setName("Paneer Tikka");
        indian5.setDescription("Grilled cottage cheese with spices");
        indian5.setPrice(13.99);
        indian5.setDiscountPercentage(0.0);
        indian5.setRestaurant(restaurant6);
        menuItemRepository.save(indian5);
        
        // ========== RESTAURANT 7: Thai Kitchen ==========
        Restaurant restaurant7 = new Restaurant("Thai Kitchen", "Lavington, Nairobi", "+254707890123");
        restaurantRepository.save(restaurant7);
        
        MenuItem thai1 = new MenuItem(); 
        thai1.setName("Pad Thai"); 
        thai1.setDescription("Stir-fried rice noodles with shrimp"); 
        thai1.setPrice(13.99); 
        thai1.setDiscountPercentage(0.0); 
        thai1.setRestaurant(restaurant7); 
        menuItemRepository.save(thai1);

            MenuItem thai2 = new MenuItem();
    thai2.setName("Green Curry");
    thai2.setDescription("Spicy coconut curry with chicken");
    thai2.setPrice(14.99);
    thai2.setDiscountPercentage(15.0);
    thai2.setRestaurant(restaurant7);
    menuItemRepository.save(thai2);
    
    MenuItem thai3 = new MenuItem();
    thai3.setName("Tom Yum Soup");
    thai3.setDescription("Hot and sour soup with prawns");
    thai3.setPrice(11.99);
    thai3.setDiscountPercentage(0.0);
    thai3.setRestaurant(restaurant7);
    menuItemRepository.save(thai3);
    
    MenuItem thai4 = new MenuItem();
    thai4.setName("Massaman Curry");
    thai4.setDescription("Rich peanut curry with beef");
    thai4.setPrice(16.99);
    thai4.setDiscountPercentage(10.0);
    thai4.setRestaurant(restaurant7);
    menuItemRepository.save(thai4);
    
    MenuItem thai5 = new MenuItem();
    thai5.setName("Spring Rolls");
    thai5.setDescription("Crispy vegetable spring rolls");
    thai5.setPrice(8.99);
    thai5.setDiscountPercentage(0.0);
    thai5.setRestaurant(restaurant7);
    menuItemRepository.save(thai5);
    
    // ========== RESTAURANT 8: BBQ Grill House ==========
    Restaurant restaurant8 = new Restaurant("BBQ Grill House", "Ngong Road, Nairobi", "+254708901234");
    restaurantRepository.save(restaurant8);
    
    MenuItem bbq1 = new MenuItem();
    bbq1.setName("Beef Ribs");
    bbq1.setDescription("Slow-cooked beef ribs with BBQ sauce");
    bbq1.setPrice(19.99);
    bbq1.setDiscountPercentage(0.0);
    bbq1.setRestaurant(restaurant8);
    menuItemRepository.save(bbq1);
    
    MenuItem bbq2 = new MenuItem();
    bbq2.setName("Pulled Pork Sandwich");
    bbq2.setDescription("Tender pulled pork with coleslaw");
    bbq2.setPrice(12.99);
    bbq2.setDiscountPercentage(20.0);
    bbq2.setRestaurant(restaurant8);
    menuItemRepository.save(bbq2);
    
    MenuItem bbq3 = new MenuItem();
    bbq3.setName("Grilled Chicken Wings");
    bbq3.setDescription("Spicy BBQ chicken wings");
    bbq3.setPrice(10.99);
    bbq3.setDiscountPercentage(0.0);
    bbq3.setRestaurant(restaurant8);
    menuItemRepository.save(bbq3);
    
    MenuItem bbq4 = new MenuItem();
    bbq4.setName("Smoked Brisket");
    bbq4.setDescription("Texas-style smoked brisket");
    bbq4.setPrice(21.99);
    bbq4.setDiscountPercentage(15.0);
    bbq4.setRestaurant(restaurant8);
    menuItemRepository.save(bbq4);
    
    MenuItem bbq5 = new MenuItem();
    bbq5.setName("Grilled Corn on the Cob");
    bbq5.setDescription("Buttered corn with spices");
    bbq5.setPrice(5.99);
    bbq5.setDiscountPercentage(0.0);
    bbq5.setRestaurant(restaurant8);
    menuItemRepository.save(bbq5);
    
    // ========== RESTAURANT 9: Mediterranean Delight ==========
    Restaurant restaurant9 = new Restaurant("Mediterranean Delight", "Gigiri, Nairobi", "+254709012345");
    restaurantRepository.save(restaurant9);
    
    MenuItem med1 = new MenuItem();
    med1.setName("Chicken Shawarma");
    med1.setDescription("Marinated chicken in pita bread");
    med1.setPrice(11.99);
    med1.setDiscountPercentage(0.0);
    med1.setRestaurant(restaurant9);
    menuItemRepository.save(med1);
    
    MenuItem med2 = new MenuItem();
    med2.setName("Falafel Wrap");
    med2.setDescription("Crispy chickpea balls with tahini");
    med2.setPrice(10.99);
    med2.setDiscountPercentage(10.0);
    med2.setRestaurant(restaurant9);
    menuItemRepository.save(med2);
    
    MenuItem med3 = new MenuItem();
    med3.setName("Greek Salad");
    med3.setDescription("Fresh vegetables with feta cheese");
    med3.setPrice(9.99);
    med3.setDiscountPercentage(0.0);
    med3.setRestaurant(restaurant9);
    menuItemRepository.save(med3);
    
    MenuItem med4 = new MenuItem();
    med4.setName("Lamb Kebab");
    med4.setDescription("Grilled lamb skewers with rice");
    med4.setPrice(16.99);
    med4.setDiscountPercentage(15.0);
    med4.setRestaurant(restaurant9);
    menuItemRepository.save(med4);
    
    MenuItem med5 = new MenuItem();
    med5.setName("Hummus Platter");
    med5.setDescription("Creamy hummus with pita bread");
    med5.setPrice(8.99);
    med5.setDiscountPercentage(0.0);
    med5.setRestaurant(restaurant9);
    menuItemRepository.save(med5);
    
    // ========== RESTAURANT 10: Chinese Dragon ==========
    Restaurant restaurant10 = new Restaurant("Chinese Dragon", "Hurlingham, Nairobi", "+254710123456");
    restaurantRepository.save(restaurant10);
    
    MenuItem chinese1 = new MenuItem();
    chinese1.setName("Sweet and Sour Chicken");
    chinese1.setDescription("Crispy chicken in tangy sauce");
    chinese1.setPrice(13.99);
    chinese1.setDiscountPercentage(0.0);
    chinese1.setRestaurant(restaurant10);
    menuItemRepository.save(chinese1);
    
    MenuItem chinese2 = new MenuItem();
    chinese2.setName("Kung Pao Chicken");
    chinese2.setDescription("Spicy chicken with peanuts");
    chinese2.setPrice(14.99);
    chinese2.setDiscountPercentage(20.0);
    chinese2.setRestaurant(restaurant10);
    menuItemRepository.save(chinese2);
    
    MenuItem chinese3 = new MenuItem();
    chinese3.setName("Beef Chow Mein");
    chinese3.setDescription("Stir-fried noodles with beef");
    chinese3.setPrice(12.99);
    chinese3.setDiscountPercentage(0.0);
    chinese3.setRestaurant(restaurant10);
    menuItemRepository.save(chinese3);
    
    MenuItem chinese4 = new MenuItem();
    chinese4.setName("Peking Duck");
    chinese4.setDescription("Crispy duck with pancakes");
    chinese4.setPrice(22.99);
    chinese4.setDiscountPercentage(10.0);
    chinese4.setRestaurant(restaurant10);
    menuItemRepository.save(chinese4);
    
    MenuItem chinese5 = new MenuItem();
    chinese5.setName("Fried Rice");
    chinese5.setDescription("Egg fried rice with vegetables");
    chinese5.setPrice(9.99);
    chinese5.setDiscountPercentage(0.0);
    chinese5.setRestaurant(restaurant10);
    menuItemRepository.save(chinese5);
    
    MenuItem chinese6 = new MenuItem();
    chinese6.setName("Spring Rolls");
    chinese6.setDescription("Crispy vegetable spring rolls");
    chinese6.setPrice(7.99);
    chinese6.setDiscountPercentage(0.0);
    chinese6.setRestaurant(restaurant10);
    menuItemRepository.save(chinese6);
    
    System.out.println("Sample data loaded successfully!");
    System.out.println("Total Restaurants: 10");
    System.out.println("Total Menu Items: 51");
    System.out.println("Total Customers: 3");
}
}


