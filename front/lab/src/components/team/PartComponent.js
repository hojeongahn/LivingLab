import { useEffect, useState } from 'react';
import ProfileComponent from '../common/ProfileComponent';
import { useDispatch, useSelector } from 'react-redux';
import useCustomLogin from './../../hooks/useCustomLogin';
import ModalComponent from '../common/ModalComponent';
import ResultModal from '../common/ResultModal';
import InfoModal from '../common/InfoModal';
import { chatUserInfoTeam, exitChatRoomTeam } from '../../api/chatApi';
import { getUser, API_SERVER_HOST } from '../../api/userApi';

const host = API_SERVER_HOST;

const PartComponent = ({ teamNo }) => {
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [chatroomInfo, setChatroomInfo] = useState(null);
  const [displayUsers, setDisplayUsers] = useState([]);
  const [result, setResult] = useState(null);
  const loginInfo = useSelector((state) => state.loginSlice);
  const userId = loginInfo?.id;

  useEffect(() => {
    const fetchChatroomData = async () => {
      try {
        const chatroomResponse = await chatUserInfoTeam(teamNo);
        const chatroomData = chatroomResponse.data;
        setChatroomInfo(chatroomData);

        // 작성자 정보 가져오기
        const writerResponse = await getUser(chatroomData.writerId);

        // 참여자 정보 가져오기
        const readerDataPromises = chatroomData.readerId.map((readerId) => getUser(readerId));
        const readerResponses = await Promise.all(readerDataPromises);

        // 화면에 표시할 유저들 정보 설정
        const participants = [writerResponse, ...readerResponses];
        setDisplayUsers(participants);
      } catch (error) {
        console.error('데이터 가져오기 실패', error);
      }
    };
    fetchChatroomData();
  }, [teamNo]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDeleteClick = () => {
    setModalMessage('삭제하시겠습니까?');
    setShowConfirm(true);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  const handleResultModalClose = () => {
    setResult(null);
    window.location.reload();
  };

  const handleExitChatRoom = async () => {
    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('teamNo', teamNo);

      const isUserInRoom = displayUsers.some((user) => user.id === userId);
      if (!isUserInRoom) {
        setResult('참여중이 아닙니다.');
      } else if (chatroomInfo.writerId == userId) {
        setResult('자신이 쓴 게시글은 참여를 취소할 수 없습니다.');
      } else {
        await exitChatRoomTeam(formData);
        setDisplayUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        setResult('참여를 취소했습니다.');
        setShowModal(false);
      }
    } catch (error) {
      setResult('참여 취소 실패:', error);
      setShowModal(false);
    }
  };

  return (
    <div className="flex justify-center bg-slate-100 w-1/5 p-4 ml-10 mr-20 rounded-lg h-30">
      <div className="w-full">
        <div className="bg-blue-200 rounded-lg text-center p-4">
          <h2>참여 인원</h2>
        </div>
        <hr />
        <div className>
          <div>
            {displayUsers.map((user) => (
              <div className="flex p-5" key={user.id}>
                <img alt="Profile_Img" src={`${host}/api/user/display/${user.profileImage}`} className="rounded-full size-10 mr-2" />
                {user.nickname}
              </div>
            ))}
          </div>
        </div>

        <div className="flex mt-5">
          <button className="text-base text-white bg-blue-400 p-2 rounded-md w-1/2 mr-2 hover:bg-blue-500" onClick={() => setShowModal(true)}>
            채팅
          </button>
          <button className="text-base text-white bg-slate-400 p-2 rounded-md w-1/2 hover:bg-slate-500" onClick={handleExitChatRoom}>
            참여 X
          </button>
        </div>
      </div>
      {result && <ResultModal title={'알림'} content={result} callbackFn={handleResultModalClose} />}
      <ModalComponent show={showModal} onClose={handleCloseModal} />
    </div>
  );
};

export default PartComponent;
