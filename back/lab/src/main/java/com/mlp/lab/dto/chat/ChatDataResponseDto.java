package com.mlp.lab.dto.chat;

import com.mlp.lab.entity.chat.Chat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatDataResponseDto {
    private Long roomId;
    private String message;
    private String sender;

    public ChatDataResponseDto(Long roomId, String message, String sender) {
        this.roomId = roomId;
        this.message = message;
        this.sender = sender;
    }

    @Getter
    @Setter
    public static class Message {
        public enum MessageType {
            ENTER, TALK
        }

        private MessageType type;
        private String sender;
        private String message;

        public Message() {}

        public Message(Chat chat) {
            this.type = MessageType.TALK;
            this.sender = chat.getSenderNickname();
            this.message = chat.getContent();
        }
    }
}
