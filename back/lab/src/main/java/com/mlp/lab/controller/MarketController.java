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

import com.mlp.lab.dto.PageRequestDto;
import com.mlp.lab.dto.PageResponseDto;
import com.mlp.lab.dto.MarketDto;
import com.mlp.lab.dto.MyActivityDto;
import com.mlp.lab.service.MarketService;
import com.mlp.lab.util.CustomFileUtilMarket;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/market")
@RequiredArgsConstructor
public class MarketController {
    private final MarketService marketService;
    private final CustomFileUtilMarket fileUtil;

    @GetMapping("/list") // 목록조회(검색기능 포함)
    public PageResponseDto<MarketDto> List(PageRequestDto pageRequestDto,
            @RequestParam(required = false, value = "search") String search,
            @RequestParam(required = false, value = "sort") String sort,
            @RequestParam(required = false, value = "category") Character category,
            @RequestParam(required = false, value = "latitude") double latitude,
            @RequestParam(required = false, value = "longitude") double longitude) {
        return marketService.list(pageRequestDto, search, sort, category, latitude, longitude);
    }

    @GetMapping("/read/{marketNo}") // 상세조회
    public MarketDto read(@PathVariable(name = "marketNo") int marketNo) {
        return marketService.read(marketNo);
    }

    // 글 삭제 (이미지 포함)
    @DeleteMapping("/delete/{marketNo}")
    public void delete(@PathVariable(name = "marketNo") int marketNo) {
        List<String> uploadFileNames = marketService.read(marketNo).getUploadFileNames();
        if (uploadFileNames != null && uploadFileNames.size() > 0) {
            fileUtil.deleteFiles(uploadFileNames);
        }
        marketService.delete(marketNo);
    }

    @GetMapping("/display/{fileName}") // 목록조회
    public ResponseEntity<Resource> displayImage(@PathVariable(name = "fileName") String fileName) {
        return fileUtil.getFile(fileName);
    }

    @PostMapping("/add") // 작성
    public void add(MarketDto marketDto) {
        List<MultipartFile> files = marketDto.getFiles();
        List<String> uploadFileNames = fileUtil.saveFiles(files);
        marketDto.setUploadFileNames(uploadFileNames);
        marketService.add(marketDto);
    }

    @PutMapping("/modify/{marketNo}") // 수정
    public void modify(@PathVariable(name = "marketNo") Long marketNo, MarketDto marketDto) {
        marketDto.setMarketNo(marketNo);
        MarketDto oldDto = marketService.read(marketNo.intValue());

        // 기존 파일들(데이터베이스에 저장된 파일 이름)
        List<String> oldFileNames = oldDto.getUploadFileNames();

        // 새로 업로드해야 하는 파일들
        List<MultipartFile> files = marketDto.getFiles();

        // 새로 업로드된 파일 이름들
        List<String> newUploadFileNames = fileUtil.saveFiles(files);

        // 변화가 없이 유지되는 파일들
        List<String> uploadedFileNames = marketDto.getUploadFileNames();

        // 유지되는 파일들 + 새로 업로드된 파일 이름들이 저장해야하는 파일 목록
        if (newUploadFileNames != null && newUploadFileNames.size() > 0) {
            uploadedFileNames.addAll(newUploadFileNames);
        }

        marketService.modify(marketDto);

        if (oldFileNames != null && oldFileNames.size() > 0) {
            List<String> removeFiles = oldFileNames
                    .stream()
                    .filter(fileName -> uploadedFileNames.indexOf(fileName) == -1).collect(Collectors.toList());
            // 파일 삭제
            fileUtil.deleteFiles(removeFiles);
        }
    }

    @GetMapping("/latest")
    public List<MarketDto> getLatestMarketList() {
        return marketService.getLatestMarket();
    }

    @PutMapping("/increase/{marketNo}") // 좋아요 +1
    public void increase(@PathVariable(name = "marketNo") Long marketNo) {
        marketService.increase(marketNo);
    }

    @PutMapping("/decrease/{marketNo}") // 좋아요 +1
    public void decrease(@PathVariable(name = "marketNo") Long marketNo) {
        marketService.decrease(marketNo);
    }

    @GetMapping("/mylist/{id}") // 작성한 게시물 조회 (3개)
    public List<MyActivityDto> mylist(@PathVariable(name = "id") Long id) {
        return marketService.mylist(id);
    }

    @GetMapping("/mylistall") // 작성한 게시물 조회 (전체)
    public PageResponseDto<MarketDto> mylistall(PageRequestDto pageRequestDto, @RequestParam(required = false, value = "id") Long id) {
        return marketService.mylistall(pageRequestDto, id);
    }

    // 마감 전환
    @PostMapping("/updateFlag")
    public ResponseEntity<String> updateFlag(@RequestBody MarketDto marketDto) {
        marketService.updateFlag(marketDto.getMarketNo(), marketDto.isFlag());
        return ResponseEntity.ok("Flag updated successfully");
    }
}