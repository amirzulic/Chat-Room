package com.example.demo.rest.response;

public class UpdateResponse {
    private int user_id;
    private String email;

    public UpdateResponse(int user_id, String email) {
        this.user_id = user_id;
        this.email = email;
    }

    public int getUser_Id() {
        return user_id;
    }

    public String getEmail() {
        return email;
    }
}
