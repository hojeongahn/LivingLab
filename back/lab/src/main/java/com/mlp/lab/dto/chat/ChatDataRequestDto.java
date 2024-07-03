package com.mlp.lab.dto.chat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatDataRequestDto {

    private Long userId;
    private String type; // enum 대신 문자열로 받음
    private Long roomId;
    private String message;
    private String sender;

    public ChatDataRequestDto() {
        // 기본 생성자
    }

    public ChatDataRequestDto(Long userId, String type, Long roomId, String message) {
        this.userId = userId;
        this.type = type;
        this.roomId = roomId;
        this.message = message;
    }
}
