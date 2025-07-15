package com.example.backend.controller;

import com.example.backend.dto.InterviewRequest;
import com.example.backend.service.InterviewService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interviews")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @PostMapping
    public String createInterview(@RequestBody InterviewRequest request, @AuthenticationPrincipal OAuth2User user) {
        String email = user.getAttribute("email");
        interviewService.createInterview(request, email);
        return "Interview created successfully";
    }
}
