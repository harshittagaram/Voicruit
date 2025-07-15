package com.example.backend.service;

import com.example.backend.dto.InterviewRequest;

public interface InterviewService {
    void createInterview(InterviewRequest request, String createdBy);
}
