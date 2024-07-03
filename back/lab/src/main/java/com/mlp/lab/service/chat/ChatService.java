package com.mlp.lab.service.chat;

import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

import com.mlp.lab.dto.chat.ChatDataRequestDto;
import com.mlp.lab.dto.chat.ChatDataResponseDto;
import com.mlp.lab.entity.User;
import com.mlp.lab.entity.chat.Chat;
import com.mlp.lab.entity.chat.ChatRoom;
import com.mlp.lab.repository.UserRepository;
import com.mlp.lab.repository.chat.ChatRepository;
import com.mlp.lab.repository.chat.ChatRoomRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ChatService {

    private final SimpMessageSendingOperations messagingTemplate;
    private final ChatRepository chatRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;

    @Transactional
    public void sendMessage(Long userId, ChatDataRequestDto message) {
        ChatRoom chatRoom = chatRoomRepository.findByChatroomId(message.getRoomId());
        User user = userRepository.findByUserId(userId);

        Chat chat = Chat.builder()
                .sender(user)
                .chatRoom(chatRoom)
                .content(message.getMessage())
                .build();

        chatRepository.save(chat);

        ChatDataResponseDto.Message sendMessage = new ChatDataResponseDto.Message();
        sendMessage.setMessage(message.getMessage());
        sendMessage.setSender(user.getNickname());
        sendMessage.setType(ChatDataResponseDto.Message.MessageType.TALK);

        messagingTemplate.convertAndSend("/topic/chat/room/" + message.getRoomId(), sendMessage);
    }
}
