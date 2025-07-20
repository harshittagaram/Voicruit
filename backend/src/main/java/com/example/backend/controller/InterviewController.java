package com.example.backend.controller;

import com.example.backend.dto.InterviewRequest;
import com.example.backend.entity.Interview;
import com.example.backend.service.InterviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/interviews")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class InterviewController {

    private final InterviewService interviewService;
    private final AIQuestionController aiQuestionController;

    public InterviewController(InterviewService interviewService,
                               AIQuestionController aiQuestionController) {
        this.interviewService = interviewService;
        this.aiQuestionController = aiQuestionController;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Interview> getInterview(@PathVariable Long id) {
        return interviewService.getInterviewById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/my")
    public ResponseEntity<List<Interview>> getMyInterviews(@AuthenticationPrincipal OAuth2User user) {
        if (user == null) {
            return ResponseEntity.status(401).build(); // unauthorized
        }

        String email = user.getAttribute("email");
        List<Interview> interviews = interviewService.getInterviewsByEmail(email);
        return ResponseEntity.ok(interviews);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createInterview(
            @RequestBody InterviewRequest request,
            @AuthenticationPrincipal OAuth2User user) {

        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Authentication required"));
        }

        String email = user.getAttribute("email");

        // First, generate AI questions
        AIQuestionController.AIRequest aiRequest = new AIQuestionController.AIRequest();
        aiRequest.setJobPosition(request.getJobTitle());
        aiRequest.setJobDescription(request.getDescription());
        aiRequest.setDuration(request.getDuration());
        aiRequest.setInterviewType(request.getInterviewType());

        ResponseEntity<AIQuestionController.AIResponse> questionResponse = aiQuestionController.generateQuestions(aiRequest);

        if (!questionResponse.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(questionResponse.getStatusCode())
                    .body(Map.of("message", "Failed to generate questions"));
        }

        // Now save the interview with questions
        Interview interview = interviewService.createInterview(
                request,
                email,
                questionResponse.getBody().getQuestions()
        );

        String link = "https://voicruit.com/interview/" + interview.getId();

        Map<String, Object> interviewData = new HashMap<>();
        interviewData.put("id", interview.getId());
        interviewData.put("jobTitle", interview.getJobTitle());
        interviewData.put("description", interview.getDescription());
        interviewData.put("duration", interview.getDuration());
        interviewData.put("type", interview.getInterviewType());
        interviewData.put("link", link);
        interviewData.put("createdAt", interview.getCreatedAt()); // Added createdAt

        Map<String, Object> response = new HashMap<>();
        response.put("interviewData", interviewData);
        response.put("questions", questionResponse.getBody().getQuestions());

        return ResponseEntity.ok(response);
    }
}