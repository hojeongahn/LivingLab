package com.mlp.lab.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.mlp.lab.dto.MarketDto;
import com.mlp.lab.dto.MyActivityDto;
import com.mlp.lab.dto.PageRequestDto;
import com.mlp.lab.dto.PageResponseDto;
import com.mlp.lab.dto.TeamDto;
import com.mlp.lab.entity.Team;
import com.mlp.lab.service.TeamService;
import com.mlp.lab.util.CustomFileUtilTeam;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/team")
@RequiredArgsConstructor
public class TeamController {
    private final TeamService teamService;
    private final CustomFileUtilTeam fileUtil;

    @GetMapping("/list") // 목록조회(검색기능 포함)
    public PageResponseDto<TeamDto> list(PageRequestDto pageRequestDto,
            @RequestParam(required = false, value = "search") String search,
            @RequestParam(required = false, value = "sort") String sort,
            @RequestParam(required = false, value = "category") Character category,
            @RequestParam(required = false, value = "latitude") double latitude,
            @RequestParam(required = false, value = "longitude") double longitude) {
        return teamService.list(pageRequestDto, search, sort, category, latitude, longitude);
    }

    @GetMapping("/read/{teamNo}") // 상세조회
    public TeamDto read(@PathVariable(name = "teamNo") int teamNo) {
        return teamService.read(teamNo);
    }

    // 글 삭제 (이미지 포함)
    @DeleteMapping("/delete/{teamNo}")
    public void delete(@PathVariable(name = "teamNo") Long teamNo) {
        List<String> uploadFileNames = teamService.read(teamNo.intValue()).getUploadFileNames();
        if (uploadFileNames != null && uploadFileNames.size() > 0) {
            fileUtil.deleteFiles(uploadFileNames);
        }
        teamService.delete(teamNo);
    }

    @GetMapping("/display/{fileName}") // 목록조회
    public ResponseEntity<Resource> displayImage(@PathVariable(name = "fileName") String fileName) {
        return fileUtil.getFile(fileName);
    }

    @PostMapping("/add") // 작성
    public Team add(TeamDto teamDto) {
        List<MultipartFile> files = teamDto.getFiles();
        List<String> uploadFileNames = fileUtil.saveFiles(files);
        teamDto.setUploadFileNames(uploadFileNames);
        return teamService.add(teamDto);
    }

    @PutMapping("/modify/{teamNo}") // 수정
    public void modify(@PathVariable(name = "teamNo") Long teamNo, TeamDto teamDto) {
        teamDto.setTeamNo(teamNo);
        TeamDto oldDto = teamService.read(teamNo.intValue());

        // 기존 파일들(데이터베이스에 저장된 파일 이름)
        List<String> oldFileNames = oldDto.getUploadFileNames();

        // 새로 업로드해야 하는 파일들
        List<MultipartFile> files = teamDto.getFiles();

        // 새로 업로드된 파일 이름들
        List<String> newUploadFileNames = fileUtil.saveFiles(files);

        // 변화가 없이 유지되는 파일들
        List<String> uploadedFileNames = teamDto.getUploadFileNames();

        // 유지되는 파일들 + 새로 업로드된 파일 이름들이 저장해야하는 파일 목록
        if (newUploadFileNames != null && newUploadFileNames.size() > 0) {
            uploadedFileNames.addAll(newUploadFileNames);
        }

        teamService.modify(teamDto);

        if (oldFileNames != null && oldFileNames.size() > 0) {
            List<String> removeFiles = oldFileNames
                    .stream()
                    .filter(fileName -> uploadedFileNames.indexOf(fileName) == -1).collect(Collectors.toList());
            // 파일 삭제
            fileUtil.deleteFiles(removeFiles);
        }
    }

    @GetMapping("/latest")
    public List<TeamDto> getLatestTeamList() {
        return teamService.getLatestTeam();
    }

    @PutMapping("/increase/{teamNo}") // 좋아요 +1
    public void increase(@PathVariable(name = "teamNo") Long teamNo) {
        teamService.increase(teamNo);
    }

    @PutMapping("/decrease/{teamNo}") // 좋아요 +1
    public void decrease(@PathVariable(name = "teamNo") Long teamNo) {
        teamService.decrease(teamNo);
    }

    @GetMapping("/mylist/{id}") // 작성한 게시물 조회 (3개)
    public List<MyActivityDto> mylist(@PathVariable(name = "id") Long id) {
        return teamService.mylist(id);
    }

    @GetMapping("/mylistall") // 작성한 게시물 조회 (전체)
    public PageResponseDto<TeamDto> mylistall(PageRequestDto pageRequestDto, @RequestParam(required = false, value = "id") Long id) {
        return teamService.mylistall(pageRequestDto, id);
    }

    // 마감 전환
    @PostMapping("/updateFlag")
    public ResponseEntity<String> updateFlag(@RequestBody TeamDto teamDto) {
        teamService.updateFlag(teamDto.getTeamNo(), teamDto.isFlag());
        return ResponseEntity.ok("Flag updated successfully");
    }
}