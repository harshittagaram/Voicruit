package com.example.backend.controller;

import com.example.backend.repository.InterviewRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.example.backend.entity.Interview;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AIFeedbackController {

    private static final Logger logger = LoggerFactory.getLogger(AIFeedbackController.class);

    private final InterviewRepository interviewRepository;

    public AIFeedbackController(InterviewRepository interviewRepository) {
        this.interviewRepository = interviewRepository;
    }

    @Value("${openrouter.api.key}")
    private String openrouterApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/interviews/{id}/feedback")
    public ResponseEntity<FeedbackResponse> generateFeedback(@PathVariable String id, @RequestBody FeedbackRequest request) {
        try {
            if (request.getConversation() == null || (request.getConversation() instanceof List && ((List<?>) request.getConversation()).isEmpty())) {
                logger.error("Invalid request data: No conversation provided for interview ID {}", id);
                return ResponseEntity.badRequest().body(new FeedbackResponse("No conversation data provided"));
            }

            logger.info("Generating feedback for interview ID: {}", id);
            String url = "https://openrouter.ai/api/v1/chat/completions";
            String prompt = "Depends on this Interview Conversation between assistant and user,\n" +
                    "{{conversation}}\n" +
                    "Give me feedback for user interview. Give me rating out of 10 for technical Skills, " +
                    "Communication, Problem Solving, Experience. Also give me summary in 3 lines about the interview " +
                    "and one line to let me know whether is recommended for hire or not with msg. Give me response in JSON format:\n" +
                    "{\n" +
                    "  \"feedback\": {\n" +
                    "    \"ratings\": {\n" +
                    "      \"technicalSkills\": 5,\n" +
                    "      \"communication\": 6,\n" +
                    "      \"problemSolving\": 4,\n" +
                    "      \"experience\": 7\n" +
                    "    },\n" +
                    "    \"summary\": [\n" +
                    "      \"<line 1>\",\n" +
                    "      \"<line 2>\",\n" +
                    "      \"<line 3>\"\n" +
                    "    ],\n" +
                    "    \"recommendation\": \"Yes/No\",\n" +
                    "    \"recommendationMsg\": \"<message>\"\n" +
                    "  }\n" +
                    "}";

            String conversationJson;
            if (request.getConversation() instanceof List) {
                conversationJson = objectMapper.writeValueAsString(request.getConversation());
            } else if (request.getConversation() instanceof String) {
                conversationJson = (String) request.getConversation();
            } else {
                conversationJson = objectMapper.writeValueAsString(request.getConversation());
            }
            String formattedPrompt = prompt.replace("{{conversation}}", conversationJson);

            Map<String, Object> message = Map.of(
                    "role", "user",
                    "content", formattedPrompt
            );
            Map<String, Object> requestMap = Map.of(
                    "model", "mistralai/mistral-7b-instruct",
                    "messages", List.of(message)
            );

            String requestBody = objectMapper.writeValueAsString(requestMap);

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

                Interview interview = interviewRepository.findById(Long.parseLong(id))
                        .orElseThrow(() -> new RuntimeException("Interview not found"));
                JsonNode feedbackNode = objectMapper.readTree(content);
                JsonNode innerFeedback = feedbackNode.path("feedback"); // Extract inner feedback
                interview.setFeedback(objectMapper.writeValueAsString(innerFeedback)); // Save inner feedback object
                interviewRepository.save(interview);

                FeedbackResponse feedbackResponse = new FeedbackResponse();
                List<String> summaryList = new ArrayList<>();
                JsonNode summaryNode = innerFeedback.path("summary");
                if (summaryNode.isArray()) {
                    Iterator<JsonNode> elements = summaryNode.elements();
                    while (elements.hasNext()) {
                        summaryList.add(elements.next().asText(""));
                    }
                }
                while (summaryList.size() < 3) {
                    summaryList.add("");
                }
                feedbackResponse.setFeedback(new Feedback(
                        innerFeedback.path("ratings").path("technicalSkills").asInt(0),
                        innerFeedback.path("ratings").path("communication").asInt(0),
                        innerFeedback.path("ratings").path("problemSolving").asInt(0),
                        innerFeedback.path("ratings").path("experience").asInt(0),
                        summaryList.subList(0, 3),
                        innerFeedback.path("recommendation").asText("N/A"),
                        innerFeedback.path("recommendationMsg").asText("No recommendation available")
                ));

                return ResponseEntity.ok(feedbackResponse);
            } else {
                logger.error("OpenRouter API error: Status {}, Body: {}", response.getStatusCode(), response.getBody());
                return ResponseEntity.status(response.getStatusCode()).body(new FeedbackResponse("Failed to generate feedback: " + response.getBody()));
            }
        } catch (HttpClientErrorException e) {
            logger.error("HTTP Client Error: {}", e.getResponseBodyAsString());
            return ResponseEntity.status(e.getStatusCode())
                    .body(new FeedbackResponse("HTTP error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString()));
        } catch (Exception e) {
            logger.error("Exception in generateFeedback: ", e);
            return ResponseEntity.status(500)
                    .body(new FeedbackResponse("Error generating feedback: " + e.getMessage()));
        }
    }

    public static class FeedbackRequest {
        private String interviewId;
        private String userName;
        private String duration;
        private Object conversation;

        public String getInterviewId() { return interviewId; }
        public void setInterviewId(String interviewId) { this.interviewId = interviewId; }
        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }
        public String getDuration() { return duration; }
        public void setDuration(String duration) { this.duration = duration; }
        public Object getConversation() { return conversation; }
        public void setConversation(Object conversation) { this.conversation = conversation; }
    }

    public static class FeedbackResponse {
        private String error;
        private Feedback feedback;

        public FeedbackResponse() {}
        public FeedbackResponse(String error) { this.error = error; }

        public String getError() { return error; }
        public void setError(String error) { this.error = error; }
        public Feedback getFeedback() { return feedback; }
        public void setFeedback(Feedback feedback) { this.feedback = feedback; }
    }

    public static class Feedback {
        private int technicalSkills;
        private int communication;
        private int problemSolving;
        private int experience;
        private String[] summary;
        private String recommendation;
        private String recommendationMsg;

        public Feedback(int technicalSkills, int communication, int problemSolving, int experience,
                        List<String> summary, String recommendation, String recommendationMsg) {
            this.technicalSkills = technicalSkills;
            this.communication = communication;
            this.problemSolving = problemSolving;
            this.experience = experience;
            this.summary = summary.toArray(new String[0]);
            this.recommendation = recommendation;
            this.recommendationMsg = recommendationMsg;
        }

        public int getTechnicalSkills() { return technicalSkills; }
        public int getCommunication() { return communication; }
        public int getProblemSolving() { return problemSolving; }
        public int getExperience() { return experience; }
        public String[] getSummary() { return summary; }
        public String getRecommendation() { return recommendation; }
        public String getRecommendationMsg() { return recommendationMsg; }
    }
}