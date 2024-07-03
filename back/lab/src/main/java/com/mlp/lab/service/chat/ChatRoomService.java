package com.mlp.lab.service.chat;

import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.mlp.lab.dto.chat.ChatRoomDataRequestDto;
import com.mlp.lab.dto.chat.ChatRoomDataResponseDto;
import com.mlp.lab.dto.chat.ChatRoomDataResponseDto.Info;
import com.mlp.lab.entity.Buy;
import com.mlp.lab.entity.Market;
import com.mlp.lab.entity.ShareRoom;
import com.mlp.lab.entity.Team;
import com.mlp.lab.entity.User;
import com.mlp.lab.entity.chat.Chat;
import com.mlp.lab.entity.chat.ChatRoom;
import com.mlp.lab.repository.BuyRepository;
import com.mlp.lab.repository.MarketRepository;
import com.mlp.lab.repository.ShareRoomRepository;
import com.mlp.lab.repository.TeamRepository;
import com.mlp.lab.repository.UserRepository;
import com.mlp.lab.repository.chat.ChatRepository;
import com.mlp.lab.repository.chat.ChatRoomRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ChatRoomService {

    private final ChatRepository chatRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;
    private final BuyRepository buyRepository;
    private final ShareRoomRepository shareRoomRepository;
    private final TeamRepository teamRepository;
    private final MarketRepository marketRepository;
    private ChatRoom chatRoom;

    // ------ 공통 사항 -------

    public List<ChatRoomDataResponseDto.Info> findAllRoomByUserId(Long userId) {
        List<ChatRoom> ChatRooms = chatRoomRepository.findByUserId(userId);
        return ChatRooms.stream()
                .map(chatRoom -> ChatRoomDataResponseDto.Info.of(chatRoom))
                .collect(Collectors.toList());
    }

    public ChatRoomDataResponseDto.Info findRoomByRoomId(Long roomId) {
        ChatRoom chatRoom = chatRoomRepository.findByChatroomId(roomId);
        return ChatRoomDataResponseDto.Info.of(chatRoom);
    }

    public ChatRoomDataResponseDto.Info createRoom(Long userId, String title, String type, ChatRoomDataRequestDto.create createRequest) {

        if(createRequest.getBuyNo()!=null){ //공동구매
            Buy buy = buyRepository.findByBuyNo(createRequest.getBuyNo());
            User user = buy.getUser();   //글 작성자(채팅방 생성 후 자동으로 입장)
            chatRoom = ChatRoom.builder()
                .writer(user)
                .buy(buy)
                .title(title)
                .type(type)
                .build();
            chatRoomRepository.save(chatRoom);
        } else if(createRequest.getTeamNo()!=null){ //동네모임
            Team team = teamRepository.findByTeamNo(createRequest.getTeamNo());
            User user = team.getUser();
            chatRoom = ChatRoom.builder()
                .writer(user)
                .team(team)
                .title(title)
                .type(type)
                .build();
            chatRoomRepository.save(chatRoom);
        } else if(createRequest.getMarketNo()!=null){ //동네장터는 문의자가 참여하기 클릭 시 채팅방 생성(1대1)
            Market market = marketRepository.findMarketByMarketNo(createRequest.getMarketNo());
            User writer = userRepository.findByUserId(market.getId());
            User reader = userRepository.findByUserId(userId);
            List<User> readers = new ArrayList<>();
            readers.add(reader);
            chatRoom = ChatRoom.builder()
                .writer(writer)
                .market(market)
                .title(title)
                .type(type)
                .reader(readers)
                .build();
            chatRoomRepository.save(chatRoom);
        } else if(createRequest.getRoomNo()!=null){ //자취방쉐어
            ShareRoom shareRoom = shareRoomRepository.findShareRoomByRoomNo(createRequest.getRoomNo());
            User writer = userRepository.findByUserId(shareRoom.getId());
            User reader = userRepository.findByUserId(userId);
            List<User> readers = new ArrayList<>();
            readers.add(reader);
            chatRoom = ChatRoom.builder()
                .writer(writer)
                .shareRoom(shareRoom)
                .title(title)
                .type(type)
                .reader(readers)
                .build();
            chatRoomRepository.save(chatRoom);
        } 

        return ChatRoomDataResponseDto.Info.of(chatRoom);
    }

    public void deleteRoom(Long roomId) {
        chatRoomRepository.deleteById(roomId);
    }

    public ChatRoomDataResponseDto.ChatHistory getChatHistory(Long roomId) {
        List<Chat> chatHistory = chatRepository.getChatByRoomId(roomId);
        return new ChatRoomDataResponseDto.ChatHistory(chatHistory);
    }

    // ------ 세부 사항 -------

    public ChatRoomDataResponseDto.Info findRoomByBuyNo(Long buyNo) {
        ChatRoom chatRoom = chatRoomRepository.findByBuy_BuyNo(buyNo);
        return ChatRoomDataResponseDto.Info.of(chatRoom);
    }

    public ChatRoomDataResponseDto.Info enterRoomBuy(Long userId, Long buyNo){
        User user = userRepository.findByUserId(userId);  //글을 읽고 참여하기를 누른 유저
        ChatRoom chatRoom = chatRoomRepository.findByBuy_BuyNo(buyNo);
        List<User> readers = chatRoom.getReader();
        readers.add(user);
        chatRoomRepository.save(chatRoom);
        return ChatRoomDataResponseDto.Info.of(chatRoom);
    }

    public ChatRoomDataResponseDto.Info exitRoomBuy(Long userId, Long buyNo){
        User user = userRepository.findByUserId(userId);  //참여x를 누른 유저
        ChatRoom chatRoom = chatRoomRepository.findByBuy_BuyNo(buyNo);
        chatRoom.removeReader(user);
        chatRoomRepository.save(chatRoom);
        return ChatRoomDataResponseDto.Info.of(chatRoom);
    }

    public ChatRoomDataResponseDto.Info findRoomByTeamNo(Long teamNo) {
        ChatRoom chatRoom = chatRoomRepository.findByTeam_TeamNo(teamNo);
        return ChatRoomDataResponseDto.Info.of(chatRoom);
    }
    
    public ChatRoomDataResponseDto.Info enterRoomTeam(Long userId, Long teamNo) {
        User user = userRepository.findByUserId(userId);  // 글을 읽고 참여하기를 누른 유저
        ChatRoom chatRoom = chatRoomRepository.findByTeam_TeamNo(teamNo);
        List<User> readers = chatRoom.getReader();
        readers.add(user);
        chatRoomRepository.save(chatRoom);
        return ChatRoomDataResponseDto.Info.of(chatRoom);
    }
    
    public ChatRoomDataResponseDto.Info exitRoomTeam(Long userId, Long teamNo) {
        User user = userRepository.findByUserId(userId);  // 참여x를 누른 유저
        ChatRoom chatRoom = chatRoomRepository.findByTeam_TeamNo(teamNo);
        chatRoom.removeReader(user);
        chatRoomRepository.save(chatRoom);
        return ChatRoomDataResponseDto.Info.of(chatRoom);
    }
    
    public List<ChatRoom> findRoomByMarketNo(Long marketNo) {
        List<ChatRoom> chatRoom = chatRoomRepository.findByMarket_MarketNo(marketNo);
        for(int i=0; i<chatRoom.size(); i++){
            ChatRoomDataResponseDto.Info.of(chatRoom.get(i));
        }
        return chatRoom;
    }
    
    // public ChatRoomDataResponseDto.Info exitRoomMarket(Long userId, Long marketNo) {
    //     User user = userRepository.findByUserId(userId);  
    //     ChatRoom chatRoom = chatRoomRepository.findByMarket_MarketNo(marketNo);
    //     chatRoom.removeReader(user);
    //     chatRoomRepository.save(chatRoom);
    //     return ChatRoomDataResponseDto.Info.of(chatRoom);
    // }

    public List<ChatRoom> findRoomByRoomNo(Long roomNo) {
        List<ChatRoom> chatRoom = chatRoomRepository.findByShareRoom_RoomNo(roomNo);
        for(int i=0; i<chatRoom.size(); i++){
            ChatRoomDataResponseDto.Info.of(chatRoom.get(i));
        }
        return chatRoom;
    }
}
