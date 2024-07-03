package com.mlp.lab.repository.like;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mlp.lab.entity.like.Likes;

@Repository
public interface LikesRepository extends JpaRepository<Likes, Long>{
    @Query("select lb from Likes lb where lb.buy.buyNo=:no and lb.user.id=:id")
    Optional<Likes> findofBuy(@Param("no") Long no, @Param("id") Long id);

    @Query("select lt from Likes lt where lt.team.teamNo=:no and lt.user.id=:id")
    Optional<Likes> findofTeam(@Param("no") Long no, @Param("id") Long id);

    @Query("select lm from Likes lm where lm.market.marketNo=:no and lm.user.id=:id")
    Optional<Likes> findofMarket(@Param("no") Long no, @Param("id") Long id);

    @Query("select lc from Likes lc where lc.community.commNo=:no and lc.user.id=:id")
    Optional<Likes> findofCommunity(@Param("no") Long no, @Param("id") Long id);

    @Query("select ls from Likes ls where ls.shareRoom.roomNo=:no and ls.user.id=:id")
    Optional<Likes> findofRoom(@Param("no") Long no, @Param("id") Long id);

    @Query("SELECT li FROM Likes li WHERE li.user.id = :id ORDER BY li.likeNo DESC")
    Page<Likes> findAllByUser(@Param(value = "id") Long id, Pageable pageable);
}
