import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { API_SERVER_HOST, getUser, modifyUserLocation } from '../../../api/userApi';

const initState = {
  id: 0,
  email: '',
  name: '',
  phone: '',
  nickname: '',
  pwd: '',
  pwdCheck: '',
  addr: '',
  detailAddr: '',
  profileImage: '',
  location: ''
};

const host = API_SERVER_HOST;

const MyInfoComponent = () => {
  const [user, setUser] = useState(initState);
  const [location, setLocation] = useState('');
  const [ info, setInfo ] = useState(false);
  const [ isFadingOut, setFadingOut ] = useState(false);
  const { kakao } = window;
  const loginInfo = useSelector((state) => state.loginSlice); // 전역상태에서 loginSlice는 로그인 사용자의 상태정보
  const ino = loginInfo.id;

  useEffect(() => {
    getUser(ino).then((data) => {
      setUser(data);
    });
  }, [ino, isFadingOut]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(successHandler, errorHandler); // 성공시 successHandler, 실패시 errorHandler 함수가 실행된다.
  }, []);

  const successHandler = (response) => {
    const { latitude, longitude } = response.coords;
    setLocation({ latitude, longitude });
  };

  const errorHandler = (error) => {
    console.log(error);
  };

  const getAddress = () => {
    const geocoder = new kakao.maps.services.Geocoder(); // 좌표 -> 주소로 변환해주는 객체
    const coord = new kakao.maps.LatLng(location.latitude, location.longitude); // 주소로 변환할 좌표 입력
    const callback = function (result) {
      const nowAddr = result[0].address.address_name;
      const latitude = location.latitude; // 위도(가로)
      const longitude = location.longitude; // 경도 (세로)
      modifyUserLocation(ino, latitude, longitude, nowAddr); // 상태값 변경된 거 DB에 반영
    };

    geocoder.coord2Address(coord.getLng(), coord.getLat(), callback); // 좌표로 법정동 상세 주소 정보를 요청합니다
  };

  const changeLocation = () => {
    showModal();
    getAddress();
  };

  const showModal = () => {
    setFadingOut(false);
    setInfo(true);
    setTimeout(() => {
      setFadingOut(true);
      setTimeout(() => {
        setInfo(false);
      }, 400); // 애니메이션 지속 시간 0.4초
    }, 1500); // 1.5초 후 모달 사라짐
  };

  return (
    <div className="font-Jua">
      <div className="flex justify-end">
        <Link to={'/myPage/info/modify'}>
          <button type="button" className="rounded p-1 my-4 text-base w-32 text-white bg-blue-400 hover:bg-blue-500">
            수정하기
          </button>
        </Link>
      </div>
      <div className="p-4 bg-gray-50">
        <div className="flex justify-center">
          <div className="w-1/3 p-3 text-left font-bold">프로필 사진</div>
          <div className="relative mb-4 flex w-full items-stretch">
            <img src={`${host}/api/user/display/${user.profileImage}`} alt="프로필이미지" className="rounded-full size-40 mx-auto" />
          </div>
        </div>

        <table className="w-full">
          <tr>
            <th className="w-1/4 text-left pl-4 py-6 border-r-2 border-gray-300">
            아이디
            </th>
            <td className="w-3/4 text-left pl-6">
            {user.email}
            </td>
          </tr>
          <tr>
            <th className="w-1/4 text-left pl-4 py-6 border-r-2 border-gray-300">
            이름
            </th>
            <td className="w-3/4 text-left pl-6">
            {user.name}
            </td>
          </tr>
          <tr>
            <th className="w-1/4 text-left pl-4 py-6 border-r-2 border-gray-300">
            휴대폰 번호
            </th>
            <td className="w-3/4 text-left pl-6">
            {user.phone}
            </td>
          </tr>
          <tr>
            <th className="w-1/4 text-left pl-4 py-6 border-r-2 border-gray-300">
            닉네임
            </th>
            <td className="w-3/4 text-left pl-6">
            {user.nickname}
            </td>
          </tr>
          <tr>
            <th className="w-1/4 text-left pl-4 py-6 border-r-2 border-gray-300">
            기본 주소지
            </th>
            <td className="w-3/4 text-left pl-6">
            {user.addr} {user.detailAddr}
            </td>
          </tr>
          <tr>
            <th className="w-1/4 text-left pl-4 py-6 border-r-2 border-gray-300">
            현재 위치
            </th>
            <td className="w-3/4 text-left pl-6">
            {user.location}
            <button onClick={changeLocation} className="bg-mainColor text-white font-semibold text-sm rounded-full ml-2 px-2 py-1 hover:bg-teal-600">
              기본 주소지로 변경
            </button>
            </td>
          </tr>
        </table>
      </div>
      {info && (
        <>
          <div className="fixed inset-0 flex items-center justify-center z-[2000]">
            <div
              className={`bg-white px-44 py-3 rounded-full shadow border transition-opacity duration-400 ease-in-out ${
                isFadingOut ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <p className="text-black font-semibold">현재 위치가 설정되었습니다</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default MyInfoComponent;
