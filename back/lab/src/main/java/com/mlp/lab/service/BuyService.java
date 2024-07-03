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
import com.mlp.lab.dto.BuyDto;
import com.mlp.lab.dto.MyActivityDto;
import com.mlp.lab.entity.Buy;
import com.mlp.lab.entity.BuyImage;
import com.mlp.lab.repository.BuyRepository;
import com.mlp.lab.repository.UserRepository;
import com.mlp.lab.repository.chat.ChatRoomRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BuyService {
    private final BuyRepository buyRepository;
    private final UserRepository userRepository;
    private final ChatRoomRepository chatRoomRepository;

    // 목록 가져오기(페이징 처리, 이미지 포함)
    public PageResponseDto<BuyDto> list(PageRequestDto pageRequestDto, String search, String sort, Character category,
            double latitude,
            double longitude) {
        Pageable pageable = PageRequest.of(
                pageRequestDto.getPage() - 1,
                pageRequestDto.getSize(),
                Sort.by("buyNo").descending());

        Page<Object[]> result = null;

        if (category != null && (search != null && !search.isEmpty())) { // 카테고리와 검색 조건이 모두 지정된 경우
            if (sort != null && !sort.isEmpty()) {
                if (sort.equals("최신순")) {
                    result = buyRepository.selectCategorySearchNewList(category, search, pageable);
                } else if (sort.equals("마감임박순")) {
                    result = buyRepository.selectCategorySearchDeadlineList(category, search, pageable);
                } else if (sort.equals("거리순")) {
                    result = buyRepository.selectCategorySearchDistanceList(category, search, latitude, longitude, pageable);
                } else if (sort.equals("좋아요순")) {
                    result = buyRepository.selectCategorySearchLikeList(category, search, pageable);
                }
            } else {
            result = buyRepository.selectCategorySearchList(category, search, pageable);
            }
        } else if (category != null) { // 카테고리만 지정된 경우
            if (sort != null && !sort.isEmpty()) {
                if (sort.equals("최신순")) {
                    result = buyRepository.selectCategoryNewList(category, pageable);
                } else if (sort.equals("마감임박순")) {
                    result = buyRepository.selectCategoryDeadlineList(category, pageable);
                } else if (sort.equals("거리순")) {
                    result = buyRepository.selectCategoryDistanceList(category, latitude, longitude, pageable);
                } else if (sort.equals("좋아요순")) {
                    result = buyRepository.selectCategoryLikeList(category, pageable);
                }
            } else {
                result = buyRepository.selectCategoryList(category, pageable);
            }
        } else if ((search == null || search.isEmpty()) && (sort == null || sort.isEmpty())) { // 페이지 클릭 시
            result = buyRepository.selectList(pageable);
        } else if ((search != null && !search.isEmpty()) && (sort == null || sort.isEmpty())) { // 검색
            result = buyRepository.selectSearchList(search, pageable);
        } else if ((sort != null && !sort.isEmpty()) && (search == null || search.isEmpty())) { // 정렬
            if (sort.equals("최신순")) {
                result = buyRepository.newList(pageable);
            }
            if (sort.equals("마감임박순")) {
                result = buyRepository.deadLineList(pageable);
            }
            if (sort.equals("거리순")) {
                result = buyRepository.distanceList(latitude, longitude, pageable);
            }
            if (sort.equals("좋아요순")) {
                result = buyRepository.likeList(pageable);
            }
        } else if (search != null && sort != null) { // 검색&&정렬 둘다
            if (sort.equals("최신순")) {
                result = buyRepository.searchNewList(search, pageable);
            }
            if (sort.equals("마감임박순")) {
                result = buyRepository.searchDeadLineList(search, pageable);
            }
            if (sort.equals("거리순")) {
                result = buyRepository.searchDistanceList(search, latitude, longitude, pageable);
            }
            if (sort.equals("좋아요순")) {
                result = buyRepository.searchLikeList(search, pageable);
            }
        }
        List<BuyDto> dtoList = result.get().map(arr -> {
            Buy buy = (Buy) arr[0];
            BuyImage buyImage = (BuyImage) arr[1];
            String defaultImageStr = "default.png";// 기본 이미지 파일명 설정

            BuyDto buyDto = BuyDto.builder()
                    .buyNo(buy.getBuyNo()).title(buy.getTitle()).buyCategory(buy.getBuyCategory())
                    .location(buy.getLocation()).max(buy.getMax()).current(buy.getCurrent())
                    .deadline(buy.getDeadline()).nickname(buy.getNickname()).buyHit(buy.getBuyHit()).build();

            if (buyImage != null) {
                String imageStr = buyImage.getFileName();
                buyDto.setUploadFileNames(List.of(imageStr));
            } else {
                buyDto.setUploadFileNames(List.of(defaultImageStr));
            }
            return buyDto;
        }).collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        PageResponseDto<BuyDto> responseDTO = PageResponseDto.<BuyDto>withAll()
                .dtoList(dtoList)
                .pageRequestDto(pageRequestDto)
                .totalCount(totalCount)
                .build();
        return responseDTO;
    }

    public Buy add(BuyDto buyDto) { // 공동구매 등록(이미지 포함)
        Buy buy = Buy.DtoToEntity(buyDto);
        buy.setUser(userRepository.findByUserId(buyDto.getId())); // 화면에서 받아온 Buy를 작성한 user id값으로 어떤 유저인지 찾아서 알려줌
        buyRepository.save(buy);
        return buy;
    }

    public BuyDto read(Long buyNo) { // 공동구매 조회
        Optional<Buy> result = buyRepository.findById(buyNo);
        Buy buy = result.orElseThrow();
        BuyDto buyDto = buy.entityToDto(buy);
        buyDto.setId(buy.getUser().getId()); // Buy 안의 User 객체에서 id값만 가져옴
        return buyDto;
    }

    public Buy get(Long buyNo) {
        Buy buy = buyRepository.findByBuyNo(buyNo);
        return buy;
    }

    @Transactional // 삭제하기
    public void delete(Long buyNo) {
        // chatroom 테이블에서 해당 buy_no 값을 참조하지 않도록 업데이트
        chatRoomRepository.updateBuyRoom(buyNo);
        buyRepository.deleteById(buyNo);
    }

    public void modify(BuyDto buyDto) { // 수정하기
        // 조회
        Optional<Buy> result = buyRepository.findById(buyDto.getBuyNo());
        Buy buy = result.orElseThrow();

        // 수정
        buy.setTitle(buyDto.getTitle());
        buy.setContent(buyDto.getContent());
        buy.setLocation(buyDto.getLocation());
        buy.setLatitude(buyDto.getLatitude());
        buy.setLongitude(buyDto.getLongitude());
        buy.setBuyCategory(buyDto.getBuyCategory());
        buy.setDeadline(buyDto.getDeadline());

        // 파일들 삭제
        buy.clearList();
        List<String> uploadFileNames = buyDto.getUploadFileNames();
        if (uploadFileNames != null && uploadFileNames.size() > 0) {
            uploadFileNames.stream().forEach(uploadName -> {
                buy.addImageString(uploadName);
            });
        }
        buyRepository.save(buy);
    }

    // 메인에 표기할 최신순
    public List<BuyDto> getLatestBuy() {
        Pageable pageable = PageRequest.of(0, 9, Sort.by("buyNo").descending());
        Page<Object[]> result = null;

        result = buyRepository.latestBuyList(pageable);

        List<BuyDto> dtoList = result.getContent().stream().map(arr -> {
            Buy buy = (Buy) arr[0];
            BuyImage buyImage = (BuyImage) arr[1];

            BuyDto buyDto = BuyDto.builder()
                    .buyNo(buy.getBuyNo())
                    .title(buy.getTitle())
                    .buyCategory(buy.getBuyCategory())
                    .location(buy.getLocation())
                    .max(buy.getMax())
                    .current(buy.getCurrent())
                    .deadline(buy.getDeadline())
                    .nickname(buy.getNickname())
                    .buyHit(buy.getBuyHit())
                    .build();

            String imageStr = buyImage.getFileName();
            buyDto.setUploadFileNames(List.of(imageStr));
            return buyDto;
        }).collect(Collectors.toList());

        return dtoList;
    }

    // 메인에 표기할 거리순
    public List<BuyDto> getdistanceBuy(double latitude, double longitude) {
        Pageable pageable = PageRequest.of(0, 8, Sort.by("buyNo").descending());
        Page<Object[]> result = null;

        result = buyRepository.distanceList(latitude, longitude, pageable);

        List<BuyDto> dtoList = result.getContent().stream().map(arr -> {
            Buy buy = (Buy) arr[0];
            BuyImage buyImage = (BuyImage) arr[1];

            BuyDto buyDto = BuyDto.builder()
                    .buyNo(buy.getBuyNo())
                    .title(buy.getTitle())
                    .buyCategory(buy.getBuyCategory())
                    .location(buy.getLocation())
                    .latitude(buy.getLatitude()) //
                    .longitude(buy.getLongitude()) //
                    .location(buy.getLocation())
                    .max(buy.getMax())
                    .current(buy.getCurrent())
                    .deadline(buy.getDeadline())
                    .nickname(buy.getNickname())
                    .buyHit(buy.getBuyHit())
                    .build();

            String imageStr = buyImage.getFileName();
            buyDto.setUploadFileNames(List.of(imageStr));
            return buyDto;
        }).collect(Collectors.toList());

        return dtoList;
    }

    public void increase(Long buyNo) { // 좋아요 +1
        Optional<Buy> result = buyRepository.findById(buyNo);
        Buy buy = result.orElseThrow();
        buy.setBuyHit(buy.getBuyHit() + 1);
        buyRepository.save(buy);
    }

    public void decrease(Long buyNo) { // 좋아요 -1
        Optional<Buy> result = buyRepository.findById(buyNo);
        Buy buy = result.orElseThrow();
        buy.setBuyHit(buy.getBuyHit() - 1);
        buyRepository.save(buy);
    }

    public List<MyActivityDto> mylist(Long id) {
        PageRequest pageRequest = PageRequest.of(0, 3);
        Page<Buy> result = buyRepository.findByUser(id, pageRequest);

        List<MyActivityDto> dtoList = result.getContent().stream().map(buy -> {
            MyActivityDto dto = new MyActivityDto();
            dto.setCategory(buy.getBuyCategory());
            dto.setRegDate(buy.getCreatedDate());
            dto.setTitle(buy.getTitle());
            dto.setNo(buy.getBuyNo());
            return dto;
        }).collect(Collectors.toList());

        return dtoList;
    }

    public PageResponseDto<BuyDto> mylistall(PageRequestDto pageRequestDto, Long id) {
        Pageable pageable = PageRequest.of(
                pageRequestDto.getPage() - 1,
                pageRequestDto.getSize(),
                Sort.by("buyNo").descending());
        Page<Object[]> result = buyRepository.findAllByUser(id, pageable);

        List<BuyDto> dtoList = result.get().map(arr -> {
            Buy buy = (Buy) arr[0];
            BuyImage buyImage = (BuyImage) arr[1];
            String defaultImageStr = "default.png";// 기본 이미지 파일명 설정

            BuyDto buyDto = BuyDto.builder()
                    .buyNo(buy.getBuyNo()).title(buy.getTitle()).buyCategory(buy.getBuyCategory())
                    .location(buy.getLocation()).max(buy.getMax()).current(buy.getCurrent())
                    .deadline(buy.getDeadline()).nickname(buy.getNickname()).buyHit(buy.getBuyHit()).build();

            if (buyImage != null) {
                String imageStr = buyImage.getFileName();
                buyDto.setUploadFileNames(List.of(imageStr));
            } else {
                buyDto.setUploadFileNames(List.of(defaultImageStr));
            }
            return buyDto;
        }).collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        PageResponseDto<BuyDto> responseDTO = PageResponseDto.<BuyDto>withAll()
                .dtoList(dtoList)
                .pageRequestDto(pageRequestDto)
                .totalCount(totalCount)
                .build();

        return responseDTO;
    }

    // 마감 전환
    public void updateFlag(Long buyNo, boolean flag) {
        Buy buy = buyRepository.findById(buyNo)
                .orElseThrow(() -> new IllegalArgumentException("Invalid buy No: " + buyNo));
        buy.setFlag(flag);
        buyRepository.save(buy);
    }
}