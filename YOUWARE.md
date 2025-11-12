# Food Delivery Platform - React Frontend

A production-ready React + Vite frontend for a Spring Boot JWT-based backend food delivery platform.

## Project Overview

This is a complete, functional food delivery platform frontend built with React 18, TypeScript, Vite, and Tailwind CSS. The application integrates with a Spring Boot 3.2.0 backend using JWT authentication for secure user management and order processing.

## Project Status

- **Project Type**: Food Delivery Platform Frontend
- **Entry Point**: `src/main.tsx` (React application entry)
- **Build System**: Vite 7.0.0 (Fast development and build)
- **Styling System**: Tailwind CSS 3.4.17 (Atomic CSS framework)
- **Backend Integration**: Spring Boot 3.2.0 with JWT Authentication
- **State Management**: React Context API (UserContext, CartContext)

## Core Features Implemented

### Authentication System
- JWT-based authentication with token management
- Login and registration functionality
- Protected routes requiring authentication
- Automatic token injection in API requests
- User session persistence via localStorage

### Restaurant & Menu Management
- Restaurant listing with search functionality
- Individual restaurant menu browsing
- Menu item details with pricing and availability
- Visual restaurant cards with descriptions

### Shopping Cart
- Add/remove items from cart
- Quantity management (increase/decrease)
- Cart persistence in localStorage
- Real-time total calculation
- Empty cart state handling

### Order Management
- Place orders with delivery address
- Order confirmation and tracking
- Order details view with status
- Order history access
- Status indicators (Pending, Confirmed, Delivered, etc.)

## Technology Stack

### Core Dependencies
- **React**: 18.3.1 - UI library
- **TypeScript**: 5.8.3 - Type safety
- **Vite**: 7.0.0 - Build tool
- **React Router DOM**: 6.30.1 - Client-side routing
- **Axios**: 1.6.2 - HTTP client
- **Tailwind CSS**: 3.4.17 - Styling framework
- **react-hot-toast**: 2.4.1 - User notifications

### Additional Libraries
- **Lucide React**: Icon library
- **Framer Motion**: Animation library
- **GSAP**: Professional animations
- **Zustand**: State management option

## Project Architecture

### Directory Structure

```
src/
├── components/           # Reusable UI components
│   ├── Navbar.tsx       # Navigation with auth states
│   ├── ProtectedRoute.tsx  # Route protection HOC
│   ├── RestaurantCard.tsx  # Restaurant display card
│   └── MenuItemCard.tsx    # Menu item display card
├── pages/               # Main application pages
│   ├── AuthPage.tsx     # Login/Register page
│   ├── CustomerDashboard.tsx  # Restaurant listing
│   ├── Cart.tsx         # Shopping cart page
│   └── OrderDetails.tsx # Order detail view
├── context/            # React Context providers
│   ├── UserContext.tsx  # User authentication state
│   └── CartContext.tsx  # Shopping cart state
├── services/           # API integration
│   └── api.ts          # Axios instance & API calls
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared types
├── App.tsx             # Main app component with routing
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## API Integration

### Backend Configuration
Set the backend URL in `.env`:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

### API Endpoints Used

#### Authentication (v1)
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login (returns token + user)
- `GET /api/v1/users/me` - Get current user profile

#### Restaurants & Menus (v1)
- `GET /api/v1/restaurants` - List all restaurants
- `GET /api/v1/restaurants/{id}/menu` - Get restaurant menu

#### Orders (v1)
- `POST /api/v1/orders` - Place new order
- `GET /api/v1/orders/user` - Get user's orders
- `GET /api/v1/orders/{id}` - Get order details

### Authentication Flow
1. User logs in via AuthPage
2. Backend returns JWT token and user data
3. Token stored in localStorage
4. Axios interceptor adds token to all requests
5. Protected routes check for valid token
6. Logout clears token and redirects to login

## Context API State Management

### UserContext
Manages user authentication state:
- User data and JWT token
- Login/logout functionality
- User registration
- Loading states
- Token persistence

### CartContext
Manages shopping cart state:
- Cart items with quantities
- Add/remove/update items
- Calculate total price
- Clear cart functionality
- Cart persistence in localStorage

## Development Commands

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

## Component Guidelines

### Protected Routes
All authenticated pages are wrapped with `ProtectedRoute`:
```tsx
<ProtectedRoute>
  <CustomerDashboard />
</ProtectedRoute>
```

### Adding New Menu Items to Cart
The `addToCart` function from CartContext automatically:
- Adds new items with quantity 1
- Increments quantity if item already exists
- Shows toast notification
- Persists to localStorage

### Order Placement Flow
1. User adds items to cart
2. Navigates to Cart page
3. Enters delivery address
4. Clicks "Place Order"
5. Order sent to backend
6. Cart cleared on success
7. Redirected to OrderDetails page

## UI/UX Features

### Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Touch-friendly controls
- Adaptive navigation

### User Feedback
- Toast notifications for all actions
- Loading states for async operations
- Empty state handling
- Error message display

### Visual Design
- Clean, modern interface
- Orange color theme (#F97316)
- Smooth transitions and hover effects
- Consistent spacing and typography
- Icon-enhanced navigation

## Security Considerations

### Token Management
- JWT stored in localStorage
- Token automatically attached to requests
- No token expiration handling (implement if needed)
- Logout clears all auth data

### Protected Routes
- All sensitive routes require authentication
- Automatic redirect to login if not authenticated
- Loading state prevents flash of protected content

## Future Enhancement Recommendations

1. **Token Refresh**: Implement automatic token refresh before expiration
2. **Order History Page**: Dedicated page showing all user orders
3. **Real-time Updates**: WebSocket integration for order status updates
4. **Payment Integration**: Add payment gateway integration
5. **Restaurant Filtering**: Filter by cuisine, rating, delivery time
6. **User Profile**: Edit profile, change password, address management
7. **Order Tracking**: Real-time delivery tracking on map
8. **Reviews & Ratings**: Restaurant and food item reviews
9. **Favorites**: Save favorite restaurants and items
10. **Notifications**: Push notifications for order updates

## Common Development Tasks

### Adding a New Page
1. Create component in `src/pages/`
2. Add route in `App.tsx`
3. Wrap with `ProtectedRoute` if authentication required
4. Import and use contexts as needed

### Adding New API Endpoints
1. Add function in `src/services/api.ts`
2. Use existing axios instance (includes auth headers)
3. Handle errors with try-catch and toast notifications

### Modifying Cart Logic
Edit `src/context/CartContext.tsx` to:
- Change cart persistence strategy
- Add item validation
- Implement discount logic
- Add tax calculations

## Build and Deployment

### Production Build
The project builds successfully with:
- Optimized bundle size (~257 KB JS, ~16 KB CSS)
- Automatic code splitting
- Minified assets
- Source maps for debugging

### Build Output
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].css
│   └── index-[hash].js
```

## Important Notes

### Entry Point Protection
⚠️ **NEVER** modify the script tag in `index.html`:
```html
<script type="module" src="/src/main.tsx"></script>
```

### Context Providers
Both UserContext and CartContext wrap the entire app in `App.tsx`. All child components can access these contexts using `useContext`.

### TypeScript Types
All API responses should match the types defined in `src/types/index.ts`. Update types when backend API changes.

### Environment Variables
Always use `import.meta.env.VITE_*` prefix for environment variables in Vite projects.

## Support and Troubleshooting

### Build Errors
- Run `npm install` if dependencies are missing
- Check TypeScript types match actual API responses
- Verify `.env` file exists with correct API URL

### Authentication Issues
- Check backend is running and accessible
- Verify JWT token format in localStorage
- Check browser console for API errors
- Ensure CORS is configured on backend

### Cart Not Persisting
- Check localStorage in browser DevTools
- Verify CartContext is properly wrapped in App.tsx
- Check for localStorage quota errors

## API Error Handling

All API calls include error handling:
```typescript
try {
  const response = await apiFunction();
  // Handle success
} catch (error: any) {
  console.error("Error details:", error);
  toast.error(error.response?.data?.message || "Operation failed");
}
```

This ensures users always receive feedback and errors are logged for debugging.
