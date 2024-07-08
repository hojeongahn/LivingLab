import { useEffect, useState } from 'react';
import { API_SERVER_HOST, deleteOne, getOne, increaseLike, decreaseLike } from '../../api/marketApi';
import { useSelector } from 'react-redux';
import { postCreateRoom, chatUserInfoMarket } from '../../api/chatApi';
import Slider from 'react-slick';
import useCustomMove from '../../hooks/useCustomMove';
import ModalComponent from '../common/ModalComponent';
import MapComponent from '../common/MapComponent';
import iconNext from '../../resources/images/icon-next.png';
import mapIcon from '../../resources/images/map.png';
import emptyheart from '../../resources/images/heart_empty.png';
import fullheart from '../../resources/images/heart_full.png';
import ResultModal from '../common/ResultModal';
import { likeClick, unlikeClick, likeInfo } from '../../api/likeApi';
import InfoModal from '../common/InfoModal';
import BasicModal from '../common/BasicModal';
import ConfirmationModal from '../common/ConfirmationModal';

const initState = {
  marketNo: 0,
  id: 0,
  title: '',
  location: '',
  content: '',
  marketCategory: '',
  max: 0,
  current: 0,
  deadline: '',
  flag: '',
  uploadFileNames: [],
};

const initState2 = {
  likeNo: 0,
  id: 0,
  marketNo: 0,
};

const host = API_SERVER_HOST;

const ReadComponent = ({ marketNo }) => {
  const [result, setResult] = useState(null); //삭제 전용 모달창
  const [addResultModal, setAddResultModal] = useState(null);
  const [market, setMarket] = useState(initState);
  const { moveToList, moveToModify } = useCustomMove();
  const loginInfo = useSelector((state) => state.loginSlice);
  const email = loginInfo?.email;
  const ino = loginInfo.id;
  const [isLiked, setIsLiked] = useState({}); // true/false에 따라 하트 이미지 변경
  const [like, setLike] = useState(initState2);
  const [info, setInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [roomData, setRoomData] = useState(null);

  // 이미지 슬라이더
  const settings = {
    dots: true,
    fade: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    waitForAnimate: false,
  };

  useEffect(() => {
    getOne(marketNo).then((data) => {
      setMarket(data);
    });
  }, [marketNo, info, addResultModal]);

  useEffect(() => {
    if (email) {
      likeInfo('market', marketNo, ino).then((data) => {
        setLike(data);
        if (data) {
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
      });
    }
  }, [marketNo, ino, email, info]);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await chatUserInfoMarket(marketNo);

        if (response.result) {
          setRoomData(response.data);
        } else {
          console.error('특정 채팅방 조회 실패:', response.message);
        }
      } catch (error) {
        console.error('API 요청 중 오류 발생:', error);
      }
    };

    fetchRoomData();
  }, [marketNo]);

  const handleClickAdd = async () => {  //동네장터는 참여하기 클릭 시 채팅방 생성(1대1 채팅방)
    if(!email){
      setAddResultModal('로그인 후 참여할 수 있습니다');
      return;
    }
    if (roomData) {
      try {
        const formData = new FormData();
        formData.append('id', ino); 
        formData.append('title', market.title);
        const createRequest = { marketNo };

        // 각 채팅방 정보에 접근하여 reader 배열에서 id가 ino인 사용자가 포함되어 있는지 확인
        const isAlreadyJoined = roomData.some(room => room.reader.some(reader => reader.id === ino));

        if (isAlreadyJoined) {
          setAddResultModal('이미 참여 중입니다.');
        } else {
          // 채팅방 생성 요청
          await postCreateRoom(formData.get('id'), formData.get('title'), '동네장터', createRequest);
          setAddResultModal('참여가 완료되었습니다.');
        }
      } catch (error) {
        console.error('API 요청 중 오류 발생:', error);
        setAddResultModal('API 요청 중 오류가 발생했습니다.');
      }
    } else {
      console.warn('채팅방 데이터가 로드되지 않았습니다.');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleClickDelete = () => {
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    await deleteOne(marketNo);
    setShowModal(false);
    setResult('삭제되었습니다');
  };

  const closeDeleteModal = () => { //삭제 모달창
    setResult(null);
    moveToList();
  };

  const closeInfoModal = () => {
    setInfo(null);
  };

  const closeBasicModal = () => {
    setAddResultModal(null);
    window.location.reload();
  };

  const handleLikeClick = () => {
    if (!email) {
      setInfo('로그인 후 이용 가능합니다');
      return;
    }
    if (isLiked) {
      unlikeClick(like.likeNo);
      decreaseLike(marketNo);
      setInfo('좋아요 목록에서 삭제되었습니다');
    } else {
      likeClick('market', marketNo, ino);
      increaseLike(marketNo);
      setInfo('좋아요 목록에 추가되었습니다');
    }
    setIsLiked(!isLiked);
  };

  //날짜 포맷 설정
  const formatDeadline = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);

    const padZero = (num) => num.toString().padStart(2, '0'); //숫자를 2자리 문자열로 반환
    const isToday = (date) => {
      return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
    };

    const hours = deadlineDate.getHours();
    const minutes = padZero(deadlineDate.getMinutes());
    const amPm = hours < 12 ? '오전' : '오후';
    const displayHours = padZero(hours % 12 || 12); // 24시간 포맷을 12시간 포맷으로 변경

    if (isToday(deadlineDate)) {
      return `오늘 ${amPm} ${displayHours}:${minutes}까지`;
    } else {
      const year = deadlineDate.getFullYear();
      const month = padZero(deadlineDate.getMonth() + 1);
      const day = padZero(deadlineDate.getDate());
      return `${year}-${month}-${day} ${amPm} ${displayHours}:${minutes}까지`;
    }
  };

  return (
    <div className="bg-slate-100 w-[1000px] mx-auto p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <span className="text-left font-semibold ml-2 items-center flex">
          {market.flag ? '모집 마감' : '모집 중'}
          <img src={iconNext} alt="..." className="w-7 inline" />
        </span>
        <span className="text-right text-base">{formatDeadline(market.deadline)}</span>
      </div>
      <div className="grid grid-cols-10 w-full mx-auto mt-4 mb-1 text-xl bg-white">
        <div className="col-start-9 col-span-2 ml-5 mt-4 text-right flex justify-center">
          <img src={email && isLiked ? fullheart : emptyheart} onClick={handleLikeClick} alt="..." className="w-7 mr-3 inline" />
          {market.marketHit}
        </div>
        <div className="col-start-3 col-span-6 h-72 mt-3 mb-10">
          {market.uploadFileNames.length > 0 ? (
            <Slider {...settings}>
              {market.uploadFileNames.map((imgFile, i) => (
                <img alt="market" key={i} src={`${host}/api/market/display/${imgFile}`} className="object-contain w-full h-72" />
              ))}
            </Slider>
          ) : (
            <img alt="market" src={`${host}/api/market/display/default.png`} className="object-contain w-full h-72" />
          )}
        </div>
        <div className="col-start-2 col-span-3 text-base">
          <span className="text-base rounded-3xl text-slate-700 text-center py-1 px-3 mr-2 bg-blue-100 border-blue-300 border">
            {market.marketCategory === '1' && '구매'}
            {market.marketCategory === '2' && '판매'}
            {market.marketCategory === '3' && '교환'}
            {market.marketCategory === '4' && '나눔'}
            {market.marketCategory === '5' && '기타'}
          </span>
        </div>
        <div className="col-start-2 col-span-6 text-slate-700 text-2xl my-5">{market.title}</div>
        <div className="col-start-2 col-span-8 text-base">
          <>{market.marketCategory !== '3' && market.marketCategory !== '4' && (
            <span>{market.price}원 / </span>)}
            <img src={mapIcon} alt="..." className="w-5 inline" />
            &ensp;{market.location}
          </>
        </div>
        <div className="col-start-2 col-span-6 text-slate-700 text-sm my-5">작성일 : {market.createdDate}</div>
        <div className="col-start-2 col-span-8"></div>
        <div className="col-start-8 col-span-2 text-right text-base">{market.nickname}</div>
        <div className="col-start-2 col-span-8 my-5 border-t-4 py-4 whitespace-pre-wrap">{market.content}</div>
        <div className="col-start-2 col-span-8 h-[450px]">
          <MapComponent location={market.location} />
        </div>
        <div className="col-start-6 col-span-4 my-6">
          <div className="flex">
            {ino === market.id ? (
              <>
                <button className="text-base text-white bg-red-400 p-2 rounded-md w-1/2 mr-2 hover:bg-red-500" onClick={() => moveToModify(marketNo)}>
                  수정하기
                </button>
                <button className="text-base text-white bg-slate-400 p-2 rounded-md w-1/2 mr-2 hover:bg-slate-500" onClick={handleClickDelete}>
                  삭제하기
                </button>
                <button className="text-base text-white bg-slate-400 p-2 rounded-md w-1/2 hover:bg-slate-500" onClick={() => moveToList()}>
                  목록
                </button>
              </>
            ) : (
              <>
                <button className="text-base text-white bg-blue-400 p-2 rounded-md w-1/2 mr-2 hover:bg-blue-500" onClick={handleClickAdd}>
                  참여하기
                </button>
                <button className="text-base text-white bg-slate-400 p-2 rounded-md w-1/2 hover:bg-slate-500" onClick={() => moveToList()}>
                  목록
                </button>
              </>
            )}
          </div>
        </div>
        {result && <ResultModal title={'알림'} content={`${result}`} callbackFn={closeDeleteModal} />}
        {addResultModal && <BasicModal title={'알림'} content={`${addResultModal}`} callbackFn={closeBasicModal} />}
        {/* 좋아요 기능 알림 모달 */}
        {info && <InfoModal title={'알림'} content={`${info}`} callbackFn={closeInfoModal} />}
        <ConfirmationModal
        show={showModal}
        message={'게시글 삭제 시 해당 글과 관련된 모든 채팅방이 삭제됩니다. 그래도 삭제하시겠습니까?'}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseModal}
      />
      </div>
    </div>
  );
};
export default ReadComponent;