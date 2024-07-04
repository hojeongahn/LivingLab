import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { API_SERVER_HOST, getUser } from '../../../api/userApi';

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
};

const host = API_SERVER_HOST;

const MyInfoComponent = () => {
  const [user, setUser] = useState(initState);
  const loginInfo = useSelector((state) => state.loginSlice); // 전역상태에서 loginSlice는 로그인 사용자의 상태정보
  const ino = loginInfo.id;

  console.log(ino);

  useEffect(() => {
    getUser(ino).then((data) => {
      setUser(data);
    });
  }, [ino]);

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
            주소
            </th>
            <td className="w-3/4 text-left pl-6">
            {user.addr} {user.detailAddr}
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
};
export default MyInfoComponent;
