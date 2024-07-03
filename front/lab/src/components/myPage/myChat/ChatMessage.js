import React from 'react';
import { useSelector } from 'react-redux';
import { getUser, API_SERVER_HOST } from '../../../api/userApi';

const host = API_SERVER_HOST;

const ChatMessage = ({ message }) => {
  const { sender, message: content } = message; // message 객체에서 sender와 content 추출
  const loginInfo = useSelector((state) => state.loginSlice);
  const { nickname } = loginInfo;

  return (
    <div>
      {message.sender === nickname ? (
        <div className="flex justify-end">
          <div className="px-4 py-2 m-1 rounded-3xl text-lg bg-mainColor text-white shadow">{content}</div>
        </div>
      ) : (
        <div className="relative">
          <span className="absolute top-1.5 left-14 text-sm text-gray-500 transform -translate-y-full ml-2">{message.sender}</span>
          <div className="flex justify-start items-center ml-2 mt-3">
            <img alt="Profile_Img" src={`${host}/api/user/display/${message.senderProfileImage}`} className="rounded-full size-10 mr-2" />
            <div className="px-4 py-2 m-2 rounded-3xl text-lg bg-white text-black shadow">{content}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
