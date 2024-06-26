package com.mlp.lab.repository.chat;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mlp.lab.entity.chat.ChatRoom;

import jakarta.transaction.Transactional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

       @Query("SELECT cr FROM ChatRoom cr " +
                     "LEFT JOIN cr.reader r " +
                     "WHERE cr.writer.id = :id OR r.id = :id")
       List<ChatRoom> findByUserId(@Param("id") Long id);

       ChatRoom findByChatroomId(Long roomId);

       ChatRoom findByBuy_BuyNo(Long buyNo);

       ChatRoom findByTeam_TeamNo(Long buyNo);

       ChatRoom findByMarket_MarketNo(Long buyNo);

       @Modifying
       @Transactional
       @Query("UPDATE ChatRoom c SET c.buy = NULL WHERE c.buy.buyNo = :buyNo")
       int updateBuyRoom(@Param("buyNo") Long buyNo);

       @Modifying
       @Transactional
       @Query("UPDATE ChatRoom c SET c.team = NULL WHERE c.team.teamNo = :teamNo")
       int updateTeamRoom(@Param("teamNo") Long teamNo);

       @Query("SELECT cr FROM ChatRoom cr " +
                     "LEFT JOIN cr.reader r " +
                     "WHERE (cr.writer.id = :id OR r.id = :id) AND cr.buy.buyNo = :buyNo")
       Optional<ChatRoom> findByUserIdAndBuyNo(@Param("id") Long id, @Param("buyNo") Long buyNo);
}
