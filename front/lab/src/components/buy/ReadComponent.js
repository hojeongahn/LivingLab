import { useEffect, useState } from 'react';
import { API_SERVER_HOST, deleteOne, getOne, increaseLike, decreaseLike } from '../../api/buyApi';
import { likeClick, unlikeClick, likeInfo } from '../../api/likeApi';
import { enterChatRoomBuy } from '../../api/chatApi';
import { useSelector } from 'react-redux';
import Slider from 'react-slick';
import useCustomMove from '../../hooks/useCustomMove';
import ModalComponent from '../common/ModalComponent';
import MapComponent from '../common/MapComponent';
import iconNext from '../../resources/images/icon-next.png';
import userIcon from '../../resources/images/user.png';
import mapIcon from '../../resources/images/map.png';
import emptyheart from '../../resources/images/heart_empty.png';
import fullheart from '../../resources/images/heart_full.png';
import ResultModal from '../common/ResultModal';
import BasicModal from '../common/BasicModal';
import PartComponent from './PartComponent'
import InfoModal from '../common/InfoModal';

const initState = {
  buyNo: 0,
  id: 0,
  title: '',
  location: '',
  content: '',
  buyCategory: '',
  max: 0,
  current: 0,
  deadline: '',
  flag: '',
  buyHit: 0,
  uploadFileNames: [],
};

const initState2 = {
  likeNo: 0,
  id: 0,
  buyNo: 0
};

const host = API_SERVER_HOST;

const ReadComponent = ({ buyNo }) => {
  const [buy, setBuy] = useState(initState);
  const [result, setResult] = useState(null); //삭제 모달창
  const [addResultModal, setAddResultModal] = useState(null); //참여 모달창
  const { moveToList, moveToModify } = useCustomMove();
  const loginInfo = useSelector((state) => state.loginSlice);
  const email = loginInfo?.email;
  const ino = loginInfo.id;
  const [isLiked, setIsLiked] = useState({}); // true/false에 따라 하트 이미지 변경
  const [like, setLike] = useState(initState2);
  const [info, setInfo] = useState(null);
  const [ current, setCurrent ] = useState(0);
  const [ max, setMax ] = useState(0);

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
    getOne(buyNo).then((data) => {
      setBuy(data);
      setCurrent(data.current);
      setMax(data.max);
    });
  }, [buyNo, info, addResultModal]);

  useEffect(() => {
    if (email) { // 로그인시에만 실행
      likeInfo('buy',buyNo, ino).then((data) => {
        setLike(data);
        if (data) { //data가 있으면 이미 좋아요 누른 글
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
      });
    }
  }, [buyNo, ino, email, info]);

  const [showModal, setShowModal] = useState(false);

  const handleClickAdd = async () => {
    const formData = new FormData();
    formData.append('userId', ino); // ino 값을 formData에 추가
    formData.append('buyNo', buyNo); // buyNo 값을 formData에 추가
    if(current === max){
      setAddResultModal('더이상 참여할수 없습니다.');
    } else{
      try {
        await enterChatRoomBuy(formData); // FormData를 인자로 전달하여 호출
        setAddResultModal('참여가 완료되었습니다.');
      } catch (error) {
        setAddResultModal('이미 참여 중입니다.', error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleClickDelete = () => {
    deleteOne(buyNo);
    setResult('삭제되었습니다');
  };

  const closeDeleteModal = () => {
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
      decreaseLike(buyNo);
      setInfo('좋아요 목록에서 삭제되었습니다');
    } else {
      likeClick('buy', buyNo, ino);
      increaseLike(buyNo);
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
    <>
      <div className="bg-slate-100 w-[1000px] ml-auto p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-left font-semibold ml-2 items-center flex">
            {buy.flag ? '모집 마감' : '모집 중'}
            <img src={iconNext} alt="..." className="w-7 inline" />
          </span>
          <span className="text-right text-base">{formatDeadline(buy.deadline)}</span>
        </div>
        <div className="grid grid-cols-10 w-full mx-auto mt-4 mb-1 text-xl bg-white">
          <div className="col-start-9 col-span-2 ml-5 mt-4 text-right flex justify-center">
            <img src={email && isLiked ? fullheart : emptyheart} onClick={handleLikeClick} alt="..." className="w-7 mr-3 inline" />
            {buy.buyHit}
          </div>
          <div className="col-start-3 col-span-6 h-72 mt-3 mb-10">
            {buy.uploadFileNames.length > 0 ? (
              <Slider {...settings}>
                {buy.uploadFileNames.map((imgFile, i) => (
                  <img alt="buy" key={i} src={`${host}/api/buy/display/${imgFile}`} className="object-contain w-full h-72" />
                ))}
              </Slider>
            ) : (
              <img alt="buy" src={`${host}/api/buy/display/default.png`} className="object-contain w-full h-72" />
            )}
          </div>
          <div className="col-start-2 col-span-3 text-base">
            <span className="text-base rounded-3xl text-slate-700 text-center py-1 px-3 mr-2 bg-blue-100 border-blue-300 border">
              {buy.buyCategory === '1' && '배달음식'}
              {buy.buyCategory === '2' && '생필품'}
              {buy.buyCategory === '3' && '식료품'}
              {buy.buyCategory === '4' && '가구/가전'}
              {buy.buyCategory === '5' && '기타'}
            </span>
            <span className="text-base rounded-3xl text-slate-700 text-center py-1 px-3 bg-neutral-100 border-neutral-300 border">
              <img src={userIcon} alt="..." className="w-3 inline mb-1" />
              &ensp;{buy.current} / {buy.max}
            </span>
          </div>
          <div className="col-start-2 col-span-6 text-slate-700 text-2xl my-5">{buy.title}</div>
          <div className="col-start-2 col-span-6 text-base">
            <img src={mapIcon} alt="..." className="w-5 inline" />
            &ensp;{buy.location}
          </div>
          <div className="col-start-2 col-span-8"></div>
          <div className="col-start-8 col-span-2 text-right text-base">{buy.nickname}</div>
          <div className="col-start-2 col-span-8 my-5 border-t-4 py-4 whitespace-pre-wrap">{buy.content}</div>
          <div className="col-start-2 col-span-8 h-[450px]">
            <MapComponent location={buy.location} />
          </div>
          {/* <div className="col-start-2 col-span-8 my-6">
            <div className="flex justify-between space-x-4"> */}
          {ino === buy.id ? (
            <>
              <div className="col-start-2 col-span-8 my-6">
                <div className="flex justify-between space-x-4">
                  {/* <div className="flex"> */}
                  {/* <div className="flex mr-auto"> */}
                  <button className="text-base text-white bg-orange-400 p-2 rounded-md w-1/4 mr-2 hover:bg-red-500" onClick={() => moveToModify(buyNo)}>
                    수정하기
                  </button>
                  <button className="text-base text-white bg-red-400 p-2 rounded-md w-1/4 mr-2 hover:bg-slate-500" onClick={handleClickDelete}>
                    삭제하기
                  </button>
                  {/* </div> */}
                  {/* 글쓴이는 자동 참여하 참여하기 필요 X */}
                  <button className="text-base text-white bg-blue-400 p-2 rounded-md w-1/4 mr-2 hover:bg-blue-500" >
                    참여하기 
                  </button>
                  <button className="text-base text-white bg-slate-400 p-2 rounded-md w-1/4 hover:bg-slate-500" onClick={() => moveToList()}>
                    목록
                  </button>
                  {/* </div> */}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="col-start-6 col-span-4 my-6">
                <div className="flex justify-between space-x-4">
                  <button className="text-base text-white bg-blue-400 p-2 rounded-md w-1/2 mr-2 hover:bg-blue-500" onClick={handleClickAdd}>
                    참여하기
                  </button>
                  <button className="text-base text-white bg-slate-400 p-2 rounded-md w-1/2 hover:bg-slate-500" onClick={() => moveToList()}>
                    목록
                  </button>
                </div>
              </div>
            </>
          )}
          {/* </div>
          </div> */}
          {result && <ResultModal title={'알림'} content={`${result}`} callbackFn={closeDeleteModal} />}
          {addResultModal && <BasicModal title={'알림'} content={`${addResultModal}`} callbackFn={closeBasicModal} />}
          <ModalComponent show={showModal} onClose={handleCloseModal} />
          {/* 좋아요 기능 알림 모달 */}
          {info && <InfoModal title={'알림'} content={`${info}`} callbackFn={closeInfoModal} />}
        </div>
      </div>
      {/* 참여인원 목록 컴포넌트 */}
      <PartComponent buyNo={buyNo} />
    </>
  );
};
export default ReadComponent;
