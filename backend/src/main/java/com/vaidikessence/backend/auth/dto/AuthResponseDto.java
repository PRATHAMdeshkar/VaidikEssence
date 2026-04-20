package com.vaidikessence.backend.auth.dto;

public class AuthResponseDto {

    private String token;
    private String email;
    private String phone;
    private String name;

    public AuthResponseDto() {
    }

    public AuthResponseDto(String token, String email, String phone, String name) {
        this.token = token;
        this.email = email;
        this.phone = phone;
        this.name = name;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
