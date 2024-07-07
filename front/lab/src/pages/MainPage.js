import BasicLayout from '../layouts/BasicLayout';
import CommunityPostComponent from '../components/main/CommunityPostComponent';
import TeamPostComponent from '../components/main/TeamPostComponent';
import MarketPostComponent from '../components/main/MarketPostComponent';
import BuyPostComponent from '../components/main/BuyPostComponent';
import ShareRoomPostComponent from '../components/main/ShareRoomPostComponent';
import WeatherComponent from '../components/main/WeatherComponent';
import MainSliderComponent from '../components/main/MainSliderComponent';
import { Link, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import TypingComponent from '../components/main/TypingComponent';
import SimpleAlert from '../components/common/SimpleAlert';

const MainPage = () => {
  const location = useLocation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isFadingOut, setFadingOut] = useState(false);
  const [isModalVisible2, setModalVisible2] = useState(false);
  const [isFadingOut2, setFadingOut2] = useState(false);
  const [isModalVisible3, setModalVisible3] = useState(false);
  const [isFadingOut3, setFadingOut3] = useState(false);

  useEffect(() => {
    if (location.state && location.state.showModal) {
      showModal();
    }
    if (location.state && location.state.showModalLogin) {
      showModalLogin();
    }
    if (location.state && location.state.showModalJoin){
      showModalJoin();
    }
  }, [location]);

  const showModal = () => {
    setFadingOut(false);
    setModalVisible(true);
    setTimeout(() => {
      setFadingOut(true);
      setTimeout(() => {
        setModalVisible(false);
      }, 500); // 애니메이션 지속 시간
    }, 2000); // 2초 후 모달 사라짐
  };

  const showModalLogin = () => {
    setFadingOut2(false);
    setModalVisible2(true);
    setTimeout(() => {
      setFadingOut2(true);
      setTimeout(() => {
        setModalVisible2(false);
      }, 500); // 애니메이션 지속 시간
    }, 2000); // 2초 후 모달 사라짐
  };

  const showModalJoin = () => {
    setFadingOut3(false);
    setModalVisible3(true);
    setTimeout(() => {
      setFadingOut3(true);
      setTimeout(() => {
        setModalVisible3(false);
      }, 500); // 애니메이션 지속 시간
    }, 2000); // 2초 후 모달 사라짐
  };

  return (
    <div className="bg-color">
      <hr className="vertical-line" />
      <BasicLayout>
        <div className="main-container-top mb-10">
          <div className='main-image-box'>
          <MainSliderComponent />
            <div className="main-image-text">
              <TypingComponent />
            </div>
            <div className="weather-container ">
              <WeatherComponent />
            </div>
          </div>
        </div>
        <div className="background-container mt-10">
          <div className="main-container text-7xl">
            #커뮤니케이션
          </div>
          <div className='main-container-space'/>
          <div className="main-container">
            <div className='main-box'>
              <div className="main-comm">
                <CommunityPostComponent />
              </div>
            </div>
            <div className='main-textbox'>
              <div className='main-desc'>
                <div className="desc-title">
                  <Link to={'/community'} className="font-bold">
                    커뮤니티
                  </Link>
                </div>
                <div className="desc-tag">
                  #자취TIP공유 #질문게시판 #리뷰게시판 #도움요청
                </div>
                <div className="desc-content">
                  이웃과 정보를 공유해보세요!
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='main-container-space'/>

        <div className="background-container mb-10">
          <div className="main-container">
            <div className='main-textbox'>
              <div className='main-desc'>
                <div className="desc-title">
                  <Link to={'/team'} className="font-bold">
                    동네모임
                  </Link>
                </div>
                <div className="desc-tag">
                  #운동 #문화생활 #반려동물 #취미생활 #기타
                </div>
                <div className="desc-content">
                  여가활동을 함께 할 이웃을 찾아보세요!
                </div>
              </div>
            </div>
            <div className='main-box'>
              <div className="main-team ">
                <TeamPostComponent />
              </div>
            </div>
          </div>
        </div>
        <div className='mb-10'>
          <div className="main-container text-7xl">
            #마켓
          </div>
          <div className="main-container">
            <div>
              <div className='main-headline'>
                <Link to={'/buy'} className='font-bold'>
                  공동구매
                </Link>
                <div className="desc-tag">
                  #배달음식 #생필품 #식료품 #가구/가전 #기타
                </div>
              </div>
              <div className="main-item">
                <BuyPostComponent />
              </div>
            </div>
            <div>
              <div className='main-headline'>
                <Link to={'/market'} className="font-bold">
                  동네장터
                </Link>
                <div className="desc-tag">
                  #구매 #판매 #교환 #나눔
                </div>
              </div>
              <div className="main-item">
                <MarketPostComponent />
              </div>
            </div>
            <div>
              <div className='main-headline'>
                <Link to={'/shareroom'} className='font-bold'>
                  자취방쉐어
                </Link>
                <div className="desc-tag">
                  #최신순 #낮은 가격순 #좋아요순
                </div>
              </div>
              <div className="main-item" >
                <ShareRoomPostComponent />
              </div>
            </div>
          </div>
        </div>
        <SimpleAlert message="로그아웃 되었습니다" isVisible={isModalVisible} isFadingOut={isFadingOut}/>
        <SimpleAlert message="로그인 되었습니다" isVisible={isModalVisible2} isFadingOut={isFadingOut2}/>
        <SimpleAlert message="회원가입이 완료되었습니다" isVisible={isModalVisible3} isFadingOut={isFadingOut3}/>
      </BasicLayout>
    </div>
  );
};

export default MainPage;