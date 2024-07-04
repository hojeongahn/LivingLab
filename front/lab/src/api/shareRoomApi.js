import axios from 'axios';
export const API_SERVER_HOST = 'http://localhost:8282';
const prefix = `${API_SERVER_HOST}/api/shareRoom`;

export const getList = async (pageParam, search, sort) => {
  const { page, size } = pageParam;
  const res = await axios.get(`${prefix}/list`, {params: { page: page, size: size, search: search, sort: sort }});
  return res.data;
};

export const getOne = async (roomNo) => {
  const res = await axios.get(`${prefix}/read/${roomNo}`);
  return res.data;
};

export const modify = async(roomNo,shareRoom) => {
  const header = {headers:{"Content-Type":"multipart/form-data"}};
  const res = await axios.put(`${prefix}/modify/${roomNo}`,shareRoom, header);
  return res.data;
};

export const hideOne = async(roomNo,shareRoom) => {
  const header = {headers:{"Content-Type":"multipart/form-data"}};
  const res = await axios.put(`${prefix}/hide/${roomNo}`,shareRoom, header);
  return res.data;
};

export const postAddShareRoom = async (shareRoom) => {
    const header = { headers: { "Content-Type": "multipart/form-data" } };
    const res = await axios.post(`${prefix}/add`, shareRoom, header);
    return res.data;
}

export const deleteOne = async (roomNo) => {
  const res = await axios.delete(`${prefix}/${roomNo}`);
  return res.data;
};

export const increaseLike = async(roomNo) => {
  const res = await axios.put(`${prefix}/increase/${roomNo}`);
  return res.data;
}

export const decreaseLike = async(roomNo) => {
  const res = await axios.put(`${prefix}/decrease/${roomNo}`);
  return res.data;
}

export const getLatestShareRoom = async (pageParam) => {
  const { page, size } = pageParam;
  const res = await axios.get(`${prefix}/latest`, { params: { page: page, size: size } });
  return res.data;
}

/* 마이페이지 내가 작성한 글 조회 */
export const myList = async (id) => {
  const res = await axios.get(`${prefix}/mylist/${id}`);
  return res.data;
}

export const myListAll = async (pageParam, id) => {
  const { page, size } = pageParam;
  const res = await axios.get(`${prefix}/mylistall`, { params: { page: page, size: size, id: id} });
  return res.data;
};
