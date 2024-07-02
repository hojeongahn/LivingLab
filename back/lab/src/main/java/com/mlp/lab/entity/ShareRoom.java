package com.mlp.lab.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.mlp.lab.dto.ShareRoomDto;
import com.mlp.lab.entity.like.Likes;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Entity
@Builder // 빌터 패턴으로 객체 생성
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "shareroom")
@ToString(exclude = "imageList")
public class ShareRoom {
    @Id // 기본키 설정
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roomNo;
    private Long userId;
    private String title;
    private String content;
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

    @OneToMany(mappedBy = "shareRoom", cascade = CascadeType.REMOVE) // 게시글 삭제시 좋아요 정보도 삭제
    @JsonManagedReference
    private List<Likes> likes;

    @ElementCollection
    @Builder.Default
    private List<ShareRoomImage> imageList = new ArrayList<>();

    public void addImage(ShareRoomImage shareRoomImage) { // 이미지 추가
        shareRoomImage.setOrd(this.imageList.size());
        imageList.add(shareRoomImage);
    }

    public void addImageString(String fileName) { // 파일 추가
        ShareRoomImage shareRoomImage = ShareRoomImage.builder().fileName(fileName).build();
        addImage(shareRoomImage);
    }

    public void clearList() {
        this.imageList.clear();
    }

    public static ShareRoom DtoToEntity(ShareRoomDto shareRoomDto) { // 화면에서 받은 dto를 entity로
        ModelMapper modelMapper = new ModelMapper();
        ShareRoom shareRoom = modelMapper.map(shareRoomDto, ShareRoom.class);

        // 업로드 처리가 끝난 파일들의 이름
        List<String> uploadFileNames = shareRoomDto.getUploadFileNames();
        if (uploadFileNames == null) {
            return shareRoom;
        }
        uploadFileNames.stream().forEach(uploadName -> {
            shareRoom.addImageString(uploadName);
        });

        return shareRoom;
    }

    public static ShareRoomDto entityToDto(ShareRoom shareRoom) {
        ModelMapper modelMapper = new ModelMapper();
        ShareRoomDto shareRoomDto = modelMapper.map(shareRoom, ShareRoomDto.class);

        List<ShareRoomImage> imageList = shareRoom.getImageList();
        if (imageList == null || imageList.size() == 0) {
            return shareRoomDto;
        }
        List<String> fileNameList = imageList.stream().map(productImage -> productImage.getFileName()).toList();
        shareRoomDto.setUploadFileNames(fileNameList);
        return shareRoomDto;
    }
}