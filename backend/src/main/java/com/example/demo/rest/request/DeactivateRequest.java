package com.example.demo.rest.request;

public class DeactivateRequest {
    private int user_id;

    public DeactivateRequest(int user_id) {
        this.user_id = user_id;
    }

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }
}
