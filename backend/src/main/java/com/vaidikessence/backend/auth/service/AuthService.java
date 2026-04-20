package com.vaidikessence.backend.auth.service;

import com.vaidikessence.backend.auth.dto.AuthResponseDto;
import com.vaidikessence.backend.auth.dto.LoginRequestDto;
import com.vaidikessence.backend.auth.security.JwtUtil;
import com.vaidikessence.backend.user.entity.User;
import com.vaidikessence.backend.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponseDto login(LoginRequestDto request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponseDto(
                token,
                user.getEmail(),
                user.getPhoneNumber(),
                user.getName());
    }
}
