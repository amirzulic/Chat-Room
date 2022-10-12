package com.example.demo.rest.response;

public class UserResponse {
    private int user_id;
    private String first_name;
    private String last_name;
    private String email;
    private String picture;

    public UserResponse(int user_id, String first_name, String last_name, String email, String picture) {
        this.user_id = user_id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.picture = picture;
    }

    public int getUser_id() {
        return user_id;
    }

    public String getFirst_name() {
        return first_name;
    }

    public String getLast_name() {
        return last_name;
    }

    public String getEmail() {
        return email;
    }

    public String getPicture() {
        return picture;
    }
}
