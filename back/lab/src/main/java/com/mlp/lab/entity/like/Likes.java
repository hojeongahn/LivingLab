package com.mlp.lab.entity.like;

import com.mlp.lab.entity.Buy;
import com.mlp.lab.entity.Community;
import com.mlp.lab.entity.Market;
import com.mlp.lab.entity.Team;
import com.mlp.lab.entity.User;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@Table(name = "likes")
public class Likes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long likeNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "buy_no", referencedColumnName = "buy_no", nullable = true)
    private Buy buy;

    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "team_no", referencedColumnName = "team_no", nullable = true)
    private Team team;

    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "market_no", referencedColumnName = "market_no", nullable = true)
    private Market market;

    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "comm_no", referencedColumnName = "comm_no", nullable = true)
    private Community community;

    @Builder
    public Likes(Long likeNo, User user, Buy buy, Team team, Market market, Community community){
        this.likeNo = likeNo;
        this.user = user;
        this.buy = buy;
        this.team = team;
        this.market = market;
        this.community = community;
    }
}
