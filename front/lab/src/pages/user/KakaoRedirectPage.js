import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAccessToken, getUserWithAccessToken } from '../../api/kakaoApi';
import { useDispatch } from 'react-redux';
import { login } from '../../slices/loginSlice';
import useCustomLogin from '../../hooks/useCustomLogin';

// 인가 코드의 페이지 처리

const KakaoRedirectPage = (props) => {
  const [searchParams] = useSearchParams();

  const { moveToPath } = useCustomLogin();

  const authCode = searchParams.get('code');

  const dispatch = useDispatch();

  // 카카오 api에 있는 데이터 호출
  useEffect(() => {
    getAccessToken(authCode).then((accessToken) => {
      getUserWithAccessToken(accessToken).then((userInfo) => {
        dispatch(login(userInfo));

        // 로그인 후 회원이 소셜로그인으로 들어온 경우, 회원 정보 수정 페이지로 이동(향후에 수정해야됨)
        if (userInfo) {
          moveToPath('/');
        } else {
          moveToPath('/user/login');
        }
      });
    });
  }, [authCode]);

  // result JSON 데이터 및 로그인했을 때 나왔던 정보

  return (
    <div>
      <div>kakao Login Redirect</div>
      {/* <div>{authCode}</div> */}
    </div>
  );
};

export default KakaoRedirectPage;
