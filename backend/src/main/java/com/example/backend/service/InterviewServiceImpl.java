package com.example.backend.service;

import com.example.backend.dto.InterviewRequest;
import com.example.backend.entity.Interview;
import com.example.backend.repository.InterviewRepository;
import org.springframework.stereotype.Service;

@Service
public class InterviewServiceImpl implements InterviewService {

    private final InterviewRepository interviewRepository;

    public InterviewServiceImpl(InterviewRepository interviewRepository) {
        this.interviewRepository = interviewRepository;
    }

    @Override
    public void createInterview(InterviewRequest request, String createdBy) {
        Interview interview = new Interview(
                request.getJobTitle(),
                request.getDescription(),
                request.getDuration(),
                request.getInterviewType(),
                createdBy
        );
        interviewRepository.save(interview);
    }
}
