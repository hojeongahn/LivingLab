package com.mlp.lab.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mlp.lab.entity.ShareRoom;

//ShareRoom Entity의 기본키(PK) 타입인 Integer를 인자로 전달
public interface ShareRoomRepository extends JpaRepository<ShareRoom, Integer> {

    ShareRoom findByRoomNo(@Param(value = "roomNo") Long roomNo);

    // JPQL을 이용해서 쿼리를 작성하고, 조인 처리
    // 글의 내용과 이미지를 가져옴(이미지가 삭제되지않은)
    @Query("select s, si from ShareRoom s left join s.imageList si where si.ord = 0 and s.flag = true order by roomNo desc")
    Page<Object[]> selectList(Pageable pageable);

    // 검색어 기준 정렬(글 제목에서만 검색)
    @Query("select s, si from ShareRoom s left join s.imageList si where si.ord = 0 and s.flag = true and s.location like %:location%")
    Page<Object[]> selectSearchList(String location, Pageable pageable);

    // 최신순
    @Query("select s, si from ShareRoom s left join s.imageList si where s.flag = true and si.ord = 0 order by s.roomNo")
    Page<Object[]> newList(Pageable pageable);

    // 낮은가격순 asc는 오름차순, 아무것도 안적어도 기본으로 오름차순이다
    @Query("select s, si from ShareRoom s left join s.imageList si where s.flag = true and si.ord = 0 order by s.averFee asc")
    Page<Object[]> lowPriceList(Pageable pageable);

    // 좋아요순
    @Query("select s, si from ShareRoom s left join s.imageList si where s.flag = true and si.ord = 0 order by s.roomHit desc")
    Page<Object[]> likeList(Pageable pageable);

    // 검색 + 최신순
    @Query("select s, si from ShareRoom s left join s.imageList si where s.flag = true and si.ord = 0  and s.location like %:location% order by s.roomNo")
    Page<Object[]> searchNewList(@Param(value="location")String location, Pageable pageable);

    // 검색 + 낮은가격순
    @Query("select s, si from ShareRoom s left join s.imageList si where s.flag = true and si.ord = 0 and s.location like %:location% order by s.averFee asc")
    Page<Object[]> searchLowPriceList(@Param(value="location")String location, Pageable pageable);

    // 검색 + 좋아요순
    @Query("select s, si from ShareRoom s left join s.imageList si where s.flag = true and si.ord = 0 and s.location like %:location% order by s.roomHit desc")
    Page<Object[]> searchLikeList(@Param(value="location")String location, Pageable pageable);

    // 메인에 표기할 최신순
    @Query("select s, si from ShareRoom s left join s.imageList si where si.ord = 0 and s.flag = true order by s.roomNo desc")
    Page<Object[]> latestShareRoomList(Pageable pageable);

    //마이페이지 내가 작성한 글
    @Query("SELECT s FROM ShareRoom s WHERE s.userId = :id ORDER BY s.roomNo DESC")
    Page<ShareRoom> findByUser(@Param(value = "id") Long id, Pageable pageable);

    @Query("select s, si from ShareRoom s left join s.imageList si where s.userId = :id and si.ord = 0 order by roomNo desc")
    Page<Object[]> findAllByUser(@Param(value = "id") Long id, Pageable pageable);

}
