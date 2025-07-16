package com.example.backend.repository;

import com.example.backend.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
}