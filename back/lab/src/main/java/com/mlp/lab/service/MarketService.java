package com.mlp.lab.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.mlp.lab.dto.BuyDto;
import com.mlp.lab.dto.MarketDto;
import com.mlp.lab.dto.PageRequestDto;
import com.mlp.lab.dto.PageResponseDto;
import com.mlp.lab.entity.Buy;
import com.mlp.lab.entity.BuyImage;
import com.mlp.lab.entity.Market;
import com.mlp.lab.entity.MarketImage;
import com.mlp.lab.repository.MarketRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MarketService {
    private final MarketRepository marketRepository;

    // 목록 가져오기(페이징 처리, 이미지 포함)
    public PageResponseDto<MarketDto> list(PageRequestDto pageRequestDto, String search, String sort) {
        Pageable pageable = PageRequest.of(
                pageRequestDto.getPage() - 1,
                pageRequestDto.getSize(),
                Sort.by("marketNo").descending());

        Page<Object[]> result = null;
        if ((search == null || search.isEmpty()) && (sort == null || sort.isEmpty())) { // 페이지 클릭 시
            result = marketRepository.selectList(pageable);
        } else if (search != null && !search.isEmpty()) { // 검색
            result = marketRepository.selectSearchList(search, pageable);
        } else if (sort != null && !sort.isEmpty()) { // 정렬
            if (sort.equals("최신순")) {
                result = marketRepository.newList(pageable);
            }
            if (sort.equals("마감임박순")) {
                result = marketRepository.deadLineList(pageable);
            }
            // if(sort.equals("거리순")){
            // result =
            // }
            // if(sort.equals("좋아요순")){
            // result =
            // }
        } else if (search != null && sort != null) { // 검색&&정렬 둘다
            if (sort.equals("최신순")) {
                result = marketRepository.searchNewList(sort, pageable);
            }
            if (sort.equals("마감임박순")) {
                result = marketRepository.searchDeadLineList(sort, pageable);
            }
            // if(sort.equals("거리순")){
            // result =
            // }
            // if(sort.equals("좋아요순")){
            // result =
            // }
        }
        List<MarketDto> dtoList = result.get().map(arr -> {
            Market market = (Market) arr[0];
            MarketImage marketImage = (MarketImage) arr[1];

            MarketDto marketDto = MarketDto.builder()
                    .marketNo(market.getMarketNo()).title(market.getTitle()).marketCategory(market.getMarketCategory())
                    .location(market.getLocation()).max(market.getMax()).current(market.getCurrent())
                    .deadline(market.getDeadline()).nickname(market.getNickname()).build();

            String imageStr = marketImage.getFileName();
            marketDto.setUploadFileNames(List.of(imageStr));
            return marketDto;
        }).collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        PageResponseDto<MarketDto> responseDTO = PageResponseDto.<MarketDto>withAll()
                .dtoList(dtoList)
                .pageRequestDto(pageRequestDto)
                .totalCount(totalCount)
                .build();
        return responseDTO;
    }

    // 동네장터 등록(이미지 포함)
    public void add(MarketDto marketDto) {
        Market market = Market.DtoToEntity(marketDto);
        marketRepository.save(market);
    }

    public MarketDto read(int marketNo) { // 동네장터 조회
        Optional<Market> result = marketRepository.findById(marketNo);
        Market market = result.orElseThrow();
        MarketDto marketDto = market.entityToDto(market);
        return marketDto;
    }

    // 삭제하기
    public void remove(int marketNo) {
        marketRepository.deleteById(marketNo);
    }

    public void modify(MarketDto marketDto) { // 수정하기
        // 조회
        Optional<Market> result = marketRepository.findById(marketDto.getMarketNo().intValue());
        Market market = result.orElseThrow();

        // 수정
        market.setTitle(marketDto.getTitle());
        market.setContent(marketDto.getContent());
        market.setLocation(marketDto.getLocation());
        market.setMarketCategory(marketDto.getMarketCategory());
        market.setDeadline(marketDto.getDeadline());

        // 파일들 삭제
        market.clearList();
        List<String> uploadFileNames = marketDto.getUploadFileNames();
        if (uploadFileNames != null && uploadFileNames.size() > 0) {
            uploadFileNames.stream().forEach(uploadName -> {
                market.addImageString(uploadName);
            });
        }
        marketRepository.save(market);
    }

    // 메인에 표기할 최신순
    public List<MarketDto> getLatestMarket() {
        Pageable pageable = PageRequest.of(0, 8, Sort.by("marketNo").descending());
        Page<Object[]> result = null;

        result = marketRepository.latestMarketList(pageable);

        List<MarketDto> dtoList = result.getContent().stream().map(arr -> {
            Market market = (Market) arr[0];
            MarketImage marketImage = (MarketImage) arr[1];

            MarketDto marketDto = MarketDto.builder()
                    .marketNo(market.getMarketNo())
                    .title(market.getTitle())
                    .marketCategory(market.getMarketCategory())
                    .location(market.getLocation())
                    .max(market.getMax())
                    .current(market.getCurrent())
                    .deadline(market.getDeadline())
                    .nickname(market.getNickname())
                    .content(market.getContent())
                    .build();

            String imageStr = marketImage.getFileName();
            marketDto.setUploadFileNames(List.of(imageStr));
            return marketDto;
        }).collect(Collectors.toList());

        return dtoList;
    }
}