package com.mlp.lab.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

import com.mlp.lab.dto.ReplyDto;
import com.mlp.lab.service.ReplyService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PutMapping;


@RestController
@RequestMapping("/api/reply")
@RequiredArgsConstructor
public class ReplyController {
    private final ReplyService replyService;

    @PostMapping("/add")
    public void addReply(@RequestBody ReplyDto replyDto) {
        replyService.addReply(replyDto);
    }

    @DeleteMapping("/{replyNo}")
    public void deleteReply(@PathVariable(name = "replyNo") Long replyNo) {
        replyService.deleteReply(replyNo);
    }

    @GetMapping("/{commNo}")
    public List<ReplyDto> getList(@PathVariable(name = "commNo") Long commNo) {
        return replyService.list(commNo);
    }
    
    @PutMapping("/{replyNo}")
    public void modifyReply(@PathVariable(name = "replyNo") Long replyNo, @RequestBody ReplyDto replyDto) {
        replyService.modify(replyNo, replyDto);
    }

    @GetMapping("/mylist/{id}")
    public List<ReplyDto> myList(@PathVariable(name = "id") Long id) {
        return replyService.mylist(id);
    }
}
