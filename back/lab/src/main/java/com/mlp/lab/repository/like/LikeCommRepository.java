package com.mlp.lab.repository.like;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mlp.lab.entity.like.Likes;

@Repository
public interface LikeCommRepository extends JpaRepository<Likes, Long>{
    @Query("select lc from Likes lc where lc.community.commNo=:commNo and lc.user.id=:id")
    Optional<Likes> findLike(@Param("commNo")Long commNo, @Param("id") Long id);
}
