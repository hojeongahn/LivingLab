package com.mlp.lab.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mlp.lab.dto.ReplyDto;
import com.mlp.lab.entity.Community;
import com.mlp.lab.entity.Reply;
import com.mlp.lab.entity.User;
import com.mlp.lab.repository.CommunityRepository;
import com.mlp.lab.repository.ReplyRepository;
import com.mlp.lab.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ReplyService {
    private final ModelMapper modelMapper;
    private final ReplyRepository replyRepository;
    private final CommunityRepository communityRepository;
    private final UserRepository userRepository;

    public void addReply(ReplyDto replyDto){
        Reply reply = modelMapper.map(replyDto, Reply.class);
        reply.setRegDate(LocalDateTime.now());
        replyRepository.save(reply);
    }

    public void deleteReply(Long replyNo) {
        replyRepository.deleteById(replyNo);
    }

    public List<ReplyDto> list(Long commNo) {
        Community community = communityRepository.findById(commNo).orElseThrow(
            () -> new IllegalArgumentException("커뮤니티 아이디가 존재하지 않습니다")
        );
        List<Reply> replies = replyRepository.findByCommunity(community);
        return replies.stream().map(reply -> modelMapper.map(reply, ReplyDto.class)).collect(Collectors.toList());

    }

    public void modify(Long replyNo, ReplyDto replyDto) {
        String editReply = replyDto.getContent();
        replyRepository.modify(replyNo, editReply);
    }

    public List<ReplyDto> mylist(Long id) {
        User user = userRepository.findByUserId(id);
        List<Reply> replies = replyRepository.findByUser(user);
        return replies.stream().map(reply -> modelMapper.map(reply, ReplyDto.class)).collect(Collectors.toList());
    }
}
