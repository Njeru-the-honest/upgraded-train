# Backend Endpoint Configuration Checklist

## Frontend Configuration Summary

**Base URL:** `http://localhost:8080/api` (configured in `.env`)

**All API calls are made through Axios with:**
- Automatic JWT token injection via `Authorization: Bearer <token>` header
- Content-Type: application/json

---

## Required Backend Endpoints

### 1. Authentication Endpoints

#### POST /api/v1/auth/register
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response:** 201 Created
```json
{
  "message": "User registered successfully"
}
```

---

#### POST /api/v1/auth/login
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response:** 200 OK
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "CUSTOMER"
  }
}
```

⚠️ **CRITICAL**: Both `token` and `user` fields are required!

---

#### GET /api/v1/users/me
**Headers Required:**
```
Authorization: Bearer <jwt-token>
```

**Expected Response:** 200 OK
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "CUSTOMER"
}
```

---

### 2. Restaurant Endpoints

#### GET /api/v1/restaurants
**Expected Response:** 200 OK
```json
[
  {
    "id": 1,
    "name": "Pizza Palace",
    "description": "Best pizzas in town",
    "address": "123 Main St",
    "imageUrl": "https://example.com/pizza.jpg"
  },
  {
    "id": 2,
    "name": "Burger House",
    "description": "Gourmet burgers",
    "address": "456 Oak Ave",
    "imageUrl": "https://example.com/burger.jpg"
  }
]
```

---

#### GET /api/v1/restaurants/{id}/menu
**Path Parameter:** Restaurant ID (integer)

**Expected Response:** 200 OK
```json
[
  {
    "id": 1,
    "name": "Margherita Pizza",
    "description": "Classic tomato and mozzarella",
    "price": 12.99,
    "restaurantId": 1,
    "imageUrl": "https://example.com/margherita.jpg",
    "available": true
  },
  {
    "id": 2,
    "name": "Pepperoni Pizza",
    "description": "With extra pepperoni",
    "price": 14.99,
    "restaurantId": 1,
    "imageUrl": "https://example.com/pepperoni.jpg",
    "available": true
  }
]
```

---

### 3. Order Endpoints

#### POST /api/v1/orders
**Headers Required:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "restaurantId": 1,
  "deliveryAddress": "789 Elm Street, Apt 4B",
  "items": [
    {
      "menuItemId": 1,
      "quantity": 2,
      "price": 12.99
    },
    {
      "menuItemId": 2,
      "quantity": 1,
      "price": 14.99
    }
  ]
}
```

**Expected Response:** 201 Created
```json
{
  "id": 101,
  "userId": 1,
  "restaurantId": 1,
  "items": [
    {
      "menuItemId": 1,
      "quantity": 2,
      "price": 12.99
    }
  ],
  "totalAmount": 40.97,
  "status": "PENDING",
  "createdAt": "2025-11-11T19:28:38Z",
  "deliveryAddress": "789 Elm Street, Apt 4B"
}
```

---

#### GET /api/v1/orders/user
**Headers Required:**
```
Authorization: Bearer <jwt-token>
```

**Expected Response:** 200 OK
```json
[
  {
    "id": 101,
    "userId": 1,
    "restaurantId": 1,
    "totalAmount": 40.97,
    "status": "PENDING",
    "createdAt": "2025-11-11T19:28:38Z"
  },
  {
    "id": 100,
    "userId": 1,
    "restaurantId": 2,
    "totalAmount": 25.50,
    "status": "DELIVERED",
    "createdAt": "2025-11-10T15:20:10Z"
  }
]
```

---

#### GET /api/v1/orders/{id}
**Path Parameter:** Order ID (integer)

**Headers Required:**
```
Authorization: Bearer <jwt-token>
```

**Expected Response:** 200 OK
```json
{
  "id": 101,
  "userId": 1,
  "restaurantId": 1,
  "items": [
    {
      "menuItemId": 1,
      "quantity": 2,
      "price": 12.99,
      "menuItem": {
        "id": 1,
        "name": "Margherita Pizza",
        "description": "Classic tomato and mozzarella"
      }
    }
  ],
  "totalAmount": 40.97,
  "status": "PENDING",
  "createdAt": "2025-11-11T19:28:38Z",
  "deliveryAddress": "789 Elm Street, Apt 4B"
}
```

---

## CORS Configuration Required

Your Spring Boot backend must allow:

**Allowed Origins:**
- `http://localhost:5173`
- `http://127.0.0.1:5173`

**Allowed Methods:**
- GET, POST, PUT, DELETE, OPTIONS

**Allowed Headers:**
- Authorization, Content-Type, Accept

**Allow Credentials:** true

### Spring Boot CORS Example:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins("http://localhost:5173", "http://127.0.0.1:5173")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("Authorization", "Content-Type", "Accept")
                    .allowCredentials(true);
            }
        };
    }
}
```

---

## Testing Endpoints

Use curl to test each endpoint:

```bash
# Test if server is running
curl http://localhost:8080/api/v1/restaurants

# Test registration
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test authenticated endpoint (replace TOKEN with actual token from login)
curl http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer TOKEN"
```

---

## Common Issues

### 404 Not Found
- Backend server is not running
- Endpoint path doesn't match exactly
- Missing `/api` prefix in Spring Boot controller

### CORS Error
- CORS configuration missing or incorrect
- Allowed origins don't match frontend URL
- Missing preflight OPTIONS handling

### 401 Unauthorized
- JWT token not being sent
- JWT token validation failing on backend
- Token format incorrect (should be `Bearer <token>`)

### Token Format Issues
- Login response must include both `token` and `user` fields
- Frontend expects exact field names

---

## Next Steps

1. ✅ Verify backend is running: `curl http://localhost:8080/api/v1/restaurants`
2. ✅ Check each endpoint exists with correct path
3. ✅ Verify CORS configuration
4. ✅ Test login response format matches expected structure
5. ✅ Confirm JWT validation works for protected routes
