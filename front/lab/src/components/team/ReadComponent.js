import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_SERVER_HOST, deleteOne, getOne, increaseLike, decreaseLike } from '../../api/teamApi';
import { likeTeam, unlikeTeam, likeInfoTeam, deleteLikeTeam } from '../../api/likeApi';
import { getUser } from '../../api/userApi';
import { enterChatRoomTeam } from '../../api/chatApi';
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
import PartComponent from './PartComponent';
import Profile_Img from '../../resources/images/profile_img.png';
import LandingComponent from './../common/mapSearch/LandingComponent';
import InfoModal from '../common/InfoModal';

const initState = {
  teamNo: 0,
  id: 0,
  title: '',
  location: '',
  content: '',
  teamCategory: '',
  max: 0,
  current: 0,
  deadline: '',
  flag: '',
  teamHit: 0,
  uploadFileNames: [],
};

const initUser = {
  nickname: '',
  profileImage: '',
};

const initState2 = {
  likeNo: 0,
  id: 0,
  teamNo: 0,
};

const host = API_SERVER_HOST;

const ReadComponent = ({ teamNo }) => {
  const [team, setTeam] = useState(initState);
  const [user, setUser] = useState(initUser);
  const [result, setResult] = useState(null);
  const [addResultModal, setAddResultModal] = useState(null);
  const { moveToList, moveToModify } = useCustomMove();
  const loginInfo = useSelector((state) => state.loginSlice);
  const email = loginInfo?.email;
  const ino = loginInfo.id;
  const [isLiked, setIsLiked] = useState({}); // true/false에 따라 하트 이미지 변경
  const [like, setLike] = useState(initState2);
  const [info, setInfo] = useState(null);
  const [userId, setUserId] = useState('');
  const [current, setCurrent] = useState(0);
  const [max, setMax] = useState(0);

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
    getOne(teamNo).then((data) => {
      setTeam(data);
      setCurrent(data.current);
      setMax(data.max);
    });
  }, [teamNo, info]);

  useEffect(() => {
    getUser(ino).then((data) => {
      fetchUserProfileImage(data.email);
      setUser(data);
    });
  }, [ino]);

  useEffect(() => {
    if (email) {
      //로그인시에만 실행
      likeInfoTeam(teamNo, ino).then((data) => {
        setLike(data);
        if (data) {
          //data가 있으면 이미 좋아요 누른글
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
      });
    }
  }, [email, info]);

  const [showModal, setShowModal] = useState(false);

  const handleClickAdd = async () => {
    const formData = new FormData();
    formData.append('userId', ino); // ino 값을 formData에 추가
    formData.append('teamNo', teamNo); // buyNo 값을 formData에 추가
    if (current === max) {
      setResult('더이상 참여할수 없습니다.');
    } else {
      try {
        await enterChatRoomTeam(formData); // FormData를 인자로 전달하여 호출
        setResult('참여가 완료되었습니다.');
      } catch (error) {
        setResult('이미 참여 중입니다.', error);
      }
    }
  };

  const closeModal = () => {
    setResult(null);
    window.location.reload();
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleClickDelete = () => {
    deleteLikeTeam(teamNo)
      .then(() => {
        return deleteOne(teamNo);
      })
      .then((result) => {
        console.log('delete result : ' + result);
        setResult('삭제되었습니다');
        moveToList();
      });
  };

  const closeInfoModal = () => {
    setInfo(null);
  };

  const handleLikeClick = () => {
    if (!email) {
      setInfo('로그인 후 이용 가능합니다');
      return;
    }
    if (isLiked) {
      unlikeTeam(like.likeNo);
      decreaseLike(teamNo);
      setInfo('좋아요 목록에서 삭제되었습니다');
    } else {
      const data = {
        id: ino,
        teamNo: teamNo,
      };
      likeTeam(data);
      increaseLike(teamNo);
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

  //프로필 사진 읽어오는 함수
  const fetchUserProfileImage = async (email) => {
    try {
      const res = await axios.get(`http://localhost:8282/api/user/userProfileImage?email=${email}`, {
        responseType: 'arraybuffer', // 바이너리 데이터로 응답받기
      });

      // 받은 바이너리 데이터 처리
      const blob = new Blob([res.data], { type: 'image/png' });
      const imageUrl = URL.createObjectURL(blob);
      setUser((prev) => ({
        ...prev, // 이전 상태를 복사해야 이미지 삭제하고 다시 변경했을 대 바로 적용됨
        profileImage: imageUrl, // 이미지 데이터 추가
      }));
      console.log('프로필 사진 읽기 최종 성공');
    } catch (error) {
      console.error('프로필 이미지가 없습니다', error);
      // 오류가 발생하면 대체 이미지를 사용하도록 설정
      setUser((prev) => ({
        ...prev,
        profileImage: Profile_Img,
      }));
    }
  };

  return (
    <>
      <div className=" bg-slate-200 w-1/4 rounded-md px-4 py-4">
        <LandingComponent />
      </div>
      <div className="bg-slate-100 w-[1000px] ml-5 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-left font-semibold ml-2 items-center flex">
            {team.flag ? '모집 마감' : '모집 중'}
            <img src={iconNext} alt="..." className="w-7 inline" />
          </span>
          <span className="text-right text-base">{formatDeadline(team.deadline)}</span>
        </div>
        <div className="grid grid-cols-10 w-full mx-auto mt-4 mb-1 text-xl bg-white">
          <div className="col-start-9 col-span-2 ml-5 mt-4 text-right flex justify-center">
            <img src={email && isLiked ? fullheart : emptyheart} onClick={handleLikeClick} alt="..." className="w-7 mr-3 inline" />
            {team.teamHit}
          </div>
          <div className="col-start-3 col-span-6 h-72 mt-3 mb-10">
            {team.uploadFileNames.length > 0 ? (
              <Slider {...settings}>
                {team.uploadFileNames.map((imgFile, i) => (
                  <img alt="team" key={i} src={`${host}/api/team/display/${imgFile}`} className="object-contain w-full h-72" />
                ))}
              </Slider>
            ) : (
              <img alt="team" src={`${host}/api/team/display/default.png`} className="object-contain w-full h-72" />
            )}
          </div>
          <div className="col-start-2 col-span-3 text-base">
            <span className="text-base rounded-3xl text-slate-700 text-center py-1 px-3 mr-2 bg-blue-100 border-blue-300 border">
              {team.teamCategory === '1' && '운동'}
              {team.teamCategory === '2' && '문화생활'}
              {team.teamCategory === '3' && '반려동물'}
              {team.teamCategory === '4' && '취미생활'}
              {team.teamCategory === '5' && '기타'}
            </span>
            <span className="text-base rounded-3xl text-slate-700 text-center py-1 px-3 bg-neutral-100 border-neutral-300 border">
              <img src={userIcon} alt="..." className="w-3 inline mb-1" />
              &ensp;{team.current} / {team.max}
            </span>
          </div>
          <div className="col-start-2 col-span-6 text-slate-700 text-2xl my-5">{team.title}</div>
          <div className="col-start-2 col-span-6 text-base">
            <img src={mapIcon} alt="..." className="w-5 inline" />
            &ensp;{team.location}
          </div>
          <div className="col-start-2 col-span-8"></div>
          <div className="col-start-8 col-span-2 text-right text-base">{team.nickname}</div>
          <div className="col-start-2 col-span-8 my-5 border-t-4 py-4 whitespace-pre-wrap">{team.content}</div>
          <div className="col-start-2 col-span-8 h-[450px]">
            <MapComponent location={team.location} />
          </div>
          {/* <div className="col-start-2 col-span-8 my-6">
            <div className="flex justify-between space-x-4"> */}
          {ino === team.id ? (
            <>
              <div className="col-start-2 col-span-8 my-6">
                <div className="flex justify-between space-x-4">
                  {/* <div className="flex"> */}
                  {/* <div className="flex mr-auto"> */}
                  <button className="text-base text-white bg-orange-400 p-2 rounded-md w-1/4 mr-2 hover:bg-red-500" onClick={() => moveToModify(teamNo)}>
                    수정하기
                  </button>
                  <button className="text-base text-white bg-red-400 p-2 rounded-md w-1/4 mr-2 hover:bg-slate-500" onClick={handleClickDelete}>
                    삭제하기
                  </button>
                  {/* </div> */}

                  <button className="text-base text-white bg-blue-400 p-2 rounded-md w-1/4 mr-2 hover:bg-blue-500">참여하기</button>
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
          {result && <ResultModal title={'알림'} content={`${result}`} callbackFn={closeModal} />}
          {addResultModal && <ResultModal title={'알림'} content={`${addResultModal}`} callbackFn={() => setAddResultModal(null)} />}
          <ModalComponent show={showModal} onClose={handleCloseModal} />
          {/* 좋아요 기능 알림 모달 */}
          {info && <InfoModal title={'알림'} content={`${info}`} callbackFn={closeInfoModal} />}
        </div>
      </div>
      {/* 참여인원 목록 컴포넌트 */}
      <PartComponent teamNo={teamNo} />
    </>
  );
};
export default ReadComponent;
