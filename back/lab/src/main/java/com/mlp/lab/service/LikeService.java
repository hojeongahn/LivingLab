package com.mlp.lab.service;

import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mlp.lab.dto.PageRequestDto;
import com.mlp.lab.dto.PageResponseDto;
import com.mlp.lab.dto.like.LikeDto;
import com.mlp.lab.dto.like.LikeRoomDto;
import com.mlp.lab.entity.like.Likes;
import com.mlp.lab.entity.Buy;
import com.mlp.lab.entity.Community;
import com.mlp.lab.entity.Market;
import com.mlp.lab.entity.ShareRoom;
import com.mlp.lab.entity.Team;
import com.mlp.lab.entity.User;
import com.mlp.lab.entity.like.LikeShareRoom;
import com.mlp.lab.repository.BuyRepository;
import com.mlp.lab.repository.CommunityRepository;
import com.mlp.lab.repository.MarketRepository;
import com.mlp.lab.repository.ShareRoomRepository;
import com.mlp.lab.repository.TeamRepository;
import com.mlp.lab.repository.UserRepository;
import com.mlp.lab.repository.like.LikeRoomRepository;
import com.mlp.lab.repository.like.LikesRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class LikeService {
    private final ModelMapper modelMapper;
    private final LikesRepository likesRepository;
    private final LikeRoomRepository likeRoomRepository;
    private final BuyRepository buyRepository;
    private final TeamRepository teamRepository;
    private final MarketRepository marketRepository;
    private final CommunityRepository communityRepository;
    private final ShareRoomRepository shareRoomRepository;
    private final UserRepository userRepository;

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
        else if(type.equals("market")){
            Market market = marketRepository.findByMarketNo(no);
            User user = userRepository.findByUserId(id);
            Likes likes = Likes.builder().user(user).market(market).build();
            likesRepository.save(likes);
        }
        else if(type.equals("community")){
            Community community = communityRepository.findByCommNo(no);
            User user = userRepository.findByUserId(id);
            Likes likes = Likes.builder().user(user).community(community).build();
            likesRepository.save(likes);
        }
        else if(type.equals("shareroom")){
            ShareRoom shareRoom = shareRoomRepository.findByRoomNo(no);
            User user = userRepository.findByUserId(id);
            Likes likes = Likes.builder().user(user).shareRoom(shareRoom).build();
            likesRepository.save(likes);
        }   
    }

    public void deleteLike(Long likeNo) {
        likesRepository.deleteById(likeNo);
    }

    public LikeDto readLike(String type, Long no, Long id) {
        Optional<Likes> result = null;
        LikeDto likeDto = new LikeDto();

        if (type.equals("buy")) {
            result = likesRepository.findofBuy(no, id);

            Likes likes = result.orElse(null);
            if (likes == null) {
                return null;
            }
            likeDto.setId(likes.getUser().getId());
            likeDto.setLikeNo(likes.getLikeNo());
            likeDto.setBuyNo(likes.getBuy().getBuyNo());
        } else if (type.equals("team")) {
            result = likesRepository.findofTeam(no, id);

            Likes likes = result.orElse(null);
            if (likes == null) {
                return null;
            }
            likeDto.setId(likes.getUser().getId());
            likeDto.setLikeNo(likes.getLikeNo());
            likeDto.setTeamNo(likes.getTeam().getTeamNo());
        } else if (type.equals("market")) {
            result = likesRepository.findofMarket(no, id);

            Likes likes = result.orElse(null);
            if (likes == null) {
                return null;
            }
            likeDto.setId(likes.getUser().getId());
            likeDto.setLikeNo(likes.getLikeNo());
            likeDto.setMarketNo(likes.getMarket().getMarketNo());
        }
        else if (type.equals("community")) {
            result = likesRepository.findofCommunity(no, id);

            Likes likes = result.orElse(null);
            if (likes == null) {
                return null;
            }
            likeDto.setId(likes.getUser().getId());
            likeDto.setLikeNo(likes.getLikeNo());
            likeDto.setCommNo(likes.getCommunity().getCommNo());
        }
        else if (type.equals("shareroom")) {
            result = likesRepository.findofRoom(no, id);

            Likes likes = result.orElse(null);
            if (likes == null) {
                return null;
            }
            likeDto.setId(likes.getUser().getId());
            likeDto.setLikeNo(likes.getLikeNo());
            likeDto.setRoomNo(likes.getShareRoom().getRoomNo());
        }
        return likeDto;
    }

    public PageResponseDto<LikeDto> mylike(PageRequestDto pageRequestDto, Long id){
        Pageable pageable = PageRequest.of(
            pageRequestDto.getPage() - 1,
            pageRequestDto.getSize(),
            Sort.by("likeNo").descending());
        Page<Likes> result = likesRepository.findAllByUser(id, pageable);
        
        List<LikeDto> dtoList = result.getContent().stream()
                .map(likes -> {
                    LikeDto dto = new LikeDto();
                    dto.setId(likes.getUser().getId());
                    if(likes.getBuy() != null){
                        dto.setBuyNo(likes.getBuy().getBuyNo());
                        dto.setTitle(likes.getBuy().getTitle());
                        dto.setNickname(likes.getBuy().getNickname());
                    }
                    else if(likes.getTeam() != null){
                        dto.setTeamNo(likes.getTeam().getTeamNo());
                        dto.setTitle(likes.getTeam().getTitle());
                        dto.setNickname(likes.getTeam().getNickname());
                    }
                    else if(likes.getMarket() != null){
                        dto.setMarketNo(likes.getMarket().getMarketNo());
                        dto.setTitle(likes.getMarket().getTitle());
                        dto.setNickname(likes.getMarket().getNickname());
                    }
                    else if(likes.getCommunity() != null){
                        dto.setCommNo(likes.getCommunity().getCommNo());
                        dto.setTitle(likes.getCommunity().getTitle());
                        dto.setNickname(likes.getCommunity().getNickname());
                    }
                    else if(likes.getShareRoom() != null){
                        dto.setRoomNo(likes.getShareRoom().getRoomNo());
                        dto.setTitle(likes.getShareRoom().getTitle());
                        User user = userRepository.findByUserId(likes.getShareRoom().getUser().getId());
                        dto.setNickname(user.getNickname());
                    }
                    return dto;
                }).collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        PageResponseDto<LikeDto> responseDto = PageResponseDto.<LikeDto>withAll()
                .dtoList(dtoList)
                .pageRequestDto(pageRequestDto)
                .totalCount(totalCount)
                .build();
        return responseDto;
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

}
