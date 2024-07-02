import axios from 'axios';
export const API_SERVER_HOST = 'http://localhost:8282';
const prefix = `${API_SERVER_HOST}/api/buy`;

export const getOne = async (buyNo) => {
  const res = await axios.get(`${prefix}/read/${buyNo}`);
  return res.data;
};

export const getList = async (pageParam, search, sort, category, latitude, longitude) => {
  const { page, size } = pageParam;
  const res = await axios.get(`${prefix}/list`, { params: { page: page, size: size, search: search, sort: sort, category:category, latitude: latitude, longitude: longitude } });
  return res.data;
};

export const postAddBuy = async (buy) => {
  const header = { headers: { 'Content-Type': 'multipart/form-data' } };
  const res = await axios.post(`${prefix}/add`, buy, header);
  return res.data;
};

export const modify = async (buyNo, buy) => {
  const header = { headers: { 'Content-Type': 'multipart/form-data' } };
  const res = await axios.put(`${prefix}/modify/${buyNo}`, buy, header);
  return res.data;
};

export const deleteOne = async (buyNo) => {
  const res = await axios.delete(`${prefix}/delete/${buyNo}`);
  return res.data;
};

export const increaseLike = async (buyNo) => {
  const res = await axios.put(`${prefix}/increase/${buyNo}`);
  return res.data;
};

export const decreaseLike = async (buyNo) => {
  const res = await axios.put(`${prefix}/decrease/${buyNo}`);
  return res.data;
};

// ******공동구매 최신 글 보기******

export const getLatestBuy = async (pageParam) => {
  const { page, size } = pageParam;
  const res = await axios.get(`${prefix}/latest`, { params: { page: page, size: size } });
  return res.data;
};


/* 마이페이지 내가 작성한 글 조회 */
export const myList = async (id) => {
  const res = await axios.get(`${prefix}/mylist/${id}`);
  return res.data;
};

export const myListAll = async (pageParam, id) => {
  const { page, size } = pageParam;
  const res = await axios.get(`${prefix}/mylistall`, { params: { page: page, size: size, id: id} });
  return res.data;
};

export const updateBuyFlag = (buyNo, flag) => {
  return axios.post(`${API_SERVER_HOST}/api/buy/updateFlag`, { buyNo, flag });
};