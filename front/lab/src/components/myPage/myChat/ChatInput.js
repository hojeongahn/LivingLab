import React, { useState } from 'react';

const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() === '') return; // 메시지가 비어있으면 전송하지 않음
    onSend(message); // 부모 컴포넌트로부터 전달받은 onSend 함수 호출
    setMessage(''); // 메시지 입력창 초기화
  };
    return (
      <form onSubmit={handleSubmit} className="flex p-4 bg-white border-t rounded-b">
        <input
          type="text"
          value={message}
          onChange={handleChange}
          // onKeyDown={onKeyDown}
          className="flex-1 p-2 border rounded-3xl text-base"
          placeholder="메시지를 입력하세요"
        />
        <button type="submit" className="ml-2 p-2 bg-teal-400 hover:bg-teal-500 text-white rounded-lg text-base">
          보내기
        </button>
      </form>
    );
  };

export default ChatInput;
