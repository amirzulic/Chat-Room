package com.example.demo.rest.response;

import io.swagger.annotations.ApiModelProperty;

public class LoginResponse {
    private String JWToken;

    public LoginResponse(String JWToken) {
        this.JWToken = JWToken;
    }

    public String getJWToken() {
        return JWToken;
    }
}
