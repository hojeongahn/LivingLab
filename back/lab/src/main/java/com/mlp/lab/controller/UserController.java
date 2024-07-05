package com.mlp.lab.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.mlp.lab.dto.LoginDto;
import com.mlp.lab.dto.ResponseDto;
import com.mlp.lab.dto.UserDto;
import com.mlp.lab.entity.User;
import com.mlp.lab.service.UserService;
import com.mlp.lab.util.CustomFileUtil;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor // 초기화 되지않은 final 필드나, @NonNull 이 붙은 필드에 대해 생성자를 생성
public class UserController {
    // final을 붙여 생성자 생성(@Autoweird 대신)
    private final UserService userService;
    private final CustomFileUtil fileUtil;

    @PostMapping("/login")
    @ResponseBody
    public User login(@RequestBody LoginDto loginDto) {
        User user = userService.findByEmail(loginDto.getEmail());
        if (user == null || (!user.getPwd().equals(loginDto.getPwd()))) {
            return null;
        }
        return user; // 로그인 정보 그대로 다 준다
    }

    @PostMapping("/join")
    public ResponseDto<Object> join(@ModelAttribute UserDto userDto, @RequestParam("file") MultipartFile file) {
        String uploadFileNames = fileUtil.saveFile(file);
        userDto.setUploadFileName(uploadFileNames);
        userService.add(userDto);
        return ResponseDto.setSuccess("회원가입 완료");
    }

    @PostMapping("/findId")
    public ResponseDto<Object> findId(@RequestBody UserDto userDto) {
        User user = userService.findId(userDto.getName(), userDto.getPhone());
        if (user == null) {
            return ResponseDto.setFailed("존재 하지 않는 회원입니다. 이름과 번호를 다시 확인해주세요");
        }
        return ResponseDto.setSuccess(user.getName() + "님의 아이디는 " + user.getEmail() + " 입니다.");
    }

    @PostMapping("/findPwd") // 인증번호 발송 클릭 시
    public ResponseDto<Object> findPwd(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        String pwd = userService.findByEmail(email).getPwd();
        return ResponseDto.setSuccessData("비밀번호", pwd);
    }

    // 회원정보 수정
    @PutMapping("/modify/{id}")
    public void modifyUser(@PathVariable(name = "id") Long id, UserDto userDto) {
        userDto.setId(id);
        Optional<User> result = userService.get(id);
        User user = result.get();
        UserDto oldDto = user.entityToDto(user);

        String oldFileName = oldDto.getUploadFileName();
        MultipartFile file = userDto.getFile();

        // 새로 업로드된 파일
        String newUploadFileName = null;
        if (file != null && !file.isEmpty()) {
            newUploadFileName = fileUtil.saveFile(file);
            userDto.setUploadFileName(newUploadFileName);
        } else {
            userDto.setUploadFileName(oldFileName);
        }

        userService.modifyUserInfo(userDto);
    }

    // 회원정보 조회
    @GetMapping("/{id}")
    @ResponseBody
    public Optional<User> get(@PathVariable(name = "id") Long id) {
        Optional<User> user = userService.get(id);
        return user;
    }

    // 이미지 파일 출력
    @GetMapping("/display/{fileName}")
    public ResponseEntity<Resource> displayImage(@PathVariable(name = "fileName") String fileName) {
        return fileUtil.getFile(fileName);
    }

    // 중복 이메일 체크
    @GetMapping("/join/checkEmail/{email}")
    public ResponseEntity<Boolean> checkEmailDuplicate(@PathVariable String email) {
        return ResponseEntity.ok(userService.checkEmailDuplicate(email));
    }

    // 중복 닉네임 체크
    @GetMapping("/join/checkNickname/{nickname}")
    public ResponseEntity<Boolean> checkNicknameDuplicate(@PathVariable String nickname) {
        return ResponseEntity.ok(userService.checkNicknameDuplicate(nickname));
    }

}