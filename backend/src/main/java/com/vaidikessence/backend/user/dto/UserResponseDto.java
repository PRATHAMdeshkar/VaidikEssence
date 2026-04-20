package com.vaidikessence.backend.user.dto;

public class UserResponseDto {

    private final String id;
    private final String name;
    private final String email;
    private final String phoneNumber;

    public UserResponseDto(String id, String name, String email, String phoneNumber) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }
}
