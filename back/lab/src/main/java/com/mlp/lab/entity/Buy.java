package com.mlp.lab.entity;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.mlp.lab.dto.BuyDto;
import com.mlp.lab.entity.chat.ChatRoom;
import com.mlp.lab.entity.like.Likes;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Entity
@Builder // 빌터 패턴으로 객체 생성
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "buy")
@ToString(exclude = "imageList")
@EqualsAndHashCode(callSuper = false)
public class Buy extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "buy_no")
    private Long buyNo;

    @Column(name = "title")
    private String title;

    @Column(name = "content", length = 500)
    private String content;

    @Column(name = "deadline")
    private String deadline;

    @Column(name = "buy_category")
    private Character buyCategory;

    @Column(name = "max")
    private Integer max;

    @Column(name = "current")
    private Integer current;

    @Column(name = "location")
    private String location;

    @Column(name = "latitude")
    private double latitude; // 위도

    @Column(name = "longitude")
    private double longitude; // 경도

    @Column(name = "buy_hit")
    private Integer buyHit;

    @Column(name = "nickname")
    private String nickname;

    @Column(name = "flag")
    private boolean flag; // true: 마감 / false:모집중

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id", referencedColumnName = "id")
    private User user;

    @OneToMany(mappedBy = "buy", cascade = CascadeType.REMOVE) // 게시글 삭제시 좋아요 정보도 삭제
    @JsonManagedReference
    private List<Likes> likes;

    @OneToOne(fetch = FetchType.LAZY, mappedBy = "buy", cascade = CascadeType.ALL)
    private ChatRoom chatRoom;

    @ElementCollection
    @Builder.Default
    private List<BuyImage> imageList = new ArrayList<>();

    public void addImage(BuyImage image) { // 이미지 추가
        image.setOrd(this.imageList.size());
        imageList.add(image);
    }

    public void addImageString(String fileName) { // 파일 추가
        BuyImage temaImage = BuyImage.builder().fileName(fileName).build();
        addImage(temaImage);
    }

    public void clearList() {
        this.imageList.clear();
    }

    public static Buy DtoToEntity(BuyDto buyDto) { // 화면에서 받은 dto를 entity로
        ModelMapper modelMapper = new ModelMapper();
        Buy buy = modelMapper.map(buyDto, Buy.class);

        // 업로드 처리가 끝난 파일들의 이름
        List<String> uploadFileNames = buyDto.getUploadFileNames();
        if (uploadFileNames == null) {
            return buy;
        }
        uploadFileNames.stream().forEach(uploadName -> {
            buy.addImageString(uploadName);
        });
        return buy;
    }

    public static BuyDto entityToDto(Buy buy) {
        ModelMapper modelMapper = new ModelMapper();
        BuyDto buyDto = modelMapper.map(buy, BuyDto.class);

        List<BuyImage> imageList = buy.getImageList();
        if (imageList == null || imageList.size() == 0) {
            return buyDto;
        }
        List<String> fileNameList = imageList.stream().map(productImage -> productImage.getFileName()).toList();
        buyDto.setUploadFileNames(fileNameList);
        return buyDto;
    }
}
