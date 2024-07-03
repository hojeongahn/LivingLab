package com.mlp.lab.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.mlp.lab.dto.ResponseDto;
import com.mlp.lab.entity.User;
import com.mlp.lab.service.MailService;
import com.mlp.lab.service.UserService;

import lombok.RequiredArgsConstructor;

import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/mail")
@RequiredArgsConstructor
public class MailController {
    private final MailService mailService;
    private final UserService userService;

    @PostMapping("/send")
    @ResponseBody
    public ResponseDto<Object> mailSend(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        User user = userService.findByEmail(email);
        System.out.println("이메일 인증 요청");
        System.out.println("이메일 인증 이메일 : " + user.getEmail());
        String authNum = mailService.joinEmail(user, user.getEmail());
        return ResponseDto.setSuccessData("인증번호", authNum);
    }
}
