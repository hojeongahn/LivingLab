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
  file: null
};

const host = API_SERVER_HOST;

const MyInfoModifyComponent = () => {
  const [user, setUser] = useState(initState);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const loginInfo = useSelector((state) => state.loginSlice); // 전역상태에서 loginSlice는 로그인 사용자의 상태정보

  //주소 찾기 팝업 추가
  const [address, setAddress] = useState('');
  const ino = loginInfo.id;

  useEffect(() => {
    getUser(ino).then((data) => {
      setUser(data);
      setAddress(data.addr);
      
    });
  }, [ino]);

  // 상태변경 (입력값에 따라 상태값 변경)
  const handleChange = (e) => {
    user[e.target.name] = e.target.value;
    setUser({ ...user });
  };

  // addr(팝업 검색주소)만 따로 상태변경
  const handleAddrChange = (newAddr) => {
    setAddress(newAddr);
    setUser({
      ...user,
      addr: newAddr,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      const imageUrl = URL.createObjectURL(file); // 선택한 파일의 URL 생성
      setPreviewImageUrl(imageUrl); // 미리보기 이미지 URL 설정
    }
  };

  const handleFileClick = () => {
    inputRef.current.click();
  };

  // 수정완료 버튼
  const handleClickModify = async() => {
    const formData = new FormData();
    formData.append('file', profileImageFile || user.file); // 이미지 파일을 FormData에 추가
    formData.append('id', user.id);
    formData.append('email', user.email);
    formData.append('name', user.name);
    formData.append('phone', user.phone);
    formData.append('nickname', user.nickname);
    formData.append('pwd', user.pwd);
    formData.append('pwdCheck', user.pwdCheck);
    formData.append('addr', user.addr);
    formData.append('detailAddr', user.detailAddr);

    try {
      await modifyUser(user.id, formData); // 이미지 파일을 포함한 FormData를 백엔드로 전송
      alert('회원정보 수정 완료되었습니다');
      window.location.reload();
    } catch (error) {
      console.error('사용자 정보 수정 에러:', error);
    }
  };

  // 사진 업로드
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
        <div className="border-2 border-sky-200 p-4  bg-gray-50">
          <div className="flex justify-center">
            <div className="w-1/3 p-3 text-left font-bold">프로필 사진</div>
            <div className="relative mb-4 flex w-full items-stretch">
              <div className="mt-2">
                <img src={previewImageUrl ? previewImageUrl : `${host}/api/user/display/${user.profileImage}`} alt="프로필이미지" className="rounded-full size-40 mx-auto" />
                <div class="flex">
                  <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} ref={inputRef} />
                  <button
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-200 file:text-slate-700 hover:file:bg-violet-100"
                    onClick={handleFileClick}
                  >
                    이미지 변경
                  </button>
                  <button
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-200 file:text-slate-700 hover:file:bg-violet-100"
                    // onClick={handleFileDelete}
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
              <input className="w-full p-3 rounded-r border border-solid border-neutral-300 shadow-md" name="email" type={'text'} value={user.email} readOnly></input>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-1/3 p-3 text-left font-bold">이름</div>
            <div className="relative mb-4 flex w-full items-stretch">
              <input
                className="w-full p-3 rounded-r border border-solid border-neutral-300 shadow-md"
                name="name"
                type={'text'}
                value={user.name}
                placeholder="이름"
                onChange={handleChange}
              ></input>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-1/3 p-3 text-left font-bold">휴대폰 번호</div>
            <div className="relative mb-4 flex w-full items-stretch">
              <input
                className="w-full p-3 rounded-r border border-solid border-neutral-300 shadow-md"
                name="phone"
                type={'text'}
                value={user.phone}
                placeholder="전화번호"
                onChange={handleChange}
              ></input>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-1/3 p-3 text-left font-bold">닉네임</div>
            <div className="relative mb-4 flex w-full items-stretch">
              <input
                className="w-full p-3 rounded-r border border-solid border-neutral-300 shadow-md"
                name="nickname"
                type={'text'}
                value={user.nickname}
                placeholder="닉네임"
                onChange={handleChange}
              ></input>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-1/3 p-3 text-left font-bold">비밀번호</div>
            <div className="relative mb-4 flex w-full items-stretch">
              <input
                className="w-full p-3 rounded-r border border-solid border-neutral-300 shadow-md"
                name="pwd"
                type={'password'}
                value={user.pwd}
                placeholder="비밀번호를 입력하세요"
                onChange={handleChange}
              ></input>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-1/3 p-3 text-left font-bold">비밀번호 확인</div>
            <div className="relative mb-4 flex w-full items-stretch">
              <input
                className="w-full p-3 rounded-r border border-solid border-neutral-300 shadow-md"
                name="pwd"
                type={'password'}
                value={user.pwd}
                placeholder="비밀번호 확인"
                onChange={handleChange}
              ></input>
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
                type={'text'}
                placeholder="주소(우편번호 및 도로명 검색)"
                value={address}
                readOnly // 추가
              />
              {/* 오류수정 : // onChange={handleChange} */}

              <input
                className="w-full p-3 rounded-r border border-solid border-neutral-300 shadow-md"
                name="detailAddr"
                type={'text'}
                placeholder="상세주소"
                value={user.detailAddr}
                onChange={handleChange}
              ></input>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative mb-1 flex w-full flex-wrap justify-end">
              <button type="button" className="rounded p-1 w-32 text-white bg-blue-500 hover:bg-blue-600" onClick={handleClickModify}>
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
