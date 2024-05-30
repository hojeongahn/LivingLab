import axios from "axios";
export const API_SERVER_HOST = 'http://localhost:8282';
const prefix = `${API_SERVER_HOST}/api/market`;

export const getList = async (pageParam) => {
    const { page, size } = pageParam;
    const res = await axios.get(`${prefix}/list`, {params: { page: page, size: size }});
    return res.data;
  };