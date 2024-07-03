package com.mlp.lab.dto;

import java.time.LocalDateTime;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MarketDto { // 동네장터 화면에서 받을 데이터
    private Long marketNo;
    private Long id;
    private String title;
    private String content;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Seoul")
    private LocalDateTime createdDate;
    private String deadline;
    private Character marketCategory;
    private String location;
    private double latitude;
    private double longitude;
    private Integer marketHit;
    private String nickname;
    private boolean flag; // true:마감 / false:모집중
    private Integer price;

    @Builder.Default
    private List<MultipartFile> files = new ArrayList<>(); // 서버에 저장되는 실제 파일 데이터

    @Builder.Default
    private List<String> uploadFileNames = new ArrayList<>(); // 데이터베이스에 저장될 파일 이름
}