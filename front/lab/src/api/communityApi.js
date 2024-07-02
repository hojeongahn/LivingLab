import axios from "axios";
export const API_SERVER_HOST = 'http://localhost:8282';
const prefix = `${API_SERVER_HOST}/api/community`;

// ******자취 TIP 게시판******
export const postAddTip = async(tip) => {
    const header = {headers:{"Content-Type":"multipart/form-data"}};
    const res = await axios.post(`${prefix}/tip/add`, tip, header);
    return res.data;
}

export const getListTip = async(pageParam, search, sort) => {
    const {page, size} = pageParam
    const res =await axios.get(`${prefix}/tip/list`, {params:{page:page, size:size, search: search, sort: sort}})
    return res.data
}

export const getOneTip = async(commNo) => {
    const res = await axios.get(`${prefix}/tip/read/${commNo}`);
    return res.data;
}

export const modifyTip = async(commNo, tip) => {
    const header = {headers:{"Content-Type":"multipart/form-data"}};
    const res = await axios.put(`${prefix}/tip/modify/${commNo}`, tip, header);
    return res.data;
}

export const deleteOne = async(commNo) => {
    const res = await axios.delete(`${prefix}/delete/${commNo}`);
    return res.data;
}

// ******질문 게시판******
export const postAddQna = async(qna) => {
    const header = {headers:{"Content-Type":"multipart/form-data"}};
    const res = await axios.post(`${prefix}/qna/add`, qna, header);
    return res.data;
}

export const getListQna = async(pageParam, search, sort) => {
    const {page, size} = pageParam
    const res =await axios.get(`${prefix}/qna/list`, {params:{page:page, size:size, search: search, sort: sort}})
    return res.data
}

export const getOneQna = async(commNo) => {
    const res = await axios.get(`${prefix}/qna/read/${commNo}`);
    return res.data;
}

export const modifyQna = async(commNo, qna) => {
    const header = {headers:{"Content-Type":"multipart/form-data"}};
    const res = await axios.put(`${prefix}/qna/modify/${commNo}`, qna, header);
    return res.data;
}

// ******리뷰 게시판******
export const postAddReview = async(review) => {
    const header = {headers:{"Content-Type":"multipart/form-data"}};
    const res = await axios.post(`${prefix}/review/add`, review, header);
    return res.data;
}

export const getListReview = async(pageParam, search, sort) => {
    const {page, size} = pageParam
    const res =await axios.get(`${prefix}/review/list`, {params:{page:page, size:size, search: search, sort: sort}})
    return res.data
}

export const getOneReview = async(commNo) => {
    const res = await axios.get(`${prefix}/review/read/${commNo}`);
    return res.data;
}

export const modifyReview = async(commNo, review) => {
    const header = {headers:{"Content-Type":"multipart/form-data"}};
    const res = await axios.put(`${prefix}/review/modify/${commNo}`, review, header);
    return res.data;
}

// ******도움요청 게시판******
export const postAddHelp = async(help) => {
    const header = {headers:{"Content-Type":"multipart/form-data"}};
    const res = await axios.post(`${prefix}/help/add`, help, header);
    return res.data;
}

export const getListHelp = async(pageParam) => {
    const {page, size} = pageParam
    const res =await axios.get(`${prefix}/help/list`, {params:{page:page, size:size}})
    return res.data
}

export const getOneHelp = async(commNo) => {
    const res = await axios.get(`${prefix}/help/read/${commNo}`);
    return res.data;
}

export const modifyHelp = async(commNo, help) => {
    const header = {headers:{"Content-Type":"multipart/form-data"}};
    const res = await axios.put(`${prefix}/help/modify/${commNo}`, help, header);
    return res.data;
}

export const increaseLike = async (commNo) => {
    const res = await axios.put(`${prefix}/increase/${commNo}`);
    return res.data;
  };
  
  export const decreaseLike = async (commNo) => {
    const res = await axios.put(`${prefix}/decrease/${commNo}`);
    return res.data;
  };

// ******커뮤니티 최신 글 보기******
export const getLatestComm = async (pageParam) => {
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


  export const getType = async(commNo) => {
    const res = await axios.get(`${prefix}/type/${commNo}`);
    return res.data;
}
