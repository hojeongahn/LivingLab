package com.mlp.lab.util;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;


@Component
@RequiredArgsConstructor
public class CustomFileUtil {

    @Value("${com.mlp.upload.path}")
    private String uploadPath;
    
    private String userPath;

    @PostConstruct
    public void init() {
        File uploadFolder = new File(uploadPath);
        if (!uploadFolder.exists()) {
            uploadFolder.mkdir();
        }
        userPath = uploadFolder.getAbsolutePath() + File.separator + "user";
        File buyFolder = new File(userPath);
        if (!buyFolder.exists()) {
            buyFolder.mkdir();
        }
    }

    public String saveFile(MultipartFile file) throws RuntimeException { // 단일 파일 저장
        if (file == null || file.isEmpty()) {
            return null;
        }
        
        String savedName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path savedPath = Paths.get(uploadPath, savedName);
        
        try {
            Files.copy(file.getInputStream(), savedPath);
        } catch (IOException e) {
            throw new RuntimeException(e.getMessage());
        }
        
        return savedName;
    }

    public ResponseEntity<Resource> getFile(String fileName) { // 업로드 파일 보여주기
        Resource resource = new FileSystemResource(uploadPath + File.separator + fileName);
        if (!resource.isReadable()) {
            resource = new FileSystemResource(uploadPath + File.separator + "rose.png");
        }
        HttpHeaders headers = new HttpHeaders();
        try {
            headers.add("Content-type", Files.probeContentType(resource.getFile().toPath()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
        return ResponseEntity.ok().headers(headers).body(resource);
    }

    public void deleteFile(String fileName) { // 파일 삭제
        Path filePath = Paths.get(userPath, fileName);
        try {
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    public String updateFile(String fileName, MultipartFile newFile) throws RuntimeException {
        // 기존 파일 삭제
        deleteFile(fileName);
        
        // 새 파일 저장
        return saveFile(newFile);
    }
}
