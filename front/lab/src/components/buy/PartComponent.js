import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ResultModal from '../common/ResultModal';
import { chatUserInfoBuy, exitChatRoomBuy } from '../../api/chatApi';
import { getUser, API_SERVER_HOST } from '../../api/userApi';

const host = API_SERVER_HOST;

const PartComponent = ({ buyNo }) => {
  const [chatroomInfo, setChatroomInfo] = useState(null);
  const [displayUsers, setDisplayUsers] = useState([]);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();
  const loginInfo = useSelector((state) => state.loginSlice);
  const userId = loginInfo?.id;

  useEffect(() => {
    const fetchChatroomData = async () => {
      try {
        const chatroomResponse = await chatUserInfoBuy(buyNo);
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
  }, [buyNo]);

  const handleResultModalClose = () => {
    setResult(null);
    window.location.reload();
  };

  const handleExitChatRoom = async () => {
    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('buyNo', buyNo);
      
      if (chatroomInfo.writerId === userId) {
        setResult('자신이 쓴 게시글은 참여를 취소할 수 없습니다.');
      } else {
        await exitChatRoomBuy(formData);
        setDisplayUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        setResult('참여를 취소했습니다.');
      }
    } catch (error) {
      setResult('참여 취소 실패:', error);
    }
  };

  const moveChat = () => {
    navigate('/myPage/chat');
  }

  return (
    <div className="side-part">
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
        {displayUsers.some((user) => user.id === userId) ? (
          <div className="flex mt-5">
            <button className="text-base text-white bg-blue-400 p-2 rounded-md w-1/2 mr-2 hover:bg-blue-500" onClick={moveChat}>
              채팅하기
            </button>
            <button className="text-base text-white bg-slate-400 p-2 rounded-md w-1/2 hover:bg-slate-500" onClick={handleExitChatRoom}>
              나가기
            </button>
          </div>
        )
        :
        (
          <></>
        )}
      </div>
      {result && <ResultModal title={'알림'} content={result} callbackFn={handleResultModalClose} />}
    </div>
  );
};

export default PartComponent;
