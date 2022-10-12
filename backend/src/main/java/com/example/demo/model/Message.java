package com.example.demo.model;

public class Message {
    private String sender_name;
    private String receiver_name;
    private String message;
    private String date;
    private Status status;

    public Message(String sender_name, String receiver_name, String message, String date, Status status) {
        this.sender_name = sender_name;
        this.receiver_name = receiver_name;
        this.message = message;
        this.date = date;
        this.status = status;
    }

    public Message() {
    }

    public String getSender_name() {
        return sender_name;
    }

    public void setSender_name(String sender_name) {
        this.sender_name = sender_name;
    }

    public String getReceiver_name() {
        return receiver_name;
    }

    public void setReceiver_name(String receiver_name) {
        this.receiver_name = receiver_name;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}
