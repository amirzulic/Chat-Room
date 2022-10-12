package com.example.demo.store;

import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    @Query(value = "SELECT * FROM Users WHERE email = ?1", nativeQuery = true)
    public User getUserByEmail(String email);

    @Query(value = "SELECT * FROM Users WHERE user_id = ?1", nativeQuery = true)
    public User getUserById(int user_id);

    @Transactional
    @Modifying
    @Query(value = "UPDATE Users SET first_name = ?1, last_name = ?2," +
            " email = ?3, picture = ?4 WHERE user_id = ?5", nativeQuery = true)
    public void updateUser(
            String first_name,
            String last_name,
            String email,
            String picture,
            int user_id
    );

    @Transactional
    @Modifying
    @Query(value = "UPDATE Users SET password = ?1 WHERE email = ?2", nativeQuery = true)
    public void updateUserPassword(
            String password,
            String email
    );

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM Users WHERE user_id = ?1", nativeQuery = true)
    public void deleteUser(int user_id);
}
