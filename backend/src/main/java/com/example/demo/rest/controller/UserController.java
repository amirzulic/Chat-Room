package com.example.demo.rest.controller;

import com.example.demo.model.User;
import com.example.demo.rest.jwt.JWTUtil;
import com.example.demo.rest.request.*;
import com.example.demo.rest.response.*;
import com.example.demo.rest.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {
    @Autowired
    private UserService userService;

    private PasswordEncoder passwordEncoder;

    @GetMapping("/test")
    public String test() {
        return "Test";
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> registerUser(@RequestBody RegisterRequest user) {
        User createdUser = userService.saveUser(user);
        return ResponseEntity.ok(new RegisterResponse(createdUser.getUser_id(), createdUser.getEmail()));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> checkUser(@RequestBody LoginRequest user) {
        User createdUser = userService.loadUser(user);
        return ResponseEntity.ok(new LoginResponse(JWTUtil.addAuthentication(createdUser.getEmail())));
    }

    @PostMapping("/deactivate")
    public ResponseEntity<DeactivateResponse> deactivateUser(DeactivateRequest deactivateRequest) {
        return ResponseEntity.ok(new DeactivateResponse(userService.deleteUser(deactivateRequest.getUser_id())));
    }

    @PostMapping("/update")
    public ResponseEntity<UpdateResponse> updateUser(@RequestBody UpdateRequest update) {
        User createdUser = userService.updateUser(update);
        return ResponseEntity.ok(new UpdateResponse(
                createdUser.getUser_id(),
                createdUser.getEmail()
                ));
    }

    @PostMapping("/change-password")
    public ResponseEntity<PasswordResponse> changePassword(@RequestBody PasswordChangeRequest password) {
        return ResponseEntity.ok(new PasswordResponse(userService.changePassword(password)));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<PasswordResponse> resetPassword(@RequestBody PasswordResetRequest password) {
        return ResponseEntity.ok(new PasswordResponse(userService.resetPassword(password)));
    }

    @GetMapping("/user")
    public ResponseEntity<UserResponse> getUserByToken(@RequestParam(name = "token") String token) {
        User createdUser = userService.getByEmail(JWTUtil.getEmail(token));
        return ResponseEntity.ok(new UserResponse(
                createdUser.getUser_id(),
                createdUser.getFirst_name(),
                createdUser.getLast_name(),
                createdUser.getEmail(),
                createdUser.getPicture()
        ));
    }
}
