package com.mlp.lab.controller.chat;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import com.mlp.lab.dto.chat.ChatDataRequestDto;
import com.mlp.lab.service.chat.ChatService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
public class ChatController {

    private final ChatService chatService;

    @MessageMapping("/chat/message")
    // @SendTo("/topic/chat/room/{roomId}")
    public void sendMessage(ChatDataRequestDto message) {
        System.out.println("받은 메시지: " + message.getMessage());
        System.out.println("메시지 유형: " + message.getType());
        System.out.println("채팅방 ID: " + message.getRoomId());
        chatService.sendMessage(message.getUserId(), message);
    }
}

// // /app의 경우 기본 publish로 지정했기 때문에
// ///app 이후 url만 MessageMapping으로 요청받고
// //각자 입맛에 맞게 변형한 뒤 SimplMessagingTemplate를 통해서
// //내가 보내주고자 하는 사람이 subscribe한 링크로 보내주면 됩니다.
// //이런식으로 client가 채팅방을 만들 때 publish는 모두 동일한 링크로 두고
// //subscribe를 개인의 고유한 url로 만들어서
// //각각의 유저끼리 1:1 채팅이 가능하도록 합니다.