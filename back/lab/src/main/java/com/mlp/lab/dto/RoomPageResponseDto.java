package com.mlp.lab.dto;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import lombok.Builder;
import lombok.Data;

@Data
public class RoomPageResponseDto<E> {
    private List<E> dtoList;
    private List<Integer> pageNumList;
    private RoomPageRequestDto roomPageRequestDto;
    private boolean prev, next;
    private int totalCount, prevPage, nextPage, totalPage, current;

    @Builder(builderMethodName = "withAll")
    public RoomPageResponseDto(List<E> dtoList, RoomPageRequestDto roomPageRequestDto, long totalCount){
        this.dtoList = dtoList;
        this.roomPageRequestDto = roomPageRequestDto;
        this.totalCount = (int) totalCount;

        int end = (int)(Math.ceil(roomPageRequestDto.getPage()/10.0))*10;
        int start = end-9;
        int last = (int)(Math.ceil((totalCount/(double)roomPageRequestDto.getSize())));

        end  = end > last?last:end;
        this.prev = start >1;
        this.next = totalCount > end * roomPageRequestDto.getSize();
        this.pageNumList = IntStream.rangeClosed(start, end).boxed().collect(Collectors.toList());
        if(prev){
            this.prevPage = start -1;
        }
        if(next){
            this.nextPage = end+1;
        }

        this.totalPage = this.pageNumList.size();
        this.current = roomPageRequestDto.getPage();
    }
}
