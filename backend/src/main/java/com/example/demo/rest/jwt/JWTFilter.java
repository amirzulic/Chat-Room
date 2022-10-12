package com.example.demo.rest.jwt;

import com.example.demo.model.User;
import com.example.demo.rest.exception.InvalidTokenException;
import com.example.demo.rest.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;

@Component
public class JWTFilter extends OncePerRequestFilter {
    @Autowired
    private UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");

        String email = null;

        if(header != null) {
            email = JWTUtil.getEmail(header);
            if(email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                User user = userService.getByEmail(JWTUtil.getEmail(header));
                if(JWTUtil.validateToken(header, user)) {
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(user, user.getEmail(), Collections.<GrantedAuthority>emptyList());
                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                } else {
                    throw new InvalidTokenException("Token is not valid!");
                }
            }
        }
        filterChain.doFilter(request, response);
    }
}
