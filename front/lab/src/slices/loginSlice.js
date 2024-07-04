import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginPost } from '../api/userApi';
import { getCookie, removeCookie, setCookie } from '../util/cookieUtil';

const initState = {
  id: 0,
  email: '',
};

const loadUserCookie = () => {
  const userInfo = getCookie('user'); // 쿠키 꺼내기
  return userInfo;
};

export const loginPostAsync = createAsyncThunk('loginPostAsync', (param) => loginPost(param));
//export const loginPostAsync = createAsyncThunk('loginPostAsync', (param) => loginPost2(param));

const loginSlice = createSlice({
  name: 'loginSlice',
  // 쿠키가 존재하면 초기값은 loadMemberCookie() 아니면 빈 상태
  initialState: loadUserCookie() || initState,
  reducers: {
    login: (state, action) => {
      const data = action.payload; // 로그인한 정보 {email, pwd로 구성}
      setCookie('user', JSON.stringify(data), 1); // 로그인한 정보를 user에 저장 (1일 동안)

      return data; //새로운 상태
    },
    logout: () => {
      removeCookie('user'); // 로그아웃하면 쿠키 삭제
      return { ...initState }; // 초기 상태 (빈 문자열)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginPostAsync.fulfilled, (state, action) => {
        //console.log('fulfilled'); // 로그인 성공
        const payload = action.payload; // 로그인 성공한 결과(진짜 데이터)

        // error 속성이 없어 로그인 성공한 경우
        if (!payload.error) {
          setCookie('user', JSON.stringify(payload), 1); //  로그인한 정보를 user에 저장 (1일 동안)
          // 쿠키 이름을 user로 저장, payload 값을 문자열로 저장
          // 로그인하면 메모리에도 보관하고, 쿠키에도 보관
        }

        return payload;
      })
      .addCase(loginPostAsync.pending, (state, action) => {
        //console.log('pending'); // 로그인 중
      })
      .addCase(loginPostAsync.rejected, (state, action) => {
        //console.log('rejected'); // 로그인 실패
      });
  },
});

export const { login, logout } = loginSlice.actions;

export default loginSlice.reducer;
