import React, { useEffect, useState } from 'react';
import { API_SERVER_HOST, getOne, deleteOne, increaseLike, decreaseLike } from '../../api/shareRoomApi';
import { likeClick, unlikeClick, likeInfo } from '../../api/likeApi';
import useRoomCustomMove from '../../hooks/useRoomCustomMove';
import { useSelector } from 'react-redux';
import MapComponentForRoom from '../../components/shareRoom/MapComponentForRoom';
import ModalComponent from "./ModalComponent"; // <- 사진 전체보기용 모달
import ResultModal from '../common/ResultModal';
import emptyheart from '../../resources/images/heart_empty.png';
import fullheart from '../../resources/images/heart_full.png';
import InfoModal from '../common/InfoModal';

const host = API_SERVER_HOST;

const initState = {
  roomNo: 0,
  title: '',
  rentFee: 0,
  parking: '',
  option1: '',
  location: '',
  roomHit: 0,
  uploadFileNames: [],
};

const initState2 = {
  likeNo: 0,
  id: 0,
  roomNo: 0,
};

const ReadComponent = ({ roomNo }) => {
  const [shareRoom, setShareRoom] = useState(initState);
  const [like, setLike] = useState(initState2);
  const [isLiked, setIsLiked] = useState({}); // true/false에 따라 하트 이미지 변경
  const [info, setInfo] = useState(null);
  const { moveToModify, moveToList } = useRoomCustomMove();
  const [result, setResult] = useState(null);
  const loginState = useSelector((state) => state.loginSlice);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const email = loginState?.email;
  const ino = loginState.id;

  useEffect(() => {
    getOne(roomNo).then((data) => {
      console.log(data);
      setShareRoom(data);
    });
  }, [roomNo, info]);

  useEffect(() => {
    if (email) {
      //로그인시에만 실행
      likeInfo('shareroom',roomNo, ino).then((data) => {
        setLike(data);
        if (data) {
          //data가 있으면 이미 좋아요 누른글
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
      });
    }
  }, [email, info, roomNo, ino]);

  const handleClickDelete = () => {
    deleteOne(roomNo);
    setResult('삭제되었습니다');
  };

  // Function to open modal with selected image
  const openModal = () => {
    setIsModalOpen2(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen2(false);
  };

  // Function to close result modal
  const closeResultModal = () => {
    setResult(null);
    moveToList();
  };

  const closeInfoModal = () => {
    setInfo(null);
  };

  // 좋아요 버튼 클릭
  const handleLikeClick = () => {
    if (!email) {
      setInfo('로그인 후 이용 가능합니다');
      return;
    }
    if (isLiked) {
      unlikeClick(like.likeNo);
      decreaseLike(roomNo);
      setInfo('좋아요 목록에서 삭제되었습니다');
    } else {
      likeClick('shareroom', roomNo, ino);
      increaseLike(roomNo);
      setInfo('좋아요 목록에 추가되었습니다');
    }
    setIsLiked(!isLiked);
  };

  return (
    <div id="full-main">
      <div id="wrap" className="pt-10 w-full text-center mx-auto">
        <div id="images" className="w-[1200px] p-2.5 mx-auto" onClick={openModal}>
          <div id="grid" className="grid grid-cols-custom grid-rows-2 gap-2 w-full h-[440px]">
            {shareRoom.uploadFileNames.map((imgFile, index) => (
              <React.Fragment key={index}>
                {index === 0 ? (
                  <div id={`child-first-${index}`} className="row-span-2 relative overflow-hidden">
                    <img src={`${host}/api/shareRoom/display/${imgFile}`} className="position-absolute object-cover w-full h-full"></img>
                  </div>
                ) : index >= 1 && index <= 4 ? (
                  <>
                    <div id={`child-${index}`} className="relative overflow-hidden">
                      <img src={`${host}/api/shareRoom/display/${imgFile}`} className="position-absolute object-cover w-full h-full"></img>
                    </div>
                  </>
                ) : null}
                {/* 첫사진은 큰칸 , 나머지 4장은 작은칸 그 이후 사진들은 올리지 않음 */}
              </React.Fragment>
            ))}
            <ModalComponent
              isOpen={isModalOpen2}
              images={shareRoom.uploadFileNames.map((fileName) => `${host}/api/shareRoom/display/${fileName}`)}
              closeModal={closeModal}
            />
            {info && <InfoModal title={'알림'} content={`${info}`} callbackFn={closeInfoModal} />}
          </div>
          <div className='relative float-right w-28 h-10 rounded-sm mt-4 bg-gray-800 opacity-80 cursor-pointer'>
            <span className='absolute top-2 left-0 w-full text-sm leading-6 text-white font-semibold text-center'>사진 모두 보기</span>
          </div>
        </div>
      </div>
      <div id="text-main" className=" pt-24 pb-32">
        <div id="grid2" className="w-[1200px] mx-auto grid grid-cols-[780px_360px] gap-x-10 gap-y-0 p-2.5">
          <div id="text-area" className="w-[780px] h-[1000px] col-span-1 ">
            <div id="box" className="flex items-center mb-10 p-8 border border-gray-200 rounded-sm bg-gray-50">
              <h1 className="flex-none ml-1 text-black text-base leading-6 font-bold"> {shareRoom.title} </h1>
              {shareRoom.parking === 'O' ? (
                <div className='flex-none ml-auto mr-10 inline-flex items-center justify-center w-auto h-7 px-2 text-xs leading-5 font-bold whitespace-nowrap border border-gray-300 rounded text-gray-900 bg-white'>
                  <span>주차</span>
                </div>
              ) : (
                <>
                </>
              )}

            </div>
            <div id="main-container" className="grid gap-y-28">
              <section id="price">
                <div id="price-info" className="flex items-start mb-8">
                  <h1 className="text-black text-2xl leading-tight tracking-tighter font-bold">가격정보</h1>
                </div>
                <ul>
                  <li className="grid grid-cols-[160px_minmax(0,1fr)] gap-x-4 pb-4">
                    <div>
                      <h1 className="text-gray-900 text-base leading-6 font-bold">금액</h1>
                    </div>
                    {(shareRoom.rentFee % 10000) === 0 ? (
                      <div>
                        <p className="text-base leading-6 font-medium">{(shareRoom.rentFee / 10000).toFixed(0)}&nbsp; 만원</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-base leading-6 font-medium">{(shareRoom.rentFee / 10000).toFixed(1)}&nbsp; 만원</p>
                      </div>
                    )}

                  </li>
                  <li className="border-t border-gray-200 grid grid-cols-[160px_minmax(0,1fr)] gap-x-4 py-4">
                    <div>
                      <h1 className="text-gray-900 text-base leading-6 font-bold">주차가능여부</h1>
                    </div>
                    <div>
                      <p className="text-base leading-6 font-medium">{shareRoom.parking}</p>
                    </div>
                  </li>
                  <li className="border-t border-gray-200 grid grid-cols-[160px_minmax(0,1fr)] gap-x-4 py-4">
                    <div>
                      <h1 className="text-gray-900 text-base leading-6 font-bold">주소</h1>
                    </div>
                    <div>
                      <p className="text-base leading-6 font-medium">{shareRoom.location}</p>
                    </div>
                  </li>
                  <li className="border-t border-gray-200 grid grid-cols-[160px_minmax(0,1fr)] gap-x-4 py-4">
                    <div>
                      <h1 className="text-gray-900 text-base leading-6 font-bold">시작일</h1>
                    </div>
                    <div>
                      <p className="text-base leading-6 font-medium">{shareRoom.rentStartDate}</p>
                    </div>
                  </li>
                  <li className="border-t border-gray-200 grid grid-cols-[160px_minmax(0,1fr)] gap-x-4 py-4">
                    <div>
                      <h1 className="text-gray-900 text-base leading-6 font-bold">종료일</h1>
                    </div>
                    <div>
                      <p className="text-base leading-6 font-medium">{shareRoom.rentEndDate}</p>
                    </div>
                  </li>
                  <li className="border-t border-gray-200 grid grid-cols-[160px_minmax(0,1fr)] gap-x-4 py-4">
                    <div>
                      <h1 className="text-gray-900 text-base leading-6 font-bold">옵션</h1>
                    </div>
                    <div>
                      <p className="text-base leading-6 font-medium">{shareRoom.option1}</p>
                    </div>
                  </li>
                </ul>
              </section>
              <section id="location">
                <div id="location-info" className="flex items-start mb-8">
                  <h1 className="text-black text-2xl leading-tight tracking-tighter font-bold">위치</h1>
                </div>
                <div id="loc-title" className="mb-6">
                  <p className="flex-none mr-4 text-gray-900 text-base leading-6 font-normal">{shareRoom.location}</p>
                </div>
                <div id="zeedo">
                  <div className="col-start-2 col-span-8 h-[420px]">
                    <MapComponentForRoom location={shareRoom.location} />
                  </div>
                </div>
              </section>
            </div>
          </div>
          <aside id="info-area" className="w-[360px] col-span-1">
            <div id="content-container" className="sticky top-24">
              <div id="inner-content" className="w-90 p-8 bg-white shadow-md border border-gray-300 rounded-sm relative">
                <div className='pb-4 border-b border-gray-200'>
                  <h1 className="text-gray-900 text-base leading-6 font-bold">상세설명</h1>
                </div>
                <p className="flex-none mt-4 text-gray-900 text-base leading-6 font-normal whitespace-pre-wrap">
                  {shareRoom.content}
                </p>
                <div id="buttons" className="flex items-center w-full mt-8">
                  <div>
                    <button className="inline-flex items-center justify-center w-[211px] px-4 text-white bg-blue-600 h-[56px] text-sm leading-6 font-bold rounded-sm cursor-pointer transition-all duration-150 ease-out">
                      <span className="">문의하기</span>
                    </button>
                  </div>
                  <div className="w-[85px] ml-4 border">
                    <button className="ml-2 h-[56px]">
                      <img src={loginState.id && isLiked ? fullheart : emptyheart} onClick={handleLikeClick} alt="..." className="w-7 mr-3 inline" />
                      {shareRoom.roomHit}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>
          <div className="mt-[350px]">
            {loginState.id === shareRoom.userId && (
              <>
                <button type="button" className="ml-5 float-right inline-block rounded bg-blue-400 px-6 pb-2 pt-2.5 text-base font-medium leading-normal text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-500 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-teal-600 motion-reduce:transition-none" onClick={handleClickDelete}>
                  삭제하기
                </button>
                <button type="button" className="float-right inline-block rounded bg-teal-400 px-6 pb-2 pt-2.5 text-base font-medium leading-normal text-white shadow-md transition duration-150 ease-in-out hover:bg-teal-500 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-teal-600 motion-reduce:transition-none" onClick={() => moveToModify(roomNo)}>
                  수정하기
                </button>

              </>
            )}
          </div>
        </div>
      </div>
      {result && <ResultModal title={'알림'} content={`${result}`} callbackFn={closeResultModal} />}
    </div>
  );
}

export default ReadComponent;
