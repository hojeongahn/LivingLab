package com.mlp.lab.repository.like;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mlp.lab.entity.like.Likes;

@Repository
public interface LikeTeamRepository extends JpaRepository<Likes, Long>{
    @Query("select lt from Likes lt where lt.team.teamNo=:teamNo and lt.user.id=:id")
    Optional<Likes> findLike(@Param("teamNo")Long teamNo, @Param("id") Long id);
}
