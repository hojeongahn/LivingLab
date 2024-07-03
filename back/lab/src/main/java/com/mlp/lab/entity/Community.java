package com.mlp.lab.entity;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.mlp.lab.dto.CommunityDto;
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
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "community")
@ToString(exclude = "imageList")
@EqualsAndHashCode(callSuper = false)
public class Community extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comm_no")
    private Long commNo;

    @Column(name = "type")
    private Character type;

    @Column(name = "title")
    private String title;

    @Column(name = "content", length = 500)
    private String content;

    @Column(name = "commHit")
    private Integer commHit;

    @Column(name = "commCategory")
    private Character commCategory; //0:기타, 1:부동산, 2:인테리어, 3:할인정보, 4:기타

    @Column(name = "nickname")
    private String nickname;

    @Column(name = "flag")
    private boolean flag; // true: 사진있음 / false:사진없음

    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id", referencedColumnName = "id")
    private User user;

    @OneToMany(mappedBy = "community", cascade = CascadeType.REMOVE)
    @JsonManagedReference
    private List<Reply> replies;

    @OneToMany(mappedBy = "community", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Likes> likes;

    @ElementCollection
    @Builder.Default
    private List<CommunityImage> imageList = new ArrayList<>();

    public void addImage(CommunityImage image) { // 이미지 추가
        image.setOrd(this.imageList.size());
        imageList.add(image);
    }

    public void addImageString(String fileName) { // 파일 추가
        CommunityImage communityImage = CommunityImage.builder().fileName(fileName).build();
        addImage(communityImage);
    }

    public void clearList() {
        this.imageList.clear();
    }

    public static Community DtoToEntity(CommunityDto communityDto) { // 화면에서 받은 dto를 entity로
        ModelMapper modelMapper = new ModelMapper();
        Community community = modelMapper.map(communityDto, Community.class);

        // 업로드 처리가 끝난 파일들의 이름
        List<String> uploadFileNames = communityDto.getUploadFileNames();
        if (uploadFileNames == null) {
            return community;
        }
        uploadFileNames.stream().forEach(uploadName -> {
            community.addImageString(uploadName);
        });

        return community;
    }

    public static CommunityDto entityToDto(Community community) {
        ModelMapper modelMapper = new ModelMapper();
        CommunityDto communityDto = modelMapper.map(community, CommunityDto.class);

        List<CommunityImage> imageList = community.getImageList();
        if (imageList == null || imageList.size() == 0) {
            return communityDto;
        }
        List<String> fileNameList = imageList.stream().map(productImage -> productImage.getFileName()).toList();
        communityDto.setUploadFileNames(fileNameList);
        return communityDto;
    }

}
