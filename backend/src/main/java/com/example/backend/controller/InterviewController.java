package com.example.backend.controller;

import com.example.backend.dto.InterviewRequest;
import com.example.backend.service.InterviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/interviews")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class InterviewController {

    private final InterviewService interviewService;
    private final AIQuestionController aiQuestionController;

    public InterviewController(InterviewService interviewService, AIQuestionController aiQuestionController) {
        this.interviewService = interviewService;
        this.aiQuestionController = aiQuestionController;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createInterview(@RequestBody InterviewRequest request, @AuthenticationPrincipal OAuth2User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Authentication required"));
        }

        String email = user.getAttribute("email");
        interviewService.createInterview(request, email);

        // Generate a sample link (replace with your logic)
        String link = "https://voicruit.com/interview/" + email + "_" + System.currentTimeMillis();

        // Prepare interviewData
        Map<String, Object> interviewData = new HashMap<>();
        interviewData.put("jobTitle", request.getJobTitle());
        interviewData.put("description", request.getDescription());
        interviewData.put("duration", request.getDuration());
        interviewData.put("type", request.getInterviewType());
        interviewData.put("link", link);

        // Call AI question generation directly
        AIQuestionController.AIRequest aiRequest = new AIQuestionController.AIRequest();
        aiRequest.setJobPosition(request.getJobTitle());
        aiRequest.setJobDescription(request.getDescription());
        aiRequest.setDuration(request.getDuration());
        aiRequest.setInterviewType(request.getInterviewType());

        ResponseEntity<AIQuestionController.AIResponse> questionResponse = aiQuestionController.generateQuestions(aiRequest);
        if (questionResponse.getStatusCode().is2xxSuccessful()) {
            Map<String, Object> response = new HashMap<>();
            response.put("interviewData", interviewData);
            response.put("questions", questionResponse.getBody().getQuestions());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(questionResponse.getStatusCode()).body(Map.of("message", "Failed to generate questions"));
        }
    }
}