// 로그인 관련 커스텀 훅
import { Navigate, useNavigate, createSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginPostAsync, logout } from '../slices/loginSlice';

const useCustomLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginState = useSelector((state) => state.loginSlice); // 로그인 상태

  const isLogin = loginState.email ? true : false; // 로그인 여부

  // 로그인 함수
  const doLogin = async (loginParam) => {
    const action = await dispatch(loginPostAsync(loginParam));
    return action.payload;
  };

  // 로그아웃 함수
  const doLogout = () => {
    dispatch(logout());
  };

  // 페이지 이동
  const moveToPath = (path) => {
    navigate({ pathname: path }, { replace: true });
  };

  //로그인 페이지로 이동
  const moveToLogin = () => {
    navigate({ pathname: '/user/login' }, { replace: true });
  };

  const moveToJoin = () => {
    navigate({ pathname: '/user/join' }, { replace: true });
  }

  //로그인 페이지로 이동 컴포넌트
  const moveToLoginReturn = () => {
    return <Navigate replace to="/user/login" />;
  };

  // 토큰에 따른 예외 처리
  const exceptionHandle = (ex) => {
    console.log('Exception-----------------',ex);

    const errorMsg = ex.response.data.error;
    const errorStr = createSearchParams({ error: errorMsg }).toString();

    if (errorMsg === 'REQUIRE_LOGIN') {
      alert('로그인 해야만 합니다.');
      navigate({ pathname: '/user/login', search: errorStr }); // 로그인 페이지로 이동
      return;
    }

    if (ex.response.data.error === 'ERROR_ACCESSDENIED') {
      alert('해당메뉴를 사용할 수 있는 권한이 없습니다.');
      navigate({ pathname: '/', search: errorStr }); // 홈으로 이동
      return;
    }
  };

  return {
    loginState,
    isLogin,
    doLogin,
    doLogout,
    moveToPath,
    moveToLogin,
    moveToLoginReturn,
    exceptionHandle,
    moveToJoin
  };
};

export default useCustomLogin;
