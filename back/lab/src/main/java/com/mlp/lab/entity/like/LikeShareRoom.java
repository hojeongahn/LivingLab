package com.mlp.lab.entity.like;

import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.mlp.lab.entity.ShareRoom;
import com.mlp.lab.entity.User;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "likeshareroom")
@Transactional
public class LikeShareRoom {
    // 기본키
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long likeNo;

    // 외래 키
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_roomNo")
    @JsonBackReference
    private ShareRoom shareRoom;
    
}
