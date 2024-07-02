package com.mlp.lab.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.mlp.lab.dto.PageRequestDto;
import com.mlp.lab.dto.PageResponseDto;
import com.mlp.lab.dto.like.LikeDto;
import com.mlp.lab.dto.like.LikeRequest;
import com.mlp.lab.dto.like.LikeRoomDto;
import com.mlp.lab.service.LikeService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/like")
@RequiredArgsConstructor
public class LikeController {
    private final LikeService likeService;

    @PostMapping("/likeClick") // 좋아요 +1
    public void likeClick(@RequestBody LikeRequest likeRequest) {
        String type = likeRequest.getType();
        Long no = likeRequest.getNo();
        Long id = likeRequest.getId();
        likeService.addLike(type, no, id);
    }

    @DeleteMapping("/unlikeClick/{likeNo}") // 좋아요 -1
    public void unlikeClick(@PathVariable(name = "likeNo") Long likeNo) {
        likeService.deleteLike(likeNo);
    }

    @GetMapping("/likeInfo") // 좋아요 정보 조회
    public LikeDto likeInfo(@RequestParam String type, @RequestParam Long no, @RequestParam Long id) {
        return likeService.readLike(type, no, id);
    }


    @GetMapping("/mylike") // 내가 좋아요 누른 게시물 조회
    public PageResponseDto<LikeDto> mylike(PageRequestDto pageRequestDto, @RequestParam(required = false, value = "id") Long id) {
        return likeService.mylike(pageRequestDto, id);
    }

    /* ===============자취방쉐어=============== */

    @PostMapping("/shareRoom") // 좋아요 +1
    public void likeRoom(@RequestBody LikeRoomDto likeRoomDto) {
        likeService.addRoom(likeRoomDto);
    }

    @DeleteMapping("/shareRoom/{likeNo}") // 좋아요 -1
    public void unlikeRoom(@PathVariable(name = "likeNo") long likeNo) {
        likeService.deleteRoom(likeNo);
    }

    @DeleteMapping("/shareRoom/all/{roomNo}") // 해당 글에 찍힌 모든 좋아요 삭제
    public void deleteLikeRoom(@PathVariable(name = "roomNo") Long roomNo) {
        likeService.deleteLikeRoom(roomNo);
    }

    @GetMapping("/shareRoom") // 좋아요 정보 조회
    public LikeRoomDto likeInfoRoom(@RequestParam(value = "roomNo") Long roomNo, @RequestParam(value = "id") Long id) {
        return likeService.readRoom(roomNo, id);
    }

}
