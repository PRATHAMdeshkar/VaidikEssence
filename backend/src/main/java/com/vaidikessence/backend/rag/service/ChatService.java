package com.vaidikessence.backend.rag.service;

import com.vaidikessence.backend.rag.dto.ChatRequest;
import com.vaidikessence.backend.rag.dto.ChatResponse;
import com.vaidikessence.backend.rag.dto.RagResponse;
import com.vaidikessence.backend.rag.dto.RagSource;
import com.vaidikessence.backend.rag.dto.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Objects;

@Service
public class ChatService {

    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);
    private static final String FALLBACK_MESSAGE = "I couldn't fetch an answer right now. Please try again in a moment.";

    private final RestTemplate restTemplate;
    private final String ragApiUrl;

    public ChatService(
            RestTemplate restTemplate,
            @Value("${rag.api.url:http://127.0.0.1:8000/ask}") String ragApiUrl) {
        this.restTemplate = restTemplate;
        this.ragApiUrl = ragApiUrl;
    }

    public ChatResponse askQuestion(ChatRequest request) {
        String question = request != null && request.getQuestion() != null ? request.getQuestion().trim() : "";
        if (question.isEmpty()) {
            return new ChatResponse("Please enter a question.", List.of());
        }

        try {
            RagResponse ragResponse = restTemplate.postForObject(ragApiUrl, new ChatRequest(question), RagResponse.class);
            if (ragResponse == null) {
                logger.warn("RAG response was null");
                return new ChatResponse(FALLBACK_MESSAGE, List.of());
            }

            String answer = ragResponse.getAnswer();
            List<Reference> references = mapReferences(ragResponse.getSources());
            
            if (answer == null || answer.trim().isEmpty()) {
                // If no proper answer but has references, return empty message with references
                // If no references, return fallback message
                String responseMessage = references.isEmpty() ? FALLBACK_MESSAGE : "";
                return new ChatResponse(responseMessage, references);
            }

            return new ChatResponse(answer, references);
        } catch (RestClientException ex) {
            logger.error("Failed to call RAG service", ex);
            return new ChatResponse(FALLBACK_MESSAGE, List.of());
        }
    }

    private List<Reference> mapReferences(List<RagSource> sources) {
        if (sources == null || sources.isEmpty()) {
            return List.of();
        }

        return sources.stream()
                .filter(Objects::nonNull)
                .filter(source -> source.getChapterNumber() != null && source.getChapterNumber() != 0)
                .map(source -> new Reference(
                        source.getChapterNumber() != null ? source.getChapterNumber() : 0,
                        source.getTopic() != null ? source.getTopic() : "",
                        source.getText() != null ? source.getText() : ""))
                .toList();
    }}

