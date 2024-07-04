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
public class CommunityDto {
    private Long commNo;
    private Long id;
    private Character type;
    private String title;
    private String content;
    private Integer commHit;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Seoul")
    private LocalDateTime createdDate;
    private Character commCategory; //0:기타, 1:부동산, 2:인테리어, 3:할인정보
    private String nickname;
    private boolean flag; //해당 글에 사진 데이터 여부 확인

    @Builder.Default
    private List<MultipartFile> files = new ArrayList<>(); //서버에 저장되는 실제 파일 데이터
    @Builder.Default
    private List<String> uploadFileNames = new ArrayList<>(); //데이터베이스에 저장될 파일 이름  
}
