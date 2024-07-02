package com.mlp.lab.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mlp.lab.dto.TeamDto;
import com.mlp.lab.dto.MyActivityDto;
import com.mlp.lab.dto.PageRequestDto;
import com.mlp.lab.dto.PageResponseDto;
import com.mlp.lab.entity.Team;
import com.mlp.lab.entity.TeamImage;
import com.mlp.lab.repository.TeamRepository;
import com.mlp.lab.repository.UserRepository;
import com.mlp.lab.repository.chat.ChatRoomRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeamService {
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final ChatRoomRepository chatRoomRepository;

    // 목록 가져오기(페이징 처리, 이미지 포함)
    public PageResponseDto<TeamDto> list(PageRequestDto pageRequestDto, String search, String sort, Character category,
            double latitude,
            double longitude) {
        Pageable pageable = PageRequest.of(
                pageRequestDto.getPage() - 1,
                pageRequestDto.getSize(),
                Sort.by("teamNo").descending());

        Page<Object[]> result = null;

        if (category != null && (search != null && !search.isEmpty())) { // 카테고리와 검색 조건이 모두 지정된 경우
            if (sort != null && !sort.isEmpty()) {
                if (sort.equals("최신순")) {
                    result = teamRepository.selectCategorySearchNewList(category, search, pageable);
                } else if (sort.equals("마감임박순")) {
                    result = teamRepository.selectCategorySearchDeadlineList(category, search, pageable);
                } else if (sort.equals("거리순")) {
                    result = teamRepository.selectCategorySearchDistanceList(category, search, latitude, longitude, pageable);
                } else if (sort.equals("좋아요순")) {
                    result = teamRepository.selectCategorySearchLikeList(category, search, pageable);
                }
            } else {
            result = teamRepository.selectCategorySearchList(category, search, pageable);
            }
        } else if (category != null) { // 카테고리만 지정된 경우
            if (sort != null && !sort.isEmpty()) {
                if (sort.equals("최신순")) {
                    result = teamRepository.selectCategoryNewList(category, pageable);
                } else if (sort.equals("마감임박순")) {
                    result = teamRepository.selectCategoryDeadlineList(category, pageable);
                } else if (sort.equals("거리순")) {
                    result = teamRepository.selectCategoryDistanceList(category, latitude, longitude, pageable);
                } else if (sort.equals("좋아요순")) {
                    result = teamRepository.selectCategoryLikeList(category, pageable);
                }
            } else {
                result = teamRepository.selectCategoryList(category, pageable);
            }
        } else if ((search == null || search.isEmpty()) && (sort == null || sort.isEmpty())) { // 페이지 클릭 시
            result = teamRepository.selectList(pageable);
        } else if ((search != null && !search.isEmpty()) && (sort == null || sort.isEmpty())) { // 검색
            result = teamRepository.selectSearchList(search, pageable);
        } else if ((sort != null && !sort.isEmpty()) && (search == null || search.isEmpty())) { // 정렬
            if (sort.equals("최신순")) {
                result = teamRepository.newList(pageable);
            }
            if (sort.equals("마감임박순")) {
                result = teamRepository.deadLineList(pageable);
            }
            if (sort.equals("거리순")) {
                result = teamRepository.distanceList(latitude, longitude, pageable);
            }
            if (sort.equals("좋아요순")) {
                result = teamRepository.likeList(pageable);
            }
        } else if (search != null && sort != null) { // 검색&&정렬 둘다
            if (sort.equals("최신순")) {
                result = teamRepository.searchNewList(search, pageable);
            }
            if (sort.equals("마감임박순")) {
                result = teamRepository.searchDeadLineList(search, pageable);
            }
            if (sort.equals("거리순")) {
                result = teamRepository.searchDistanceList(search, latitude, longitude, pageable);
            }
            if (sort.equals("좋아요순")) {
                result = teamRepository.searchLikeList(search, pageable);
            }
        }

        List<TeamDto> dtoList = result.get().map(arr -> {
            Team team = (Team) arr[0];
            TeamImage teamImage = (TeamImage) arr[1];
            String defaultImageStr = "default.png"; // 기본 이미지 파일명 설정

            TeamDto teamDto = TeamDto.builder()
                    .teamNo(team.getTeamNo()).title(team.getTitle()).teamCategory(team.getTeamCategory())
                    .location(team.getLocation()).max(team.getMax()).current(team.getCurrent())
                    .deadline(team.getDeadline()).nickname(team.getNickname()).teamHit(team.getTeamHit()).build();

            if (teamImage != null) {
                String imageStr = teamImage.getFileName();
                teamDto.setUploadFileNames(List.of(imageStr));
            } else {
                teamDto.setUploadFileNames(List.of(defaultImageStr));
            }
            return teamDto;
        }).collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        PageResponseDto<TeamDto> responseDTO = PageResponseDto.<TeamDto>withAll()
                .dtoList(dtoList)
                .pageRequestDto(pageRequestDto)
                .totalCount(totalCount)
                .build();
        return responseDTO;
    }

    public Team add(TeamDto teamDto) { // 동네모임 등록(이미지 포함)
        Team team = Team.DtoToEntity(teamDto);
        team.setUser(userRepository.findByUserId(teamDto.getId()));
        teamRepository.save(team);
        return team;
    }

    public TeamDto read(int teamNo) { // 동네모임 조회
        Optional<Team> result = teamRepository.findById(teamNo);
        Team team = result.orElseThrow();
        TeamDto teamDto = team.entityToDto(team);
        teamDto.setId(team.getUser().getId());
        return teamDto;
    }

    public Team get(Long teamNo) {
        Team team = teamRepository.findByTeamNo(teamNo);
        return team;
    }

    @Transactional
    public void delete(Long teamNo) { // 삭제하기
        chatRoomRepository.updateTeamRoom(teamNo);
        teamRepository.deleteById(teamNo.intValue());
    }

    public void modify(TeamDto teamDto) { // 수정하기
        // 조회
        Optional<Team> result = teamRepository.findById(teamDto.getTeamNo().intValue());
        Team team = result.orElseThrow();

        // 수정
        team.setTitle(teamDto.getTitle());
        team.setContent(teamDto.getContent());
        team.setLocation(teamDto.getLocation());
        team.setLatitude(teamDto.getLatitude());
        team.setLongitude(teamDto.getLongitude());
        team.setTeamCategory(teamDto.getTeamCategory());
        team.setDeadline(teamDto.getDeadline());

        // 파일들 삭제
        team.clearList();
        List<String> uploadFileNames = teamDto.getUploadFileNames();
        if (uploadFileNames != null && uploadFileNames.size() > 0) {
            uploadFileNames.stream().forEach(uploadName -> {
                team.addImageString(uploadName);
            });
        }
        teamRepository.save(team);
    }

    public List<TeamDto> getLatestTeam() {
        Pageable pageable = PageRequest.of(0, 4, Sort.by("teamNo").descending());
        Page<Object[]> result = null;

        result = teamRepository.latestTeamList(pageable);

        List<TeamDto> dtoList = result.getContent().stream().map(arr -> {
            Team team = (Team) arr[0];
            TeamImage teamImage = (TeamImage) arr[1];

            TeamDto teamDto = TeamDto.builder()
                    .teamNo(team.getTeamNo())
                    .title(team.getTitle())
                    .teamCategory(team.getTeamCategory())
                    .location(team.getLocation())
                    .max(team.getMax())
                    .current(team.getCurrent())
                    .deadline(team.getDeadline())
                    .nickname(team.getNickname())
                    .content(team.getContent())
                    .build();

            String imageStr = teamImage.getFileName();
            teamDto.setUploadFileNames(List.of(imageStr));
            return teamDto;
        }).collect(Collectors.toList());

        return dtoList;
    }

    public void increase(Long teamNo) { // 좋아요 +1
        Optional<Team> result = teamRepository.findById(teamNo.intValue());
        Team team = result.orElseThrow();
        team.setTeamHit(team.getTeamHit() + 1);
        teamRepository.save(team);
    }

    public void decrease(Long teamNo) { // 좋아요 -1
        Optional<Team> result = teamRepository.findById(teamNo.intValue());
        Team team = result.orElseThrow();
        team.setTeamHit(team.getTeamHit() - 1);
        teamRepository.save(team);
    }

    public List<MyActivityDto> mylist(Long id) {
        PageRequest pageRequest = PageRequest.of(0, 3);
        Page<Team> result = teamRepository.findByUser(id, pageRequest);

        List<MyActivityDto> dtoList = result.getContent().stream().map(team -> {
            MyActivityDto dto = new MyActivityDto();
            dto.setCategory(team.getTeamCategory());
            dto.setRegDate(team.getCreatedDate());
            dto.setTitle(team.getTitle());
            dto.setNo(team.getTeamNo());
            return dto;
        }).collect(Collectors.toList());

        return dtoList;
    }

    public PageResponseDto<TeamDto> mylistall(PageRequestDto pageRequestDto, Long id) {
        Pageable pageable = PageRequest.of(
                pageRequestDto.getPage() - 1,
                pageRequestDto.getSize(),
                Sort.by("teamNo").descending());
        Page<Object[]> result = teamRepository.findAllByUser(id, pageable);

        List<TeamDto> dtoList = result.get().map(arr -> {
            Team team = (Team) arr[0];
            TeamImage teamImage = (TeamImage) arr[1];
            String defaultImageStr = "default.png";// 기본 이미지 파일명 설정

            TeamDto teamDto = TeamDto.builder()
                    .teamNo(team.getTeamNo()).title(team.getTitle()).teamCategory(team.getTeamCategory())
                    .location(team.getLocation()).max(team.getMax()).current(team.getCurrent())
                    .deadline(team.getDeadline()).nickname(team.getNickname()).teamHit(team.getTeamHit()).build();

            if (teamImage != null) {
                String imageStr = teamImage.getFileName();
                teamDto.setUploadFileNames(List.of(imageStr));
            } else {
                teamDto.setUploadFileNames(List.of(defaultImageStr));
            }
            return teamDto;
        }).collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        PageResponseDto<TeamDto> responseDTO = PageResponseDto.<TeamDto>withAll()
                .dtoList(dtoList)
                .pageRequestDto(pageRequestDto)
                .totalCount(totalCount)
                .build();

        return responseDTO;
    }

    // 마감 전환
    public void updateFlag(Long teamNo, boolean flag) {
        Team team = teamRepository.findById(teamNo.intValue())
                .orElseThrow(() -> new IllegalArgumentException("Invalid team No: " + teamNo));
        team.setFlag(flag);
        teamRepository.save(team);
    }
}