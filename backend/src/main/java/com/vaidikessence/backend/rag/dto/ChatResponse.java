package com.vaidikessence.backend.rag.dto;

import java.util.List;

public class ChatResponse {

    private String message;
    private List<Reference> references;

    public ChatResponse() {
    }

    public ChatResponse(String message, List<Reference> references) {
        this.message = message;
        this.references = references;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<Reference> getReferences() {
        return references;
    }

    public void setReferences(List<Reference> references) {
        this.references = references;
    }
}
