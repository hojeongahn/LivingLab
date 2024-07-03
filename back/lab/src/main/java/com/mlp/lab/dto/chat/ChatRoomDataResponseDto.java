package com.mlp.lab.dto.chat;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.mlp.lab.entity.User;
import com.mlp.lab.entity.chat.Chat;
import com.mlp.lab.entity.chat.ChatRoom;

import lombok.Getter;
import lombok.Setter;

public class ChatRoomDataResponseDto {
    @Getter
    @Setter
    public static class Info {
        private Long roomId;
        private String title;
        private String type;
        private Long buyNo;
        private Long teamNo;
        private Long marketNo;
        private Long roomNo;
        private Long writerId;
        private List<Long> readerId;

        private Info(Long roomId, String title, String type, Long buyNo, Long teamNo, Long marketNo, Long roomNo, Long writerId,
                List<Long> readerId) {
            this.roomId = roomId;
            this.title = title;
            this.type = type;
            this.buyNo = buyNo;
            this.teamNo = teamNo;
            this.marketNo = marketNo;
            this.roomNo = roomNo;
            this.writerId = writerId;
            this.readerId = readerId;
        }

        public static Info of(ChatRoom chatRoom) {
            List<Long> readerId = new ArrayList<>();

            // chatRoom.getReader()가 List<User> 타입인 경우에 대비하여 처리
            if (chatRoom.getReader() != null && !chatRoom.getReader().isEmpty()) {
                readerId = chatRoom.getReader().stream()
                        .map(User::getId)
                        .collect(Collectors.toList());
            }

            String title = chatRoom.getTitle();
            String type = chatRoom.getType();
            Long buyNo = chatRoom.getBuy() != null ? chatRoom.getBuy().getBuyNo() : null;
            Long teamNo = chatRoom.getTeam() != null ? chatRoom.getTeam().getTeamNo() : null;
            Long marketNo = chatRoom.getMarket() != null ? chatRoom.getMarket().getMarketNo() : null;
            Long roomNo = chatRoom.getShareRoom() != null ? chatRoom.getShareRoom().getRoomNo() : null;
            Long writerId = chatRoom.getWriter() != null ? chatRoom.getWriter().getId() : null;

            return new Info(chatRoom.getChatroomId(),
                    title,
                    type,
                    buyNo,
                    teamNo,
                    marketNo,
                    roomNo,
                    writerId,
                    readerId);
        }
    }

    @Getter
    @Setter
    public static class ChatHistory {
        List<ChatDataResponseDto.Message> messageHistory = new ArrayList<>();

        public ChatHistory(List<Chat> messageHistory) {
            this.messageHistory = messageHistory.stream()
                    .map(chat -> new ChatDataResponseDto.Message(chat))
                    .collect(Collectors.toList());
        }
    }
}
