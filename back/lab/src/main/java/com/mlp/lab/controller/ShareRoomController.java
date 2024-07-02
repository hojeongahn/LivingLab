package com.mlp.lab.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.mlp.lab.dto.ShareRoomDto;
import com.mlp.lab.dto.MyActivityDto;
import com.mlp.lab.dto.PageRequestDto;
import com.mlp.lab.dto.PageResponseDto;
import com.mlp.lab.dto.RoomPageRequestDto;
import com.mlp.lab.dto.RoomPageResponseDto;
import com.mlp.lab.service.ShareRoomService;
import com.mlp.lab.util.CustomFileUtilShareRoom;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

@Log4j2
@RestController
@RequestMapping("/api/shareRoom")
@RequiredArgsConstructor
public class ShareRoomController {
    private final ShareRoomService shareRoomService;
    private final CustomFileUtilShareRoom fileUtil;


    @GetMapping("/list")
    public RoomPageResponseDto<ShareRoomDto> List(RoomPageRequestDto roomPageRequestDto,
    @RequestParam(required = false, value = "search") String search,
    @RequestParam(required = false, value = "sort") String sort) {
        return shareRoomService.list(roomPageRequestDto,search,sort);
    }

    @DeleteMapping("/{roomNo}")
    public Map<String, String> remove(@PathVariable(name = "roomNo") Long roomNo) {
        log.info("Remove :" + roomNo);
        shareRoomService.remove(roomNo);
        return Map.of("RESULT", "SUCCESS");
    }

    @GetMapping("/read/{roomNo}")
    public ShareRoomDto read(@PathVariable(name = "roomNo") Long roomNo) {
        return shareRoomService.get(roomNo);
    }

    @GetMapping("/display/{fileName}") // 이미지 출력
    public ResponseEntity<Resource> displayImage(@PathVariable String fileName) {
        return fileUtil.getFile(fileName);
    }

    @PostMapping("/add") // 작성(이미지 포함)
    public void add(ShareRoomDto shareRoomDto) {
        List<MultipartFile> files = shareRoomDto.getFiles();
        List<String> uploadFileNames = fileUtil.saveFiles(files);
        if (uploadFileNames == null || uploadFileNames.isEmpty()) {
            shareRoomDto.setFlag(false);
        } else {
            shareRoomDto.setFlag(true);
        }
        shareRoomDto.setUploadFileNames(uploadFileNames);
        log.info("===========shareRoomDto add : " + shareRoomDto);
        shareRoomService.add(shareRoomDto);
    }

    @PutMapping("/modify/{roomNo}")
    public Map<String, String> modify(@PathVariable(name = "roomNo") Long roomNo, ShareRoomDto shareRoomDto) {
        shareRoomDto.setRoomNo(roomNo);
        ShareRoomDto oldDTO = shareRoomService.get(roomNo);
        // 기존 파일들(데이터베이스에 저장된 파일 이름)
        List<String> oldFileNames = oldDTO.getUploadFileNames();
        // 새로 업로드해야 하는 파일들
        List<MultipartFile> files = shareRoomDto.getFiles();

        // 새로 업로드된 파일 이름들
        List<String> newUploadFileNames = fileUtil.saveFiles(files);

        // 변화가 없이 유지되는 파일들
        List<String> uploadedFileNames = shareRoomDto.getUploadFileNames();

        // 유지되는 파일들 + 새로 업로드된 파일 이름들이 저장해야하는 파일 목록
        if (newUploadFileNames != null && newUploadFileNames.size() > 0) {
            uploadedFileNames.addAll(newUploadFileNames);
        }
        shareRoomService.modify(shareRoomDto);
        
        if (oldFileNames != null && oldFileNames.size() > 0) {
            List<String> removeFiles = oldFileNames
                    .stream()
                    .filter(fileName -> uploadedFileNames.indexOf(fileName) == -1).collect(Collectors.toList());
            // 파일 삭제
            fileUtil.deleteFiles(removeFiles);
        }
        return Map.of("RESULT", "SUCCESS");
    }

    @PutMapping("/hide/{roomNo}")
    public Map<String, String> hide(@PathVariable(name = "roomNo") Long roomNo, ShareRoomDto shareRoomDto) {
        shareRoomDto.setRoomNo(roomNo);

        shareRoomService.hide(shareRoomDto);
        
        return Map.of("RESULT", "SUCCESS");
    }

    @GetMapping("/latest")
    public List<ShareRoomDto> getLatestShareRoomList() {
        return shareRoomService.getLatestShareRoom();
    }

    @PutMapping("/increase/{roomNo}") // 좋아요 +1
    public void increase(@PathVariable(name = "roomNo") Long roomNo) {
        shareRoomService.increase(roomNo);
    }

    @PutMapping("/decrease/{roomNo}") // 좋아요 +1
    public void decrease(@PathVariable(name = "roomNo") Long roomNo) {
        shareRoomService.decrease(roomNo);
    }

    @GetMapping("/mylist/{id}") // 작성한 게시물 조회 (3개)
    public List<MyActivityDto> mylist(@PathVariable(name = "id") Long id) {
        return shareRoomService.mylist(id);
    }

    @GetMapping("/mylistall") // 작성한 게시물 조회 (전체)
    public PageResponseDto<ShareRoomDto> mylistall(PageRequestDto pageRequestDto, @RequestParam(required = false, value = "id") Long id) {
        return shareRoomService.mylistall(pageRequestDto, id);
    }

    
    @DeleteMapping("/like/shareRoom/{roomNo}")
    public Map<String, String> removeLike(@PathVariable(name = "roomNo") Long roomNo) {
        log.info("Remove :" + roomNo);
        shareRoomService.remove(roomNo);
        return Map.of("RESULT", "SUCCESS");
    }
}