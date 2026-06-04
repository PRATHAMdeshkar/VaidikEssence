package com.vaidikessence.backend.rag.dto;

public class Reference {

    private int chapter;
    private String topic;
    private String text;

    public Reference() {
    }

    public Reference(int chapter, String topic, String text) {
        this.chapter = chapter;
        this.topic = topic;
        this.text = text;
    }

    public int getChapter() {
        return chapter;
    }

    public void setChapter(int chapter) {
        this.chapter = chapter;
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
