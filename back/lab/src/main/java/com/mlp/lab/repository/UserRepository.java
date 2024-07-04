package com.mlp.lab.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mlp.lab.entity.User;

import jakarta.transaction.Transactional;

@Transactional
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email); // select * from user where email = ?, 이메일(아이디)로 유저 찾기

    boolean existsByEmail(String email); // 이메일이 중복되는 경우 true, 중복되지 않으면 false

    boolean existsByNickname(String nickname); // 닉네임이 중복되는 경우 true, 중복되지 않으면 false

    @Query("SELECT u FROM User u WHERE u.id = :userId")
    User findByUserId(@Param("userId") Long userId);

    User findUserByEmail(String email);

    User findByNameAndPhone(String name, String phone); // 이름과 번호로 이메일(아이디) 찾기

    // @EntityGraph(attributePaths = { "memberRoleList" })
    // @Query("select u from User u where u.email = :email")
    // User getWithRoles(@Param("email") String email);

}
