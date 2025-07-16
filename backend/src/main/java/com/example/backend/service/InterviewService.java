package com.example.backend.service;

import com.example.backend.dto.InterviewRequest;
import com.example.backend.entity.Interview;
import com.example.backend.repository.InterviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InterviewService {

    private final InterviewRepository interviewRepository;

    public InterviewService(InterviewRepository interviewRepository) {
        this.interviewRepository = interviewRepository;
    }

    public Interview createInterview(InterviewRequest request, String createdBy, List<String> questions) {
        Interview interview = new Interview(
                request.getJobTitle(),
                request.getDescription(),
                request.getDuration(),
                request.getInterviewType(),
                createdBy
        );

        interview.setQuestions(String.join("\n", questions));

        return interviewRepository.save(interview);
    }

    public Optional<Interview> getInterviewById(Long id) {
        return interviewRepository.findById(id);
    }
}