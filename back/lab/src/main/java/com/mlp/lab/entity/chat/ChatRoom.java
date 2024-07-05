package com.mlp.lab.entity.chat;

import java.util.ArrayList;
import java.util.List;

import com.mlp.lab.entity.Buy;
import com.mlp.lab.entity.Market;
import com.mlp.lab.entity.ShareRoom;
import com.mlp.lab.entity.Team;
import com.mlp.lab.entity.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PreRemove;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "chatroom")
@NoArgsConstructor
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chatroom_id")
    private Long chatroomId;

    @Column(name = "title")
    private String title;

    @Column(name = "type")
    private String type;

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private List<Chat> chats = new ArrayList<>();

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buy_no", referencedColumnName = "buy_no", nullable = true)
    private Buy buy;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_no", referencedColumnName = "team_no", nullable = true)
    private Team team;

    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "market_no", referencedColumnName = "market_no", nullable = true)
    private Market market;

    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "room_no", referencedColumnName = "roomNo", nullable = true)
    private ShareRoom shareRoom;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "writer_id", referencedColumnName = "id")
    private User writer;

    @ManyToMany
    @JoinTable(
        name = "chatroom_reader",
        joinColumns = @JoinColumn(name = "chatroom_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> reader = new ArrayList<>();  //채팅방에 입장할 인원들

    @PreRemove
    private void preRemove() {
        if (buy != null) {
            buy.setChatRoom(null);
        }
        if (team != null) {
            team.setChatRoom(null);
        }
    }

    @Builder
    public ChatRoom(Long chatroomId, String title, String type, Buy buy, Team team, Market market, ShareRoom shareRoom, User writer, List<User> reader) {
        this.chatroomId = chatroomId;
        this.title = title;
        this.type = type;
        this.buy = buy;
        this.team = team;
        this.market = market;
        this.shareRoom = shareRoom;
        this.writer = writer;
        this.reader = reader;
    }

    public void removeReader(User user) {
        this.reader.remove(user);
    }
}
