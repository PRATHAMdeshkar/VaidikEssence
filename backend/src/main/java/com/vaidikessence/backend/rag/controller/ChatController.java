package com.vaidikessence.backend.rag.controller;

import com.vaidikessence.backend.rag.dto.ChatRequest;
import com.vaidikessence.backend.rag.dto.ChatResponse;
import com.vaidikessence.backend.rag.service.ChatService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/ask")
    public ChatResponse ask(@RequestBody ChatRequest request) {
        return chatService.askQuestion(request);
    }
}
