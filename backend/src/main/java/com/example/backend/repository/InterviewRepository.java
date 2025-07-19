package com.example.backend.repository;

import com.example.backend.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByCreatedBy(String createdBy); // createdBy is your username field

}