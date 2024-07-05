import axios from 'axios';
export const API_SERVER_HOST = 'http://localhost:8282';

const host = `${API_SERVER_HOST}/api/chat`;

// 작성자가 게시글 작성 시 자동으로 채팅방 생성, 입장
export const postCreateRoom = async (userId, title, type, createRequest) => {
  const res = await axios.post(`${host}/room/create`, createRequest, {
    params: { userId, title, type }
  });
  return res.data;
};

// 채팅방의 유저들 목록
export const getList = async (roomId) => {
  const res = await axios.get(`${host}/room/userList`, { params: { roomId } });
  return res.data;
};

// 특정 채팅방 삭제
export const deleteChatRoom = async (roomId) => {
  const res = await axios.delete(`${host}/room/delete/${roomId}`);
  return res.data;
};

// 채팅 기록 조회
export const getChatHistory = async (roomId) => {
  const res = await axios.get(`${host}/room/history/${roomId}`);
  return res.data;
};

// 유저의 모든 채팅방 목록 반환
export const getChatRoom = async (userId) => {
  const res = await axios.get(`${host}/rooms`, { params: { userId } });
  return res.data;
};

// 공동구매 채팅방의 유저 조회(참여하기 표시)
export const chatUserInfoBuy = async (buyNo) => {
  const res = await axios.get(`${host}/room/buy/get`, {
    params: { buyNo }
  });
  return res.data;
};

// 공동구매 채팅방 입장(참여)
export const enterChatRoomBuy = async (formData) => {
  const response = await axios.post(`${host}/room/buy/enter`, formData);
      return response.data;
};

// 공동구매 채팅방 퇴장(참여x)
export const exitChatRoomBuy = async (formData) => {
  const response = await axios.post(`${host}/room/buy/exit`, formData);
      return response.data;
};

// 동네모임 채팅방의 유저 조회(참여하기 표시)
export const chatUserInfoTeam = async (teamNo) => {
  const res = await axios.get(`${host}/room/team/get`, {
    params: { teamNo }
  });
  return res.data;
};

// 동네모임 채팅방 입장(참여)
export const enterChatRoomTeam = async (formData) => {
  const response = await axios.post(`${host}/room/team/enter`, formData);
      return response.data;
};

// 동네모임 채팅방 퇴장(참여x)
export const exitChatRoomTeam = async (formData) => {
  const response = await axios.post(`${host}/room/team/exit`, formData);
      return response.data;
};

// 동네장터 채팅방의 유저 조회(참여하기 표시)
export const chatUserInfoMarket = async (marketNo) => {
  const res = await axios.get(`${host}/room/market/get`, {
    params: { marketNo }
  });
  return res.data;
};

// 동네장터 채팅방 퇴장
export const exitChatRoomMarket = async (formData) => {
  const response = await axios.delete(`${host}/room/market/exit`, {
    data: formData
  });
  return response.data;
};

// 자취방쉐어 채팅방의 유저 조회
export const chatUserInfoShare = async (roomNo) => {
  const res = await axios.get(`${host}/room/shareRoom/get`, {
    params: { roomNo }
  });
  return res.data;
};

// 자취방쉐어 채팅방 퇴장
export const exitChatRoomShare = async (formData) => {
  const response = await axios.delete(`${host}/room/shareRoom/exit`, {
    data: formData
  });
      return response.data;
};






