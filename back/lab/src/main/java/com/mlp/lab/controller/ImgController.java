package com.mlp.lab.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.mlp.lab.entity.User;
import com.mlp.lab.service.ImgService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class ImgController {
  private final ImgService imgService;

  // 사진 변경 컨트롤러
  @PostMapping("/modify/updateImg")
  public ResponseEntity<String> handleFileUpload(@RequestParam("file") MultipartFile file,
      @RequestParam("email") String email) {
    // String fileName = file.getOriginalFilename();
    // String contentType = file.getContentType();

    try {
      imgService.updateUserImg(email, file);
      return ResponseEntity.ok("User information updated successfully");
    } catch (Exception e) {
      return ResponseEntity.badRequest().body("Failed to update user information: " + e.getMessage());
    }
  }

  // 유저 사진 정보 컨트롤러
  @GetMapping("/userProfileImage")
  public ResponseEntity<byte[]> getUserProfileImage(@RequestParam("email") String email) {

    try {
      // 유저의 프로필 이미지(바이트 배열)
      byte[] imageBytes = imgService.getUserProfileImage(email);

      if (imageBytes != null && imageBytes.length > 0) {
        // 이미지 바이트 배열을 바로 응답으로 전송
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG); // 이미지의 MIME 타입 설정
        return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK); // HTTP 본문 데이터, 헤더 응답 생성
      } else {
        // 이미지가 없는 경우 Not Found로 응답
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
    } catch (Exception e) {
      // 오류 발생 시 에러 응답
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 이미지 삭제 컨트롤러
  @PutMapping("/modify/userProfileImageDelete")
  public ResponseEntity<String> deleteUserImg(@RequestBody User user) {
    // Long id = user.getId();
    String email = user.getEmail();
    imgService.deleteUserImg(email);
    return ResponseEntity.ok("이미지 삭제 성공");
  }

}
