package com.mlp.lab.util;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
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
public class CustomFileUtilBuy {

    @Value("${com.mlp.upload.path}")
    private String uploadPath;
    
    private String buyPath;

    @PostConstruct
    public void init() {
        File uploadFolder = new File(uploadPath);
        if (!uploadFolder.exists()) {
            uploadFolder.mkdir();
        }
        buyPath = uploadFolder.getAbsolutePath() + File.separator + "buy";
        File buyFolder = new File(buyPath);
        if (!buyFolder.exists()) {
            buyFolder.mkdir();
        }
    }

    public List<String> saveFiles(List<MultipartFile> files) throws RuntimeException { // 파일 저장
        if (files == null || files.size() == 0) {
            return List.of();
        }
        List<String> uploadNames = new ArrayList<>();
        for (MultipartFile multipartFile : files) {
            String savedName = UUID.randomUUID().toString() +
                    "_" + multipartFile.getOriginalFilename();
            Path savedPath = Paths.get(buyPath, savedName);
            try {
                Files.copy(multipartFile.getInputStream(), savedPath);
                uploadNames.add(savedName);
            } catch (IOException e) {
                throw new RuntimeException(e.getMessage());
            }
        }
        return uploadNames;
    }

    public ResponseEntity<Resource> getFile(String fileName) { // 업로드 파일 보여주기
        Resource resource = new FileSystemResource(buyPath + File.separator + fileName);
        if (!resource.isReadable()) {
            resource = new FileSystemResource(buyPath + File.separator + "rose.png");
        }
        HttpHeaders headers = new HttpHeaders();
        try {
            headers.add("Content-type", Files.probeContentType(resource.getFile().toPath()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
        return ResponseEntity.ok().headers(headers).body(resource);
    }

    public void deleteFiles(List<String> fileNames) { // 파일 삭제
        if (fileNames == null || fileNames.size() == 0) {
            return;
        }
        fileNames.forEach(fileName -> {
            Path filePath = Paths.get(buyPath, fileName);
            try {
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                throw new RuntimeException(e.getMessage());
            }
        });
    }
}
