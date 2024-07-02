package com.mlp.lab.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ShareRoomDto { // 화면에서 받을 데이터
    private Long roomNo;
    private Long userId;
    private String title;
    private String content;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Seoul")
    private LocalDateTime regDate;
    private String rentFee;
    private Character parking;
    private String location;
    private String option1;
    private String roomImage;
    private String rentStartDate;
    private String rentEndDate;
    private Integer averFee;
    private Integer days;
    private boolean flag;
    private Integer roomHit;

    @Builder.Default
    private List<MultipartFile> files = new ArrayList<>(); 

    @Builder.Default
    private List<String> uploadFileNames = new ArrayList<>(); 

}