package com.mlp.lab.controller.chat;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mlp.lab.dto.ResponseDto;
import com.mlp.lab.dto.chat.ChatRoomDataRequestDto;
import com.mlp.lab.dto.chat.ChatRoomDataResponseDto;
import com.mlp.lab.entity.Buy;
import com.mlp.lab.entity.Team;
import com.mlp.lab.entity.User;
import com.mlp.lab.entity.chat.ChatRoom;
import com.mlp.lab.repository.BuyRepository;
import com.mlp.lab.repository.TeamRepository;
import com.mlp.lab.service.BuyService;
import com.mlp.lab.service.TeamService;
import com.mlp.lab.service.chat.ChatRoomService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
@RequestMapping("api/chat")
public class ChatRoomController {

    private final ChatRoomService chatRoomService;
    private final BuyService buyService;
    private final TeamService teamService;
    private final BuyRepository buyRepository;
    private final TeamRepository teamRepository;

    // 모든 채팅방 목록 반환(해당 유저의)
    @GetMapping("/rooms")
    @ResponseBody
    public ResponseDto<List<ChatRoomDataResponseDto.Info>> room(@RequestParam(name="userId") Long userId) {
        List<ChatRoomDataResponseDto.Info> roomsData = chatRoomService.findAllRoomByUserId(userId);
        return ResponseDto.setSuccessData(userId+"번 유저의 모든 채팅방 목록 반환", roomsData);
    }

    // 채팅방의 모든 유저 목록 반환
    @GetMapping("/room/userList")
    @ResponseBody 
    public List<User> getList(@RequestParam(name="roomId") Long roomId){
        List<User> user = chatRoomService.getList(roomId);
        return user;
    }
    
    // 채팅방 생성(글 작성시 자동으로)
    @PostMapping("/room/create")
    @ResponseBody
    public ResponseDto<ChatRoomDataResponseDto.Info> createRoom(@RequestParam(name="userId") Long userId, @RequestParam(name="title") String title,
            @RequestParam(name="type") String type, @RequestBody ChatRoomDataRequestDto.create createRequest) {
        ChatRoomDataResponseDto.Info roomData = chatRoomService.createRoom(userId, title, type, createRequest);
        return ResponseDto.setSuccessData("채팅방 생성", roomData);
    }

    // 특정 채팅방 삭제
    @DeleteMapping("/room/delete/{roomId}")
    @ResponseBody
    public ResponseDto<Object> deleteRoom(@PathVariable("roomId") Long roomId) {
        chatRoomService.deleteRoom(roomId);
        return ResponseDto.setSuccess(roomId + "번 채팅방 삭제");
    }

    // 채팅 기록
    @ResponseBody
    @GetMapping("/room/history/{roomId}")
    public ResponseDto<ChatRoomDataResponseDto.ChatHistory> chatHistory(@PathVariable Long roomId) {
        ChatRoomDataResponseDto.ChatHistory chatHistory = chatRoomService.getChatHistory(roomId);
        return ResponseDto.setSuccessData("채팅 기록", chatHistory);
    }

    // 공동구매 특정 채팅방 입장
    @PostMapping("/room/buy/enter")
    @ResponseBody
    public ResponseDto<ChatRoomDataResponseDto.Info> enterBuyRoom(@RequestParam(name="userId") Long userId, @RequestParam(name = "buyNo") Long buyNo) {
        ChatRoomDataResponseDto.Info roomData = chatRoomService.enterRoomBuy(userId, buyNo);
        Buy buy = buyService.get(buyNo);
        buy.setCurrent(buy.getCurrent()+1); //현재인원 증가
        buyRepository.save(buy);
        return ResponseDto.setSuccessData("채팅방 입장", roomData);
    }

    // 공동구매 특정 채팅방 퇴장
    @PostMapping("/room/buy/exit")
    @ResponseBody
    public ResponseDto<ChatRoomDataResponseDto.Info> exitBuyRoom(@RequestParam(name="userId") Long userId, @RequestParam(name="buyNo") Long buyNo) {
        ChatRoomDataResponseDto.Info roomData = chatRoomService.exitRoomBuy(userId, buyNo);
        Buy buy = buyService.get(buyNo);
        buy.setCurrent(buy.getCurrent()-1); //현재인원 감소
        buyRepository.save(buy);
        return ResponseDto.setSuccessData("채팅방 퇴장", roomData);
    }

    // 공동구매 특정 채팅방 조회
    @GetMapping("/room/buy/get")
    @ResponseBody
    public ResponseDto<ChatRoomDataResponseDto.Info> chatUserInfoBuy(@RequestParam(name="buyNo") Long buyNo) {
        ChatRoomDataResponseDto.Info roomData = chatRoomService.findRoomByBuyNo(buyNo);
        return ResponseDto.setSuccessData("특정 채팅방 조회", roomData);
    }

    // 동네모임 특정 채팅방 입장
    @PostMapping("/room/team/enter")
    @ResponseBody
    public ResponseDto<ChatRoomDataResponseDto.Info> enterTeamRoom(@RequestParam(name="userId") Long userId, @RequestParam(name = "teamNo") Long teamNo) {
        ChatRoomDataResponseDto.Info roomData = chatRoomService.enterRoomTeam(userId, teamNo);
        Team team = teamService.get(teamNo);
        team.setCurrent(team.getCurrent()+1); // 현재인원 증가
        teamRepository.save(team);
        return ResponseDto.setSuccessData("채팅방 입장", roomData);
    }

    // 동네모임 특정 채팅방 퇴장
    @PostMapping("/room/team/exit")
    @ResponseBody
    public ResponseDto<ChatRoomDataResponseDto.Info> exitTeamRoom(@RequestParam(name="userId") Long userId, @RequestParam(name="teamNo") Long teamNo) {
        ChatRoomDataResponseDto.Info roomData = chatRoomService.exitRoomTeam(userId, teamNo);
        Team team = teamService.get(teamNo);
        team.setCurrent(team.getCurrent()-1); // 현재인원 감소
        teamRepository.save(team);
        return ResponseDto.setSuccessData("채팅방 퇴장", roomData);
    }

    // 동네모임 특정 채팅방 조회
    @GetMapping("/room/team/get")
    @ResponseBody
    public ResponseDto<ChatRoomDataResponseDto.Info> chatUserInfoTeam(@RequestParam(name="teamNo") Long teamNo) {
        ChatRoomDataResponseDto.Info roomData = chatRoomService.findRoomByTeamNo(teamNo);
        return ResponseDto.setSuccessData("특정 채팅방 조회", roomData);
    }

    // 동네장터 특정 채팅방 퇴장(채팅방 삭제)
    @DeleteMapping("/room/market/exit")
    @ResponseBody
    public ResponseDto<Object> exitMarketRoom(@RequestParam(name = "userId") Long userId,
            @RequestParam(name = "marketNo") Long marketNo) {
        chatRoomService.exitRoomMarket(userId, marketNo);
        return ResponseDto.setSuccess("채팅방 퇴장(삭제)");
    }

    // 동네장터 특정 채팅방 조회
    @GetMapping("/room/market/get")
    @ResponseBody
    public ResponseDto<List<ChatRoom>> chatUserInfoMarket(@RequestParam(name="marketNo") Long marketNo) {
        List<ChatRoom> roomData = chatRoomService.findRoomByMarketNo(marketNo);
        return ResponseDto.setSuccessData("특정 채팅방 조회", roomData);
    }

    // 자취방쉐어 특정 채팅방 조회
    @GetMapping("/room/shareRoom/get")
    @ResponseBody
    public ResponseDto<List<ChatRoom>> chatUserInfoShare(@RequestParam(name="roomNo") Long roomNo) {
        List<ChatRoom> roomData = chatRoomService.findRoomByRoomNo(roomNo);
        return ResponseDto.setSuccessData("특정 채팅방 조회", roomData);
    }

    // 자취방쉐어 특정 채팅방 퇴장(채팅방 삭제)
    @DeleteMapping("/room/shareRoom/exit")
    @ResponseBody
    public ResponseDto<Object> exitShareRoom(@RequestParam(name = "userId") Long userId,
            @RequestParam(name = "roomNo") Long roomNo) {
        chatRoomService.exitRoomShare(userId, roomNo);
        return ResponseDto.setSuccess("채팅방 퇴장(삭제)");
    }
}