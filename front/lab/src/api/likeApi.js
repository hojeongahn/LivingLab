import axios from 'axios';
export const API_SERVER_HOST = 'http://localhost:8282';
const prefix = `${API_SERVER_HOST}/api/like`;

/* ============공동구매============== */

export const likeClick = async(type, no, id) => {
    const res = await axios.post(`${prefix}/likeClick`,{
            type: type,
            no: no,
            id: id
    });
    return res.data;
};

export const unlikeClick = async(likeNo) => {
    const res = await axios.delete(`${prefix}/unlikeClick/${likeNo}`);
    return res.data;
};

export const likeInfo = async(type, no, id) => {
    const res = await axios.get(`${prefix}/likeInfo`,{
        params : {
            type: type,
            no: no,
            id: id
        }
    });
    return res.data;
};

/* ============동네모임============== */

export const likeTeam = async(likeTeam) => {
    const res = await axios.post(`${prefix}/team`,likeTeam);
    return res.data;
};

export const unlikeTeam = async(likeNo) => {
    const res = await axios.delete(`${prefix}/team/${likeNo}`);
    return res.data;
};

export const likeInfoTeam = async(teamNo, id) => {
    const res = await axios.get(`${prefix}/team`,{
        params : {
            teamNo: teamNo,
            id: id
        }
    });
    return res.data;
};


/* ============동네장터============== */

export const likeMarket = async(likeMarket) => {
    const res = await axios.post(`${prefix}/market`,likeMarket);
    return res.data;
};

export const unlikeMarket = async(likeNo) => {
    const res = await axios.delete(`${prefix}/market/${likeNo}`);
    return res.data;
};

export const likeInfoMarket = async(marketNo, id) => {
    const res = await axios.get(`${prefix}/market`,{
        params : {
            marketNo: marketNo,
            id: id
        }
    });
    return res.data;
};


/* ============자취방쉐어============== */

export const likeRoom = async(likeRoom) => {
    const res = await axios.post(`${prefix}/shareRoom`,likeRoom);
    return res.data;
};

export const unlikeRoom = async(likeNo) => { // 좋아요 단건 삭제
    const res = await axios.delete(`${prefix}/shareRoom/${likeNo}`);
    return res.data;
};

export const deleteLikeRoom = async (roomNo) => { // 해당 글에 찍힌 모든 좋아요 삭제
    const res = await axios.delete(`${prefix}/shareRoom/all/${roomNo}`);
    console.log('deleting ', res.data);
    return res.data;
};

export const likeInfoRoom = async(roomNo, id) => {
    const res = await axios.get(`${prefix}/shareRoom`,{
        params : {
            roomNo: roomNo,
            id: id
        }
    });
    return res.data;
};

/* ============커뮤니티============== */

export const likeComm = async(likeComm) => {
    const res = await axios.post(`${prefix}/comm`,likeComm);
    return res.data;
};

export const unlikeComm = async(likeNo) => {
    const res = await axios.delete(`${prefix}/comm/${likeNo}`);
    return res.data;
};

export const likeInfoComm = async(commNo, id) => {
    const res = await axios.get(`${prefix}/comm`,{
        params : {
            commNo: commNo,
            id: id
        }
    });
    return res.data;
};