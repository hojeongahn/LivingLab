package com.mlp.lab.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.mlp.lab.dto.like.LikeDto;
import com.mlp.lab.dto.like.LikeRoomDto;
import com.mlp.lab.service.LikeService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/like")
@RequiredArgsConstructor
public class LikeController {
    private final LikeService likeService;

    /* ===============공동구매=============== */

    @PostMapping("/likeClick") // 좋아요 +1
    public void likeClick(@RequestBody LikeDto likeDto) {
        String type = likeDto.getType();
        Long no = likeDto.getNo();
        Long id = likeDto.getId();
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


    /* ===============동네장터=============== */

    @PostMapping("/market") // 좋아요 +1
    public void likeMarket(@RequestBody LikeDto likeDto) {
        likeService.addMarket(likeDto);
    }

    @DeleteMapping("/market/{likeNo}") // 좋아요 -1
    public void unlikeMarket(@PathVariable(name = "likeNo") Long likeNo) {
        likeService.deleteMarket(likeNo);
    }

    @GetMapping("/market") // 좋아요 정보 조회
    public LikeDto likeInfoMarket(@RequestParam(value = "marketNo") Long marketNo,
            @RequestParam(value = "id") Long id) {
        return likeService.readMarket(marketNo, id);
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

    /* ===============커뮤니티=============== */

    @PostMapping("/comm") // 좋아요 +1
    public void likeComm(@RequestBody LikeDto likeDto) {
        likeService.addComm(likeDto);
    }
    
    @DeleteMapping("/comm/{likeNo}") // 좋아요 -1
    public void unlikeComm(@PathVariable(name = "likeNo") Long likeNo) {
        likeService.deleteComm(likeNo);
    }
    
    @GetMapping("/comm") // 좋아요 정보 조회
    public LikeDto likeInfoComm(@RequestParam(value = "commNo") Long commNo, @RequestParam(value = "id") Long id) {
        return likeService.readComm(commNo, id);
    }

}
