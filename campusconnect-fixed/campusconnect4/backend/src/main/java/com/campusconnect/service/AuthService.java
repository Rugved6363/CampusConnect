package com.campusconnect.service;

import com.campusconnect.dto.request.LoginRequest;
import com.campusconnect.dto.request.SignupRequest;
import com.campusconnect.dto.response.AuthResponse;
import com.campusconnect.entity.User;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.repository.UserRepository;
import com.campusconnect.security.JwtUtil;
import com.campusconnect.security.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;   // concrete class — no ambiguity

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered: " + request.getEmail());
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.STUDENT);

        User saved = userRepository.save(user);
        log.info("New user registered: {}", saved.getEmail());

        UserDetails userDetails = userDetailsService.loadUserByUsername(saved.getEmail());
        String token = jwtUtil.generateToken(userDetails, saved.getId(), saved.getRole().name());

        AuthResponse resp = new AuthResponse();
        resp.setToken(token);
        resp.setUserId(saved.getId());
        resp.setName(saved.getName());
        resp.setEmail(saved.getEmail());
        resp.setRole(saved.getRole().name());
        resp.setMessage("Account created successfully");
        return resp;
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails, user.getId(), user.getRole().name());

        log.info("User logged in: {}", user.getEmail());

        AuthResponse resp = new AuthResponse();
        resp.setToken(token);
        resp.setUserId(user.getId());
        resp.setName(user.getName());
        resp.setEmail(user.getEmail());
        resp.setRole(user.getRole().name());
        return resp;
    }
}
