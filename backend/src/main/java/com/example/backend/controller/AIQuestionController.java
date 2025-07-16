package com.example.backend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AIQuestionController {

    private static final Logger logger = LoggerFactory.getLogger(AIQuestionController.class);

    @Value("${openrouter.api.key}")
    private String openrouterApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/generate-questions")
    public ResponseEntity<AIResponse> generateQuestions(@RequestBody AIRequest request) {
        try {
            if (request.getJobPosition() == null || request.getJobDescription() == null ||
                    request.getDuration() == null || request.getInterviewType() == null) {
                logger.error("Invalid request data: {}", request);
                return ResponseEntity.badRequest().body(new AIResponse(List.of("Invalid input data")));
            }

            logger.info("Generating questions for jobPosition: {}", request.getJobPosition());
            String url = "https://openrouter.ai/api/v1/chat/completions";
            String prompt = String.format(
                    "Generate interview questions for a %s role with the following description: \"%s\". The interview type is %s, and the duration is %s. Provide 3-5 relevant questions.",
                    request.getJobPosition(), request.getJobDescription(), request.getInterviewType(), request.getDuration()
            );

            String requestBody = String.format(
                    "{\"model\": \"mistralai/mistral-7b-instruct\", \"messages\": [{\"role\": \"user\", \"content\": \"%s\"}]}",
                    prompt.replace("\"", "\\\"")
            );



            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + openrouterApiKey);
            headers.set("Content-Type", "application/json");

            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                String responseBody = response.getBody();
                logger.debug("OpenRouter response: {}", responseBody);
                JsonNode jsonNode = objectMapper.readTree(responseBody);
                String content = jsonNode.path("choices").get(0).path("message").path("content").asText();
                List<String> questions = Arrays.asList(content.split("\n"))
                        .stream()
                        .filter(line -> line.trim().length() > 0)
                        .map(line -> line.replaceAll("^\\d+\\.\\s*", "").trim())
                        .filter(question -> !question.isEmpty())
                        .collect(Collectors.toList());

                return ResponseEntity.ok(new AIResponse(questions.size() > 0 ? questions : List.of("No questions generated.")));
            } else {
                logger.error("OpenRouter API error: Status {}, Body: {}", response.getStatusCode(), response.getBody());
                return ResponseEntity.status(response.getStatusCode()).body(new AIResponse(List.of("Failed to generate questions: " + response.getBody())));
            }
        } catch (
    HttpClientErrorException e) {
        logger.error("HTTP Client Error: {}", e.getResponseBodyAsString());
        return ResponseEntity.status(e.getStatusCode())
                .body(new AIResponse(List.of("HTTP error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString())));
    } catch (Exception e) {
        logger.error("Exception in generateQuestions: ", e);
        return ResponseEntity.status(500)
                .body(new AIResponse(List.of("Error generating questions: " + e.getMessage())));
    }

}

    public static class AIRequest {
        private String jobPosition;
        private String jobDescription;
        private String duration;
        private String interviewType;

        public String getJobPosition() { return jobPosition; }
        public void setJobPosition(String jobPosition) { this.jobPosition = jobPosition; }
        public String getJobDescription() { return jobDescription; }
        public void setJobDescription(String jobDescription) { this.jobDescription = jobDescription; }
        public String getDuration() { return duration; }
        public void setDuration(String duration) { this.duration = duration; }
        public String getInterviewType() { return interviewType; }
        public void setInterviewType(String interviewType) { this.interviewType = interviewType; }
    }

    public static class AIResponse {
        private List<String> questions;

        public AIResponse(List<String> questions) {
            this.questions = questions;
        }

        public List<String> getQuestions() { return questions; }
    }
}