package com.mlp.lab.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mlp.lab.entity.Community;
import com.mlp.lab.entity.Reply;
import com.mlp.lab.entity.User;

@Repository
public interface ReplyRepository extends JpaRepository<Reply, Long>{

    List<Reply> findByCommunity(Community community);

    List<Reply> findByUser(User user);

    @Modifying
    @Query("UPDATE Reply r SET r.content = :editedContent WHERE r.replyNo = :replyNo")
    void modify(@Param("replyNo") Long replyNo, @Param("editedContent") String editedContent);
    
}
