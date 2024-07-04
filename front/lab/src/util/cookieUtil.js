import { Cookies } from 'react-cookie';

const cookies = new Cookies();

export const setCookie = (name, value, days = 1) => {
  const expires = new Date();
  expires.setUTCDate(expires.getUTCDate() + days); //보관기한(날짜처리)
  return cookies.set(name, value, { path: '/', expires: expires });
};

export const getCookie = (name) => {
  return cookies.get(name);
};

// 로그아웃 시 쿠키 삭제
export const removeCookie = (name, path = '/') => {
  cookies.remove(name, { path }); // path에 있는 쿠키 삭제
};
