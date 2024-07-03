package com.mlp.lab.entity;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.mlp.lab.dto.TeamDto;
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
@Builder //빌터 패턴으로 객체 생성
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "team")
@ToString(exclude = "imageList")
@EqualsAndHashCode(callSuper = false)
public class Team extends BaseTimeEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "team_no")
    private Long teamNo;

    @Column(name = "title", length = 50)
    private String title;

    @Column(name = "content", length = 500)
    private String content;

    @Column(name = "deadline")
    private String deadline;

    @Column(name = "team_Category")
    private Character teamCategory;

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

    @Column(name = "team_Hit")
    private Integer teamHit;

    @Column(name = "nickname")
    private String nickname;

    @Column(name = "flag")
    private boolean flag; // true: 마감 / false:모집중

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id", referencedColumnName = "id")
    private User user;

    @OneToMany(mappedBy = "team", cascade = CascadeType.REMOVE) // 게시글 삭제시 좋아요 정보도 삭제
    @JsonManagedReference
    private List<Likes> likes;

    @ElementCollection
    @Builder.Default
    private List<TeamImage> imageList = new ArrayList<>();

    public void addImage(TeamImage image) { // 이미지 추가
        image.setOrd(this.imageList.size());
        imageList.add(image);
    }

    public void addImageString(String fileName) { // 파일 추가
        TeamImage temaImage = TeamImage.builder().fileName(fileName).build();
        addImage(temaImage);
    }

    public void clearList() {
        this.imageList.clear();
    }

    public static Team DtoToEntity(TeamDto teamDto) { // 화면에서 받은 dto를 entity로
        ModelMapper modelMapper = new ModelMapper();
        Team team = modelMapper.map(teamDto, Team.class);

        // 업로드 처리가 끝난 파일들의 이름
        List<String> uploadFileNames = teamDto.getUploadFileNames();
        if (uploadFileNames == null) {
            return team;
        }
        uploadFileNames.stream().forEach(uploadName -> {
            team.addImageString(uploadName);
        });

        return team;
    }

    public static TeamDto entityToDto(Team team) {
        ModelMapper modelMapper = new ModelMapper();
        TeamDto teamDto = modelMapper.map(team, TeamDto.class);

        List<TeamImage> imageList = team.getImageList();
        if (imageList == null || imageList.size() == 0) {
            return teamDto;
        }
        List<String> fileNameList = imageList.stream().map(productImage -> productImage.getFileName()).toList();
        teamDto.setUploadFileNames(fileNameList);
        return teamDto;
    }
}
