import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getChatRoom } from '../../../api/chatApi';
import bubble1 from '../../../resources/images/bubble1.png';
import bubble2 from '../../../resources/images/bubble2.png';
import bubble3 from '../../../resources/images/bubble3.png';
import bubble4 from '../../../resources/images/bubble4.png';

const ChatList = ({ onSelectChat }) => {
  const [chatRooms, setChatRooms] = useState('');
  const loginInfo = useSelector((state) => state.loginSlice);
  const id = loginInfo.id;

  useEffect(() => {
    getChatRoom(id).then((response) => {
      setChatRooms(response);
    });
  }, [id]);

  return (
    <div className="h-full">
      {chatRooms.data && chatRooms.data.length > 0 ? (
        chatRooms.data.map((room) => (
          <div key={room.roomId} className="py-7 px-5 cursor-pointer hover:bg-gray-100 border-b flex items-center" onClick={() => onSelectChat(room)}>
            { room.type === '공동구매' && <img src={bubble1} alt="Profile" className="rounded-full w-10 h-10 mr-2"/>}
            { room.type === '동네모임' && <img src={bubble2} alt="Profile" className="rounded-full w-10 h-10 mr-2"/>}
            { room.type === '동네장터' && <img src={bubble3} alt="Profile" className="rounded-full w-10 h-10 mr-2"/>}
            { room.type === '자취방쉐어' && <img src={bubble4} alt="Profile" className="rounded-full w-10 h-10 mr-2"/>}
            <div>
              <h2 className="text-lg font-bold">{room.title}</h2>
              <p className="text-sm text-gray-500"> {room.type} 채팅방</p>
            </div>
          </div>
        ))
      ) : (
        <div className="p-7 flex items-center">참여 중인 채팅방이 없습니다</div>
      )}
    </div>
  );
};

export default ChatList;
