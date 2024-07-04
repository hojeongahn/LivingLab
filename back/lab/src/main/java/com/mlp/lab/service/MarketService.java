package com.mlp.lab.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mlp.lab.dto.PageRequestDto;
import com.mlp.lab.dto.PageResponseDto;
import com.mlp.lab.dto.MarketDto;
import com.mlp.lab.dto.MyActivityDto;
import com.mlp.lab.entity.Market;
import com.mlp.lab.entity.MarketImage;
import com.mlp.lab.repository.MarketRepository;
import com.mlp.lab.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MarketService {
    private final MarketRepository marketRepository;
    private final UserRepository userRepository;

    // 목록 가져오기(페이징 처리, 이미지 포함)
    public PageResponseDto<MarketDto> list(PageRequestDto pageRequestDto, String search, String sort,
            Character category, double latitude, double longitude) {
        Pageable pageable = PageRequest.of(
                pageRequestDto.getPage() - 1,
                pageRequestDto.getSize(),
                Sort.by("marketNo").descending());

        Page<Object[]> result = null;

        if (category != null && (search != null && !search.isEmpty())) { // 카테고리와 검색 조건이 모두 지정된 경우
            if (sort != null && !sort.isEmpty()) {
                if (sort.equals("최신순")) {
                    result = marketRepository.selectCategorySearchNewList(category, search, pageable);
                } else if (sort.equals("마감임박순")) {
                    result = marketRepository.selectCategorySearchDeadlineList(category, search, pageable);
                } else if (sort.equals("거리순")) {
                    result = marketRepository.selectCategorySearchDistanceList(category, search, latitude, longitude, pageable);
                } else if (sort.equals("좋아요순")) {
                    result = marketRepository.selectCategorySearchLikeList(category, search, pageable);
                }
            } else {
            result = marketRepository.selectCategorySearchList(category, search, pageable);
            }
        } else if (category != null) { // 카테고리만 지정된 경우
            if (sort != null && !sort.isEmpty()) {
                if (sort.equals("최신순")) {
                    result = marketRepository.selectCategoryNewList(category, pageable);
                } else if (sort.equals("마감임박순")) {
                    result = marketRepository.selectCategoryDeadlineList(category, pageable);
                } else if (sort.equals("거리순")) {
                    result = marketRepository.selectCategoryDistanceList(category, latitude, longitude, pageable);
                } else if (sort.equals("좋아요순")) {
                    result = marketRepository.selectCategoryLikeList(category, pageable);
                }
            } else {
                result = marketRepository.selectCategoryList(category, pageable);
            }
        } else if ((search == null || search.isEmpty()) && (sort == null || sort.isEmpty())) { // 페이지 클릭 시
            result = marketRepository.selectList(pageable);
        } else if ((search != null && !search.isEmpty()) && (sort == null || sort.isEmpty())) { // 검색
            result = marketRepository.selectSearchList(search, pageable);
        } else if ((sort != null && !sort.isEmpty()) && (search == null || search.isEmpty())) { // 정렬
            if (sort.equals("최신순")) {
                result = marketRepository.newList(pageable);
            } else if (sort.equals("마감임박순")) {
                result = marketRepository.deadLineList(pageable);
            } else if (sort.equals("거리순")) {
                result = marketRepository.distanceList(latitude, longitude, pageable);
            } else if (sort.equals("좋아요순")) {
                result = marketRepository.likeList(pageable);
            }
        } else if (search != null && sort != null) { // 검색&&정렬 둘다
            if (sort.equals("최신순")) {
                result = marketRepository.searchNewList(search, pageable);
            } else if (sort.equals("마감임박순")) {
                result = marketRepository.searchDeadLineList(search, pageable);
            } else if (sort.equals("거리순")) {
                result = marketRepository.searchDistanceList(search, latitude, longitude, pageable);
            } else if (sort.equals("좋아요순")) {
                result = marketRepository.searchLikeList(search, pageable);
            }
        }

        List<MarketDto> dtoList = result.get().map(arr -> {
            Market market = (Market) arr[0];
            MarketImage marketImage = (MarketImage) arr[1];
            String defaultImageStr = "default.png";// 기본 이미지 파일명 설정

            MarketDto marketDto = MarketDto.builder()
                    .marketNo(market.getMarketNo())
                    .title(market.getTitle())
                    .marketCategory(market.getMarketCategory())
                    .location(market.getLocation())
                    .deadline(market.getDeadline())
                    .nickname(market.getNickname())
                    .marketHit(market.getMarketHit())
                    .price(market.getPrice())
                    .flag(market.isFlag())
                    .build();

            if (marketImage != null) {
                String imageStr = marketImage.getFileName();
                marketDto.setUploadFileNames(List.of(imageStr));
            } else {
                marketDto.setUploadFileNames(List.of(defaultImageStr));
            }
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

    public Market add(MarketDto marketDto) { // 동네장터 등록(이미지 포함)
        Market market = Market.DtoToEntity(marketDto);
        marketRepository.save(market);
        return market;
    }

    public MarketDto read(int marketNo) { // 동네장터 조회
        Optional<Market> result = marketRepository.findById(marketNo);
        Market market = result.orElseThrow();
        MarketDto marketDto = market.entityToDto(market);
        return marketDto;
    }

    public Market get(Long marketNo) {
        Market market = marketRepository.findByMarketNo(marketNo);
        return market;
    }

    @Transactional // DB 작업이 성공적으로 완료될때만 실제 DB에 반영
    public void delete(int marketNo) {
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
        market.setLatitude(marketDto.getLatitude());
        market.setLongitude(marketDto.getLongitude());
        market.setMarketCategory(marketDto.getMarketCategory());
        market.setDeadline(marketDto.getDeadline());
        market.setPrice(marketDto.getPrice());

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
                    .deadline(market.getDeadline())
                    .nickname(market.getNickname())
                    .content(market.getContent())
                    .marketHit(market.getMarketHit())
                    .price(market.getPrice())
                    .build();

            String imageStr = marketImage.getFileName();
            marketDto.setUploadFileNames(List.of(imageStr));
            return marketDto;
        }).collect(Collectors.toList());

        return dtoList;
    }

    public void increase(Long marketNo) { // 좋아요 +1
        Optional<Market> result = marketRepository.findById(marketNo.intValue());
        Market market = result.orElseThrow();
        market.setMarketHit(market.getMarketHit() + 1);
        marketRepository.save(market);
    }

    public void decrease(Long marketNo) { // 좋아요 -1
        Optional<Market> result = marketRepository.findById(marketNo.intValue());
        Market market = result.orElseThrow();
        market.setMarketHit(market.getMarketHit() - 1);
        marketRepository.save(market);
    }

    public List<MyActivityDto> mylist(Long id) {
        PageRequest pageRequest = PageRequest.of(0, 3);
        Page<Market> result = marketRepository.findByUser(id, pageRequest);

        List<MyActivityDto> dtoList = result.getContent().stream().map(market -> {
            MyActivityDto dto = new MyActivityDto();
            dto.setCategory(market.getMarketCategory());
            dto.setRegDate(market.getCreatedDate());
            dto.setTitle(market.getTitle());
            dto.setNo(market.getMarketNo());
            return dto;
        }).collect(Collectors.toList());

        return dtoList;
    }

    public PageResponseDto<MarketDto> mylistall(PageRequestDto pageRequestDto, Long id) {
        Pageable pageable = PageRequest.of(
                pageRequestDto.getPage() - 1,
                pageRequestDto.getSize(),
                Sort.by("marketNo").descending());
        Page<Object[]> result = marketRepository.findAllByUser(id, pageable);

        List<MarketDto> dtoList = result.get().map(arr -> {
            Market market = (Market) arr[0];
            MarketImage marketImage = (MarketImage) arr[1];
            String defaultImageStr = "default.png";// 기본 이미지 파일명 설정

            MarketDto marketDto = MarketDto.builder()
                    .marketNo(market.getMarketNo()).title(market.getTitle()).marketCategory(market.getMarketCategory())
                    .location(market.getLocation()).deadline(market.getDeadline()).nickname(market.getNickname())
                    .marketHit(market.getMarketHit()).price(market.getPrice()).build();

            if (marketImage != null) {
                String imageStr = marketImage.getFileName();
                marketDto.setUploadFileNames(List.of(imageStr));
            } else {
                marketDto.setUploadFileNames(List.of(defaultImageStr));
            }
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

    // 마감 전환
    public void updateFlag(Long marketNo, boolean flag) {
        Market market = marketRepository.findById(marketNo.intValue())
                .orElseThrow(() -> new IllegalArgumentException("Invalid market No: " + marketNo));
        market.setFlag(flag);
        marketRepository.save(market);
    }
}