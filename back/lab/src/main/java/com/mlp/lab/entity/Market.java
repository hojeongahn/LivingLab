package com.mlp.lab.entity;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.mlp.lab.dto.MarketDto;
import com.mlp.lab.entity.like.Likes;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;


@Data
@Entity
@Builder //빌터 패턴으로 객체 생성
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "market")
@ToString(exclude = "imageList")
public class Market extends BaseTimeEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "market_no")
    private Long marketNo;

    @Column(name = "title")
    private String title;

    @Column(name = "content", length = 500)
    private String content;

    @Column(name = "deadline")
    private String deadline;

    @Column(name = "marketCategory")
    private Character marketCategory;

    @Column(name = "location")
    private String location;

    @Column(name = "latitude")
    private double latitude; // 위도

    @Column(name = "longitude")
    private double longitude; // 경도
    
    @Column(name = "marketHit")
    private Integer marketHit;

    @Column(name = "nickname")
    private String nickname;

    @Column(name = "flag")
    private boolean flag; // true: 마감 / false:모집중

    @Column(name = "price")
    private Integer price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id", referencedColumnName = "id")
    private User user;

    @OneToMany(mappedBy = "market", cascade = CascadeType.REMOVE) // 게시글 삭제시 좋아요 정보도 삭제
    @JsonManagedReference
    private List<Likes> likes;

    @ElementCollection
    @Builder.Default
    private List<MarketImage> imageList = new ArrayList<>();

    public void addImage(MarketImage image) { // 이미지 추가
        image.setOrd(this.imageList.size());
        imageList.add(image);
    }

    public void addImageString(String fileName) { // 파일 추가
        MarketImage temaImage = MarketImage.builder().fileName(fileName).build();
        addImage(temaImage);
    }

    public void clearList() {
        this.imageList.clear();
    }

    public static Market DtoToEntity(MarketDto marketDto) { // 화면에서 받은 dto를 entity로
        ModelMapper modelMapper = new ModelMapper();
        Market market = modelMapper.map(marketDto, Market.class);

        // 업로드 처리가 끝난 파일들의 이름
        List<String> uploadFileNames = marketDto.getUploadFileNames();
        if (uploadFileNames == null) {
            return market;
        }
        uploadFileNames.stream().forEach(uploadName -> {
            market.addImageString(uploadName);
        });

        return market;
    }

    public static MarketDto entityToDto(Market market) {
        ModelMapper modelMapper = new ModelMapper();
        MarketDto marketDto = modelMapper.map(market, MarketDto.class);

        List<MarketImage> imageList = market.getImageList();
        if (imageList == null || imageList.size() == 0) {
            return marketDto;
        }
        List<String> fileNameList = imageList.stream().map(productImage -> productImage.getFileName()).toList();
        marketDto.setUploadFileNames(fileNameList);
        return marketDto;
    }
}
