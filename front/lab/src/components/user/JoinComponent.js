import React from 'react';
import { useState, useRef, useEffect } from 'react';
import imgLogo2 from '../../resources/images/logo2.png';
import PostComponent from '../common/PostComponent';
import { joinUser, CheckEmail, CheckNickname } from '../../api/userApi';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가
import InfoModal from '../common/InfoModal';

const initState = {
  email: "",
  validEmail: false, // 아이디 정규식 충족 여부
  validEmailCheck: false, //아이디 중복확인 여부
  pwd: '',
  validPwd: false, // 패스워드 정규식 충족 여부
  confirmPwd: '',
  validConfirmPwd: false, // 패스워드 데이터 일치하는지 여부
  phone: '',
  validPhone:false, // 전화번호 정규식 충족 여부
  name: '',
  validName: false, // 이름 정규식 충족 여부
  nickname: '',
  validNickname : false, //닉네임 정규식 충족 여부
  validNicknameCheck: false, //닉네임 중복확인 여부
  addr: '',
  detailAddr: '',
  validAddr: false,
  file: null, // 파일 객체 초기값
  validFile: false,
  errorEmail : '',
  errorEmailCheck: '중복확인을 해주세요',
  errorPwd : '',
  errorConfirmPwd : '',
  errorName : '',
  errorNickName: '',
  errorNickNameCheck: '중복확인을 해주세요',
  errorPhone: '',
  errorAddr: '',
  errorFile: '',
};

const JoinComponent = () => {
  const [user, setUser] = useState({ ...initState });
  const [info, setInfo] = useState(null);

  const imgRef = useRef();
  const navigate = useNavigate(); // useNavigate 사용

  const handleChange = (e) => {
    user[e.target.name] = e.target.value;
    setUser({ ...user });
    if(e.target.name === 'email'){
      setUser({
        ...user,
        validEmailCheck: false,
        errorEmailCheck: '중복확인을 해주세요',
      });
    }
    if(e.target.name === 'nickname'){
      setUser({
        ...user,
        validNicknameCheck: false,
        errorNickNameCheck: '중복확인을 해주세요',
      });
    }
  };

  const closeInfoModal = () => {
    setInfo(null);
  };

  /* ======정규식 모음======*/
  // 비밀번호 : 최소 8자 이상, 최소한 하나의 영문자, 하나의 숫자, 하나의 특수문자를 포함, 공백 허용하지 않음
  const pwRegex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/;
  // 닉네임 : 영어 대/소문자, 숫자, 한글 자모음 조합, 2~10자 이내
  const nicknameRegexv = /^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]{2,10}$/;
  // 이름 : 한글 자모음 조합 2~6자 이내
  const nameRegex = /^[ㄱ-ㅎㅏ-ㅣ가-힣]{2,8}$/;
  // 이메일
  const emailRegex = /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/;
  // 전화번호
  const phoneRegex = /^010-\d{4}-\d{4}$/;

  // 가입버튼 활성화 조건
  const isButtonEnabled = user.validEmail && user.validEmailCheck && user.validPwd && user.validConfirmPwd && user.validPhone && user.validName && user.validNickname && user.validNicknameCheck && user.validAddr && user.validFile;

  //중복확인 버튼 활성화 조건
  const isEmail = user.validEmail;
  const isNickName = user.validNickname;

  useEffect(() => {
    setUser({ ...user});
  }, [info]);

  useEffect(() => {
    if(user.email !== ''){
    const result = emailRegex.test(user.email);
      setUser({
        ...user,
        errorEmail : result? '올바른 이메일 형식입니다' : '이메일 형식이 올바르지 않습니다',
        validEmail: result,
      });
    }
  }, [user.email]);

  useEffect(() => {
    if(user.pwd !== ''){
    const result = pwRegex.test(user.pwd);
      setUser({
        ...user,
        errorPwd : result? '안전한 비밀번호입니다' : '영문자+숫자+특수문자 조합으로 8자리 이상 입력해주세요',
        validPwd: result,
      });
    }
  }, [user.pwd]);

  useEffect(() => {
    if(user.confirmPwd !== ''){
    const result = user.pwd === user.confirmPwd;
      setUser({
        ...user,
        errorConfirmPwd : result? '비밀번호가 일치합니다' : '비밀번호가 일치하지 않습니다',
        validConfirmPwd: result,
      });
    }
  }, [user.confirmPwd, user.pwd]);

  useEffect(() => {
    if(user.name !== ''){
    const result = nameRegex.test(user.name);
      setUser({
        ...user,
        errorName : result? '올바른 형식입니다' : '2~6자 이내의 한글로 입력해주세요',
        validName: result,
      });
    }
  }, [user.name]);


  useEffect(() => {
    if(user.phone !== ''){
    const result = phoneRegex.test(user.phone);
      setUser({
        ...user,
        errorPhone : result? '올바른 형식입니다' : '010-XXXX-XXXX 형식으로 입력해주세요',
        validPhone: result,
      });
    }
  }, [user.phone]);

  useEffect(() => {
    if(user.nickname !== ''){
    const result = nicknameRegexv.test(user.nickname);
      setUser({
        ...user,
        errorNickName : result? '올바른 닉네임 형식입니다' : '2~10자 이내인 영문자,숫자,한글 조합만 가능합니다',
        validNickname: result,
      });
    }
  }, [user.nickname]);

  useEffect(() => {
    const result = user.addr && user.detailAddr;
      setUser({
        ...user,
        errorAddr : result? '주소가 입력되었습니다' : '주소를 입력해주세요',
        validAddr: result,
      });
  }, [user.addr, user.detailAddr]);

  useEffect(() => {
    const result = user.file !== null;
      setUser({
        ...user,
        errorFile : result? '프로필 이미지가 등록되었습니다' : '프로필 이미지를 등록해주세요',
        validFile: result,
      });
  }, [user.file]);


  // addr(팝업 검색주소)만 따로 상태변경
  const handleAddrChange = (newAddr) => {
    setUser({
      ...user,
      addr: newAddr,
    });
  };

  const handleFileChange = (e) => {
    setUser({
      ...user,
      file: e.target.files[0], //단일 파일
    });
  };

  const handleClickJoin = async (e) => {
    e.preventDefault();

    try {
      // 이메일 중복 체크
      const emailCheck = await CheckEmail(user.email);
      if (emailCheck) {
        setInfo('이미 회원가입된 이메일입니다.');
        return;
      }

      // 닉네임 중복 체크
      const nicknameCheck = await CheckNickname(user.nickname);
      if (nicknameCheck) {
        setInfo('이미 회원가입된 닉네임입니다.');
        return;
      }

      const formData = new FormData();
      formData.append('file', user.file);
      formData.append('email', user.email);
      formData.append('pwd', user.pwd);
      formData.append('confirmPwd', user.confirmPwd);
      formData.append('phone', user.phone);
      formData.append('name', user.name);
      formData.append('addr', user.addr);
      formData.append('nickname', user.nickname);
      formData.append('detailAddr', user.detailAddr);

      const response = await joinUser(formData);
      if (response.result === true) {
        navigate('/', { state: { showModalJoin: true } });
      } else {
        setInfo(response.message);
      }
    } catch (error) {
      console.error(error);
      setInfo('회원가입 중 오류가 발생했습니다.');
    }
  };

  // 이메일 중복 체크
  const handleCheckEmail = () => {
    if (!user.email) {
      setInfo('이메일을 먼저 입력해주세요.');
      return;
    }
  
    CheckEmail(user.email)
    .then((res)=> {
      if(res === false) {
        setInfo('사용 가능한 이메일입니다.');
        setUser({
          ...user,
          errorEmailCheck : '확인되었습니다',
          validEmailCheck: true,
        });
      }
      else {
        setInfo('이미 회원가입된 이메일입니다.')
      }
    })
    .catch((error) => {
      console.error('Error checking email:', error);
      setInfo('이메일 확인 중 오류가 발생했습니다. 다시 시도해주세요.');
    });
  }

   // 닉네임 중복 체크
  const handleCheckNickname = () => {
    if (!user.nickname) {
      setInfo('닉네임을 먼저 입력해주세요.');
      return;
    }
  
    CheckNickname(user.nickname)
    .then((res)=> {
      if(res === false) {
        setInfo('사용 가능한 닉네임입니다.');
        setUser({
          ...user,
          errorNickNameCheck: '확인되었습니다',
          validNicknameCheck: true,
        });
      }
      else {
        setInfo('이미 회원가입된 닉네임입니다.')
      }
    })
  }

  return (
    <div className="max-h-400">
      <div className="flex justify-center">
        <div className="text-4xl m-1 p-1 font-extrabold text-blue-500">
          <img src={imgLogo2} alt="imgLogo2" className="object-contain h-48 w-96 ..." />
        </div>
      </div>
      <div className="border-2 border-sky-200 p-4">
        <div className="flex justify-center">
          <div className="relative flex w-full flex-wrap items-stretch">
            <div className="w-full p-3 text-left font-bold">이메일</div>
              <div className="flex w-full space-x-2">
                <input
                  className="w-4/5 p-3 rounded-r border border-solid border-neutral-500 shadow-md"
                  name="email"
                  type="text"
                  placeholder="아이디는 이메일 형식으로 입력해주세요."
                  value={user.email}
                  onChange={handleChange}
                />
                <button className={`${isEmail? 'bg-blue-300 hover:bg-blue-400' : 'bg-slate-500 cursor-not-allowed'} rounded p-2 w-1/5 text-base text-white`}
                onClick={handleCheckEmail} disabled={!isEmail}>
                  중복확인
                </button>
              </div>
          </div>
        </div>
        <div className="flex justify-between">
          {user.validEmail ? (<p className="text-sm text-blue-600">{user.errorEmail}</p>):(<p className="text-sm text-red-600">{user.errorEmail}</p>)}
          {user.validEmailCheck ? (<p className="text-sm text-blue-600">{user.errorEmailCheck}</p>):(<p className="text-sm text-red-600">{user.errorEmailCheck}</p>)}
        </div>
        <div className="flex justify-center">
          <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-full p-3 text-left font-bold">비밀번호</div>
            <input
              className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
              name="pwd"
              type={'password'}
              placeholder="비밀번호를 입력하세요."
              value={user.pwd}
              onChange={handleChange}
            ></input>
            {user.validPwd ? (<p className="text-sm text-blue-600">{user.errorPwd}</p>):(<p className="text-sm text-red-600">{user.errorPwd}</p>)}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-full p-3 text-left font-bold">비밀번호 확인</div>
            <input
              className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
              name="confirmPwd"
              type={'password'}
              placeholder="비밀번호 확인"
              value={user.confirmPwd}
              onChange={handleChange}
            ></input>
            {user.validConfirmPwd ? (<p className="text-sm text-blue-600">{user.errorConfirmPwd}</p>):(<p className="text-sm text-red-600">{user.errorConfirmPwd}</p>)}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-full p-3 text-left font-bold">이름</div>
            <input
              className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
              name="name"
              type={'text'}
              placeholder="이름"
              value={user.name}
              onChange={handleChange}
            ></input>
            {user.validName ? (<p className="text-sm text-blue-600">{user.errorName}</p>):(<p className="text-sm text-red-600">{user.errorName}</p>)}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-full p-3 text-left font-bold">휴대폰 번호</div>
            <input
              className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
              name="phone"
              type={'text'}
              placeholder="전화번호"
              value={user.phone}
              onChange={handleChange}
            ></input>
            {user.validPhone ? (<p className="text-sm text-blue-600">{user.errorPhone}</p>):(<p className="text-sm text-red-600">{user.errorPhone}</p>)}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative flex w-full flex-wrap items-stretch">
            <div className="w-full p-3 text-left font-bold">닉네임</div>
              <div className="flex w-full space-x-2">
                <input
                  className="w-4/5 p-3 rounded-r border border-solid border-neutral-500 shadow-md"
                  name="nickname"
                  type="text"
                  placeholder="닉네임"
                  value={user.nickname}
                  onChange={handleChange}
                />
                <button className={`${isNickName? 'bg-blue-300 hover:bg-blue-400' : 'bg-slate-500 cursor-not-allowed'} rounded p-2 w-1/5 text-base text-white`}
                onClick={handleCheckNickname} disabled={!isNickName}>
                  중복확인
                </button>
              </div>
          </div>
        </div>
        <div className="flex justify-between">
          {user.validNickname ? (<p className="text-sm text-blue-600">{user.errorNickName}</p>):(<p className="text-sm text-red-600">{user.errorNickName}</p>)}
          {user.validNicknameCheck ? (<p className="text-sm text-blue-600">{user.errorNickNameCheck}</p>):(<p className="text-sm text-red-600">{user.errorNickNameCheck}</p>)}
        </div>
        <div className="flex justify-center">
          <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-full p-3 text-left font-bold">주소</div>
            <div className="w-44">
              <PostComponent setAddress={handleAddrChange}></PostComponent>
            </div>
            <input
              className="w-full p-3 rounded-r border border-solid border-neutral-300 shadow-md"
              name="addr"
              type={'text'}
              placeholder="주소(우편번호 및 도로명 검색)"
              value={user.addr}
              readOnly
            />

            <input
              className="w-full p-3 rounded-r border border-solid border-neutral-300 shadow-md"
              name="detailAddr"
              type={'text'}
              placeholder="상세주소"
              value={user.detailAddr}
              onChange={handleChange}
            ></input>
            {user.validAddr ? (<p className="text-sm text-blue-600">{user.errorAddr}</p>):(<p className="text-sm text-red-600">{user.errorAddr}</p>)}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-full p-3 text-left font-bold">프로필 이미지</div>
            <input className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md" ref={imgRef} type="file" multiple onChange={handleFileChange} />
            {user.validFile ? (<p className="text-sm text-blue-600">{user.errorFile}</p>):(<p className="text-sm text-red-600">{user.errorFile}</p>)}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative mb-4 flex w-full justify-center">
            <div className="w-full flex justify-center font-bold">
              <button className={`${isButtonEnabled? 'bg-sky-400 hover:bg-sky-500' : 'bg-slate-500 cursor-not-allowed'} rounded p-2 w-1/2 text-xl text-white`}
              onClick={handleClickJoin} disabled={!isButtonEnabled}>
                가입하기
              </button>
            </div>
          </div>
        </div>
      </div>
      {info && <InfoModal title={'알림'} content={`${info}`} callbackFn={closeInfoModal} />}
    </div>
  );
}
export default JoinComponent;
