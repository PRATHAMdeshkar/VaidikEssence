package com.vaidikessence.backend.rag.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RagSource {

    @JsonProperty("chapter_number")
    private Integer chapterNumber;

    @JsonProperty("chapter_title")
    private String chapterTitle;

    private String topic;
    private String text;

    public RagSource() {
    }

    public Integer getChapterNumber() {
        return chapterNumber;
    }

    public void setChapterNumber(Integer chapterNumber) {
        this.chapterNumber = chapterNumber;
    }

    public String getChapterTitle() {
        return chapterTitle;
    }

    public void setChapterTitle(String chapterTitle) {
        this.chapterTitle = chapterTitle;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
