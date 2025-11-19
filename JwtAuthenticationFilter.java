package com.example.fooddelivery.security;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;
    
    @Autowired
    public JwtAuthenticationFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        // Get request path and method
        String requestPath = request.getRequestURI();
        String requestMethod = request.getMethod();
        
        // Skip JWT validation for public endpoints
        if (isPublicEndpoint(requestPath, requestMethod)) {
            filterChain.doFilter(request, response);
            return;
        }
        
        final String authorizationHeader = request.getHeader("Authorization");
        
        String username = null;
        String jwt = null;
        
        // Check if Authorization header exists
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwt);
            } catch (ExpiredJwtException e) {
                logger.error("JWT Token expired: " + e.getMessage());
                // Don't throw exception - let the request continue without authentication
            } catch (Exception e) {
                logger.error("JWT Token extraction failed: " + e.getMessage());
            }
        }
        
        // Validate token and set authentication if valid
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                
                if (jwtUtil.validateToken(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authenticationToken = 
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }
            } catch (Exception e) {
                logger.error("Authentication failed: " + e.getMessage());
            }
        }
        
        filterChain.doFilter(request, response);
    }
    
    /**
     * Check if the endpoint is public and doesn't require authentication
     */
    private boolean isPublicEndpoint(String path, String method) {
        // Auth endpoints (registration, login)
        if (path.startsWith("/api/auth/") || path.startsWith("/api/v1/auth/")) {
            return true;
        }

        // Restaurant endpoints (browsing, viewing menus)
        if (path.startsWith("/api/v1/restaurants/")) {
            return true;
        }

        // Feedback GET endpoints (viewing reviews and ratings)
        if (path.startsWith("/api/v1/feedback/restaurant/") && "GET".equalsIgnoreCase(method)) {
            return true;
        }

        // H2 Console (development only)
        if (path.startsWith("/h2-console/")) {
            return true;
        }

        // Not a public endpoint
        return false;
    }
}