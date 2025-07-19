package com.example.backend.controller;

import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")  // Base path is now /api/user
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")  // Optional, for frontend access
public class UserController {

    @GetMapping
    public Map<String, Object> getUser(OAuth2AuthenticationToken authentication) {
        OAuth2User oauthUser = authentication.getPrincipal();

        return Map.of(
                "name", oauthUser.getAttribute("name"),
                "email", oauthUser.getAttribute("email")
        );
    }
}
