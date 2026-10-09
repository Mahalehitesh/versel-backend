package com.school.classroom.service;

import com.school.classroom.dto.AuthResponse;
import com.school.classroom.dto.LoginRequest;
import com.school.classroom.dto.RefreshRequest;
import com.school.classroom.dto.UserDto;
import com.school.classroom.entity.User;
import com.school.classroom.exception.BadRequestException;
import com.school.classroom.exception.ResourceNotFoundException;
import com.school.classroom.repository.UserRepository;
import com.school.classroom.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.username(), loginRequest.password())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(loginRequest.username());

        User user = userRepository.findByUsername(loginRequest.username())
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + loginRequest.username()));

        return new AuthResponse(
            jwt,
            refreshToken,
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getFullName(),
            user.getRole().name()
        );
    }

    public AuthResponse refreshToken(RefreshRequest refreshRequest) {
        String refreshToken = refreshRequest.refreshToken();

        if (!tokenProvider.validateJwtToken(refreshToken)) {
            throw new BadRequestException("Invalid or expired refresh token");
        }

        String username = tokenProvider.getUsernameFromJwtToken(refreshToken);
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String newJwt = tokenProvider.generateTokenFromUsername(username, 86400000);
        String newRefreshToken = tokenProvider.generateRefreshToken(username);

        return new AuthResponse(
            newJwt,
            newRefreshToken,
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getFullName(),
            user.getRole().name()
        );
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        return new UserDto(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getFullName(),
            user.getRole().name()
        );
    }
}
