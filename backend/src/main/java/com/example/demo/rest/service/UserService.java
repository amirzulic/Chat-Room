package com.example.demo.rest.service;

import com.example.demo.model.User;
import com.example.demo.rest.exception.LoginException;
import com.example.demo.rest.request.*;
import com.example.demo.rest.exception.RegisterException;
import com.example.demo.store.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User saveUser(RegisterRequest requestUser) {
        User createdUser = new User(
                requestUser.getFirst_name(),
                requestUser.getLast_name(),
                requestUser.getEmail(),
                passwordEncoder.encode(requestUser.getPassword()),
                requestUser.getPicture()
                );

        List<User> list = userRepository.findAll();

        list.forEach((user) -> {
            if(user.getEmail().equals(requestUser.getEmail())) {
                throw new RegisterException("Email already in use!");
            }
        });
        return userRepository.save(createdUser);
    }

    public User loadUser(LoginRequest loginRequest) {
        User user = userRepository.getUserByEmail(loginRequest.getEmail());

        if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return user;
        } else {
            throw new LoginException("Password incorrect!");
        }
    }

    public User updateUser(UpdateRequest updateRequest) {
        User existing_user = userRepository.getUserById(updateRequest.getUser_id());
        String first_name, last_name, email, picture;
        if(!updateRequest.getFirst_name().equals(existing_user.getFirst_name())) {
            first_name = updateRequest.getFirst_name();
        }else {
            first_name = existing_user.getFirst_name();
        }
        if(!updateRequest.getLast_name().equals(existing_user.getLast_name())) {
            last_name = updateRequest.getLast_name();
        } else {
            last_name = existing_user.getLast_name();
        }
        if(!updateRequest.getEmail().equals(existing_user.getEmail())) {
            email = updateRequest.getEmail();
        } else {
            email = existing_user.getEmail();
        }
        if(!updateRequest.getPicture().equals(existing_user.getPicture())) {
            picture = updateRequest.getPicture();
        } else {
            picture = existing_user.getPicture();
        }
        User new_user = new User(first_name, last_name, email, existing_user.getPassword(), picture);
        new_user.setUser_id(updateRequest.getUser_id());
        userRepository.updateUser(
                new_user.getFirst_name(),
                new_user.getLast_name(),
                new_user.getEmail(),
                new_user.getPicture(),
                new_user.getUser_id()
        );
        return new_user;
    }

    public String deleteUser(int user_id) {
        userRepository.deleteUser(user_id);
        return "User deactivated";
    }

    public String changePassword(PasswordChangeRequest passwordRequest) {
        User user = userRepository.getUserByEmail(passwordRequest.getEmail());
        if (passwordEncoder.matches(passwordRequest.getCurrent_password(), user.getPassword())) {
            user.setPassword(passwordEncoder.encode(passwordRequest.getNew_password()));
            userRepository.updateUserPassword(
                    user.getPassword(),
                    passwordRequest.getEmail()
            );
        } else {
            throw new LoginException("Password incorrect!");
        }

        return "Password changed!";
    }

    public String resetPassword(PasswordResetRequest passwordRequest) {
        User user = userRepository.getUserByEmail(passwordRequest.getEmail());
        user.setPassword(passwordEncoder.encode(passwordRequest.getPassword()));
        userRepository.updateUserPassword(
                user.getPassword(),
                passwordRequest.getEmail()
        );

        return "Password reset!";
    }

    public User getByEmail(String email) {
        return userRepository.getUserByEmail(email);
    }
}
