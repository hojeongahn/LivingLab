package com.mlp.lab.repository.like;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mlp.lab.entity.like.Likes;

@Repository
public interface LikeBuyRepository extends JpaRepository<Likes, Long>{
    @Query("select lb from Likes lb where lb.buy.buyNo=:no and lb.user.id=:id")
    Optional<Likes> findofBuy(@Param("no")Long no, @Param("id") Long id);
}
