package com.mlp.lab.service;

import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mlp.lab.dto.like.LikeDto;
import com.mlp.lab.dto.like.LikeRoomDto;
import com.mlp.lab.entity.like.Likes;
import com.mlp.lab.entity.Buy;
import com.mlp.lab.entity.Team;
import com.mlp.lab.entity.User;
import com.mlp.lab.entity.like.LikeShareRoom;
import com.mlp.lab.repository.BuyRepository;
import com.mlp.lab.repository.TeamRepository;
import com.mlp.lab.repository.UserRepository;
import com.mlp.lab.repository.like.LikeCommRepository;
import com.mlp.lab.repository.like.LikeMarketRepository;
import com.mlp.lab.repository.like.LikeRoomRepository;
import com.mlp.lab.repository.like.LikeTeamRepository;
import com.mlp.lab.repository.like.LikesRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class LikeService {
    private final ModelMapper modelMapper;
    private final LikesRepository likesRepository;
    private final LikeMarketRepository likeMarketRepository;
    private final LikeRoomRepository likeRoomRepository;
    private final LikeCommRepository likeCommRepository;
    private final BuyRepository buyRepository;
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;

    /* ===============공동구매=============== */ 

    public void addLike(String type, Long no, Long id){
        if(type.equals("buy")){
            Buy buy = buyRepository.findByBuyNo(no);
            User user = userRepository.findByUserId(id);
            Likes likes = Likes.builder().user(user).buy(buy).build();
            likesRepository.save(likes);
        }
        else if(type.equals("team")){
            Team team = teamRepository.findByTeamNo(no);
            User user = userRepository.findByUserId(id);
            Likes likes = Likes.builder().user(user).team(team).build();
            likesRepository.save(likes);
        }
        
    }

    public void deleteLike(Long likeNo) {
        likesRepository.deleteById(likeNo);
    }

    public LikeDto readLike(String type, Long no, Long id) {
        Optional<Likes> result = null;
        LikeDto likeDto = new LikeDto();

        if(type.equals("buy")){
            result = likesRepository.findofBuy(no,id);
        
        Likes likes = result.orElse(null);
        if(likes == null){
            return null;
        }
        //LikeDto likeDto = modelMapper.map(likes, LikeDto.class);
        likeDto.setId(likes.getUser().getId());
        likeDto.setLikeNo(likes.getLikeNo());
        likeDto.setNo(likes.getBuy().getBuyNo());
        likeDto.setType("buy");
        }
        else if(type.equals("team")){
            result = likesRepository.findofTeam(no,id);
        
        Likes likes = result.orElse(null);
        if(likes == null){
            return null;
        }
        //LikeDto likeDto = modelMapper.map(likes, LikeDto.class);
        likeDto.setId(likes.getUser().getId());
        likeDto.setLikeNo(likes.getLikeNo());
        likeDto.setNo(likes.getTeam().getTeamNo());
        likeDto.setType("team");
        }


        return likeDto;
    }





    /* ===============동네장터=============== */ 

    public void addMarket(LikeDto likeDto){
        Likes likes = modelMapper.map(likeDto, Likes.class);
        likeMarketRepository.save(likes);
    }

    public void deleteMarket(Long likeNo) {
        likeMarketRepository.deleteById(likeNo);
    }

    public LikeDto readMarket(Long marketNo, Long id) {
        Optional<Likes> result = likeMarketRepository.findLike(marketNo,id);
        Likes likes = result.orElse(null);
        if(likes == null){
            return null;
        }
        LikeDto likeDto = modelMapper.map(likes, LikeDto.class);
        return likeDto;
    }

    /* ===============자취방쉐어=============== */ 

    public void addRoom(LikeRoomDto likeRoomDto){
        LikeShareRoom likeShareRoom = modelMapper.map(likeRoomDto, LikeShareRoom.class);
        likeRoomRepository.save(likeShareRoom);
    }

    public void deleteRoom(Long likeNo) { // 해당글에 찍힌 좋아요 1가지를 삭제하는기능
        likeRoomRepository.deleteById(likeNo);
    }

    public void deleteLikeRoom(Long roomNo) { // 해당글 번호를 가진 모든 좋아요를 지우는 기능
        likeRoomRepository.deleteLike(roomNo);
    }

    public LikeRoomDto readRoom(Long roomNo, Long id) {
        Optional<LikeShareRoom> result = likeRoomRepository.findLike(roomNo,id);
        LikeShareRoom likeShareRoom = result.orElse(null);
        if(likeShareRoom == null){
            return null;
        }
        LikeRoomDto likeRoomDto = modelMapper.map(likeShareRoom, LikeRoomDto.class);
        return likeRoomDto;
    }

    /* ===============커뮤니티=============== */ 

    public void addComm(LikeDto likeDto){
        Likes likes = modelMapper.map(likeDto, Likes.class);
        likeCommRepository.save(likes);
    }

    public void deleteComm(Long likeNo) {
        likeCommRepository.deleteById(likeNo);
    }

    public LikeDto readComm(Long commNo, Long id) {
        Optional<Likes> result = likeCommRepository.findLike(commNo,id);
        Likes likes = result.orElse(null);
        if(likes == null){
            return null;
        }
        LikeDto likeDto = modelMapper.map(likes, LikeDto.class);
        return likeDto;
    }

}
