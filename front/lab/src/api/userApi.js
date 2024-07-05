import axios from 'axios';
export const API_SERVER_HOST = 'http://localhost:8282';

const host = `${API_SERVER_HOST}/api/user`;

// 로그인
export const loginPost = async (loginParam) => {
  //const header = { headers: { 'Content-Type': 'x-www-form-urlencoded' } };
  const header = { headers: { 'Content-Type': 'application/json' } };

  const form = new FormData();
  form.append('email', loginParam.email);
  form.append('pwd', loginParam.pwd);

  const res = await axios.post(`${host}/login`, form, header);

  return res.data;
};

// 회원가입(FormData 객체를 사용하여 파일과 JSON 데이터를 분리하여 전송)
export const joinUser = async (formdata) => {
  const header = {headers:{"Content-Type":"multipart/form-data"}};
  const res = await axios.post(`${host}/join`, formdata, header);
  return res.data;
};

export const modifyUser = async (id, user) => {
  const header = { headers: { 'Content-Type': 'multipart/form-data' } };
  const res = await axios.put(`${host}/modify/${id}`, user, header);
  return res.data;
};

// 회원정보 조회
export const getUser = async (id) => {
  const res = await axios.get(`${host}/${id}`);
  return res.data;
};

//아이디(이메일) 찾기
export const findId = async (userDto) => {
  const header = { headers: { 'Content-Type': 'application/json' } };
  const res = await axios.post(`${host}/findId`, userDto, header);
  return res.data;
}

//비밀번호 알려주기(인증번호 확인 후 단계)
export const findPwd = async ( email ) => {
  const header = { headers: { 'Content-Type': 'application/json' } };
  const res = await axios.post(`${host}/findPwd`, { email } , header );
  return res.data;
}

// 중복 이메일 체크
export const CheckEmail = async (email) => {
  const res = await axios.get(`${host}/join/checkEmail/${email}`);
  return res.data;
}

// 중복 닉네임 체크
export const CheckNickname = async (nickname) => {
  const res = await axios.get(`${host}/join/checkNickname/${nickname}`);
  return res.data;
}


