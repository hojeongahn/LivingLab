package com.mlp.lab.repository.like;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mlp.lab.entity.like.Likes;

@Repository
public interface LikeMarketRepository extends JpaRepository<Likes, Long>{
    @Query("select lm from Likes lm where lm.market.marketNo=:marketNo and lm.user.id=:id")
    Optional<Likes> findLike(@Param("marketNo")Long marketNo, @Param("id") Long id);

}
