import React, { useState, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';  // Stomp.js의 브라우저 버전인 webstomp-client 사용
import { useSelector } from 'react-redux';
import { getChatHistory } from '../../../api/chatApi';


const ChatWindow = ({ room }) => {
  const navigate = useNavigate();
  //const [messages, setMessages] = useState(initState);
  // const [messages, setMessages] = useState([
  //   { id: 1, text: '안녕!', sender: 'other' },
  //   { id: 2, text: '오랜만이야', sender: 'other' },
  //   { id: 3, text: '잘 지내?', sender: 'me' },
  // ]);
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const loginInfo = useSelector((state) => state.loginSlice);
  const nickname = loginInfo.nickname;

  useEffect(() => {
    const socket = new SockJS('http://localhost:8282/ws'); // SockJS 연결 URL
    const stomp = Stomp.over(socket);

    stomp.connect({}, frame => {
      console.log('연결: ' + frame);
      setStompClient(stomp);
    }, error => {
      console.error('연결 에러: ', error);
    });

    return () => {
      if (stompClient) stompClient.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await getChatHistory(room.roomId); // 수정된 API 호출
        setMessages(res.data.messageHistory);

      } catch (error) {
        console.error('채팅 기록 불러오기 실패: ', error);
      }
    };

    // 의존성 배열에 room.roomId 추가하여 해당 값이 변경될 때만 호출
    fetchChatHistory();
  }, [room.roomId]);

  useEffect(() => {
    if (!stompClient) return;

    // 채팅방 topic을 구독하여 메시지 수신
    const subscription = stompClient.subscribe(`/topic/chat/room/${room.roomId}`, message => {
      const receivedMessage = JSON.parse(message.body);
      console.log('받은 메시지:', receivedMessage);
      setMessages(prevMessages => [...prevMessages, receivedMessage]);
    }, error => {
      console.error('구독 실패: ', error);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [stompClient, room.roomId]);

  // const handleSend = (message) => {
  //   setMessages([...messages, { id: messages.length + 1, text: message, sender: 'me' }]);
  // };

  const handleSend = (message) => {
    if (!stompClient || !message) return;

    const newMessage = {
      type: 'TALK',
      roomId: room.roomId,
      message: message,
      sender: nickname,
      userId: loginInfo.id
    };

    console.log('보낸 메세지: ', newMessage);

    // WebSocket을 통해 메시지 전송
    stompClient.send('/app/chat/message', JSON.stringify(newMessage), {});
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getRoomInfo = (data) => {
    if (data.buyNo) return { value: data.buyNo };
    if (data.teamNo) return { value: data.teamNo };
    if (data.marketNo) return { value: data.marketNo };
    if (data.roomNo) return { value: data.roomNo };
    return { value: '' };
  };

  const { value } = getRoomInfo(room);

  //채팅방 제목 클릭시 해당 게시물로 이동
  const handleClickTitle = (type, value) => {
    if (type === '공동구매' && value) {
      navigate(`/buy/read/${value}`);
    }
    else if (type === '동네모임' && value) {
      navigate(`/team/read/${value}`);
    }
    else if (type === '동네장터' && value) {
      navigate(`/market/read/${value}`);
    }
    else if (type === '자취방쉐어' && value) {
      navigate(`/shareRoom/read/${value}`);
    }
    else {
      alert('삭제된 게시물입니다');
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 bg-gray-600 text-white rounded-t">
        {/* 채팅방 정보 표시 */}
        <div className="text-sm flex items-center">
          <span className="bg-mainColor px-2 py-1 mr-1 rounded-2xl">{room.type}</span>
          <span className="hover:underline cursor-pointer" onClick={() => handleClickTitle(room.type, value)}>{room.title} / 채팅방번호:{room.roomId}</span>
        </div>
        {/* 사이드바 토글 버튼 */}
        <div className="text-sm flex items-center">
          {/* <span className="bg-white px-2 py-1 ml-1 rounded text-black font-bold">3명 참여중</span> */}
          <button
            onClick={toggleSidebar}
            className="ml-2 bg-gray-700 hover:bg-gray-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
            ☰
          </button>
        </div>
      </div>
      {/* 메시지 목록 표시 영역 */}
      <div className="flex-1 overflow-y-auto p-2 bg-slate-100 relative overflow-x-hidden">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        {/* 참여자 목록 사이드바 */}
        <div
          className={`absolute top-0 right-0 h-full bg-white shadow-lg transition-transform transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
            } w-1/3 flex flex-col`}
        >
          <div className="p-4 border-b">
            <h2 className="text-base font-bold">참여자 목록</h2>
            <button
              onClick={toggleSidebar}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
              &times;
            </button>
          </div>
          <div className="flex-grow p-4 overflow-y-auto text-base">
            <ul>
              <li>참여자 1</li>
              <li>참여자 2</li>
              <li>참여자 3</li>
            </ul>
          </div>
          <div className="p-4 border-t">
            <button
              onClick={toggleSidebar}
              className="w-full py-2 px-4 text-base bg-red-400 text-white font-bold rounded hover:bg-red-500"
            >
              나가기
            </button>
          </div>
        </div>
      </div>
      {/* 메시지 입력창 */}
      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default ChatWindow;
