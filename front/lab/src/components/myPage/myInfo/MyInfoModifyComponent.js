import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { API_SERVER_HOST, modifyUser, getUser } from '../../../api/userApi';
import { Link } from 'react-router-dom';
import PostComponent from '../../common/PostComponent';

const initState = {
  id: '',
  email: '',
  name: '',
  phone: '',
  nickname: '',
  pwd: '',
  pwdCheck: '',
  addr: '',
  detailAddr: '',
  file: null,
  location: '',
  latitude: 0.0,
  longitude: 0.0,
};

const host = API_SERVER_HOST;

const MyInfoModifyComponent = () => {
  const [user, setUser] = useState(initState);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [isModified, setIsModified] = useState(false); // 수정 여부 상태 추가
  const loginInfo = useSelector((state) => state.loginSlice);
  const [address, setAddress] = useState();
  const ino = loginInfo.id;

  useEffect(() => {
    getUser(ino).then((data) => {
      setUser(data);
      setAddress(data.addr);
      console.log(data);
    });
  }, [ino]);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
    setIsModified(true); // 입력값이 변경될 때마다 수정 여부를 true로 설정
  };

  const handleAddrChange = (newAddr) => {
    setAddress(newAddr);
    setUser({
      ...user,
      addr: newAddr,
    });
    setIsModified(true); // 주소가 변경될 때마다 수정 여부를 true로 설정
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewImageUrl(imageUrl);
      setIsModified(true); // 이미지 파일이 변경될 때마다 수정 여부를 true로 설정
    }
  };

  const handleFileClick = () => {
    inputRef.current.click();
  };

  const handleFileDelete = () => {
    setProfileImageFile(null);
    setPreviewImageUrl(null);
    setIsModified(true); // 파일 삭제 시 수정 여부를 true로 설정
  };

  const handleClickModify = async () => {
    const formData = new FormData();
    if (profileImageFile) {
      formData.append('file', profileImageFile);
    } 
    formData.append('id', user.id);
    formData.append('email', user.email);
    formData.append('name', user.name);
    formData.append('phone', user.phone);
    formData.append('nickname', user.nickname);
    formData.append('pwd', user.pwd);
    formData.append('pwdCheck', user.pwdCheck);
    formData.append('addr', user.addr);
    formData.append('detailAddr', user.detailAddr);
    formData.append('location', user.location);
    formData.append('latitude', user.latitude);
    formData.append('longitude', user.longitude);

    try {
      await modifyUser(user.id, formData);
      alert('회원정보 수정 완료되었습니다');
      window.location.reload();
    } catch (error) {
      console.error('사용자 정보 수정 에러:', error);
    }
  };

  const inputRef = useRef(null);

  return (
    <div>
      <div>
        <div className="flex justify-end">
          <Link to={'/myPage/info'}>
            <button type="button" className="rounded p-1 my-4 text-base w-32 text-white bg-gray-400 hover:bg-gray-500">
              뒤로 가기
            </button>
          </Link>
        </div>
        <div className="border-2 border-sky-200 p-4 bg-gray-50">
          <div className="flex justify-center">
            <div className="w-1/3 p-3 text-left font-bold">프로필 사진</div>
            <div className="relative mb-4 flex w-full items-stretch">
              <div className="mt-2">
                <img src={previewImageUrl ? previewImageUrl : `${host}/api/user/display/${user.profileImage}`} alt="프로필이미지" className="rounded-full size-40 mx-auto" />
                <div className="flex mt-2 text-center">
                  <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} ref={inputRef} />
                  <button
                    className="block w-full text-sm text-white bg-blue-400 rounded-md px-4 py-2 mr-2 hover:bg-blue-500"
                    onClick={handleFileClick}
                  >
                   변경
                  </button>
                  <button
                    className="block w-full text-sm text-white bg-red-400 rounded-md px-4 py-2  hover:bg-red-500"
                    onClick={handleFileDelete} // 파일 삭제 버튼 클릭 시 처리 함수 연결
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-1/3 p-3 text-left font-bold">아이디</div>
            <div className="relative mb-4 flex w-full items-stretch">
              <input className="w-full p-3 rounded-r border border-solid border-neutral-300 shadow-md" name="email" type="text" value={user.email} readOnly />
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-1/3 p-3 text-left font-bold">이름</div>
            <div className="relative mb-4 flex w-full items-stretch">
              <input
                className="w-full p-3 rounded-r border border-solid border-neutral-300 shadow-md"
                name="name"
                type="text"
                value={user.name}
                placeholder="이름"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-1/3 p-3 text-left font-bold">휴대폰 번호</div>
            <div className="relative mb-4 flex w-full items-stretch">
              <input
                className="w-full p-3 rounded-r border border-solid border-neutral-300 shadow-md"
                name="phone"
                type="text"
                value={user.phone}
                placeholder="전화번호"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-1/3 p-3 text-left font-bold">닉네임</div>
            <div className="relative mb-4 flex w-full items-stretch">
              <input
                className="w-full p-3 rounded-r border border-solid border-neutral-300 shadow-md"
                name="nickname"
                type="text"
                value={user.nickname}
                placeholder="닉네임"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-1/3 p-3 text-left font-bold">비밀번호</div>
            <div className="relative mb-4 flex w-full items-stretch">
              <input
                className="w-full p-3 rounded-r border border-solid border-neutral-300 shadow-md"
                name="pwd"
                type="password"
                value={user.pwd}
                placeholder="비밀번호를 입력하세요"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-1/3 p-3 text-left font-bold">비밀번호 확인</div>
            <div className="relative mb-4 flex w-full items-stretch">
              <input
                className="w-full p-3 rounded-r border border-solid border-neutral-300 shadow-md"
                name="pwdCheck"
                type="password"
                value={user.pwdCheck}
                placeholder="비밀번호 확인"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-1/3 p-3 text-left font-bold">기본 주소지</div>
            <div className="relative mb-4 w-full items-stretch">
              <div className="w-44">
                <PostComponent setAddress={handleAddrChange}></PostComponent>
              </div>
              <input
                className="w-full p-3 rounded-r border border-solid border-neutral-300 shadow-md"
                name="addr"
                type="text"
                placeholder="주소(우편번호 및 도로명 검색)"
                value={address}
                readOnly // 수정
              />
              <input
                className="w-full p-3 rounded-r border border-solid border-neutral-300 shadow-md"
                name="detailAddr"
                type="text"
                placeholder="상세주소"
                value={user.detailAddr}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative mb-1 flex w-full flex-wrap justify-end">
              <button
                type="button"
                className={`rounded p-1 w-32 text-white ${isModified ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'}`}
                onClick={isModified ? handleClickModify : null}
                disabled={!isModified} // 수정된 정보가 없으면 버튼 비활성화
              >
                수정완료
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyInfoModifyComponent;