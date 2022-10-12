package com.example.demo.rest.jwt;

import com.example.demo.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JWTUtil {
    private static String secret;
    private static int expiration_time;

    @Value("${jwt.secret}")
    public void setJWTSecret(String secret) {
        this.secret = secret;
    }

    @Value("${jwt.expirationTime}")
    public void setJWTExpiration(int expiration_time) {
        this.expiration_time = expiration_time;
    }


    public static String getEmail(String token) {
        return  Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
    public static boolean validateToken(String token, User user) {
        if (token == null) { return false; }
        boolean isValid = false;
        String email = getEmail(token);
        if (user.getEmail().equals(email)) {
            isValid = true;
        }
        return isValid;
    }

    public static String addAuthentication(String email) {
        String JWT = Jwts.builder()
                .setSubject(email)
                .setExpiration(new Date(System.currentTimeMillis() + expiration_time))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();

        return JWT;
    }
}
