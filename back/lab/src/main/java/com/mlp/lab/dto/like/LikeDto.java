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
    private Long id;
    private Long teamNo;
    private Long buyNo;
    private Long marketNo;
    private Long commNo;
    private Long roomNo;
    private String nickname;
    private String title;
}
