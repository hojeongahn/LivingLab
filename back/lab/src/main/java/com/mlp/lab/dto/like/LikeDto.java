package com.mlp.lab.dto.like;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LikeDto {
    private Long likeNo;
    private String type; //게시물 종류
    private Long id;
    private Long no; //게시물 번호
}
