import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login  } from '../../slices/loginSlice';
import imgLogo2 from '../../resources/images/logo2.png';
import HorizonLine from '../../util/HorizontalLine';
import KakaoLoginComponent from './KakaoLoginComponent';
import useCustomLogin from '../../hooks/useCustomLogin';
import { loginPost } from '../../api/userApi';
import FindIdModal from './FindIdModal';
import FindPwdModal from './FindPwdModal';
import { mailSend } from '../../api/emailApi'
import { findId } from '../../api/userApi'
import { findPwd } from '../../api/userApi'

const initState = {
  email: '',
  pwd: '',
};

function LoginComponent(props) {
  const [loginParam, setLoginParam] = useState({ ...initState });
  const { moveToLogin, moveToPath, moveToJoin } = useCustomLogin();
  const [findIdModal, setFindIdModal] = useState(false);
  const [findPwdModal, setFindPwdModal] = useState(false);
  const dispatch = useDispatch();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [authNum, setAuthNum] = useState('');
  const [inputNum, setInputNum] = useState('');
  const [pwd, setPwd] = useState('');
  

  const handleChange = (e) => {
    loginParam[e.target.name] = e.target.value;

    setLoginParam({ ...loginParam });
  };

  const handleClickLogin = (e) => {
    loginPost(loginParam).then((userInfo) => {
      dispatch(login(userInfo));

      // 로그인 후 메인으로
      if (userInfo.email != null) {
        //성공
        alert('로그인 되었습니다.');
        moveToPath('/');
      } else {
        alert('이메일 혹은 비밀번호를 다시 한번 확인해주세요');
        moveToLogin(); // 실패
      }
    });
  };

  const handleModalClose = () => {
    setPwd(null);
    setFindIdModal(false);
    setFindPwdModal(false);
  };

  const handleClickFindId = () => {
    setFindIdModal(true);
    setStep(0); // 초기 단계로 설정
  };

  const handleClickFindPwd = () => {
    setFindPwdModal(true);
    setStep(0); // 초기 단계로 설정
  };

  const handleFindId = async () => {  //Id 찾기
    const response = await findId({ name, phone });
    setMessage(response.message);
    setStep((prevStep) => prevStep + 1);
  };

  const handleFindPwd = async () => { //비밀번호 찾기위한 이메일 인증받기
    const response = await mailSend({ email });
    setAuthNum(response.data)
    setStep((prevStep) => prevStep + 1);
  };

  const handleCheckNum = async () => {  //이메일 인증 번호와 비교하기
    if(authNum === inputNum){ //인증번호 일치시
      const response = await findPwd(email);
      setPwd(response.data)
      setStep((prevStep) => prevStep + 1);
    } else {  //인증번호 불일치 시
      setStep(3);
    }
  };
  

  const renderContentId = () => {
    switch (step) {
      case 0:
        return (
          <div>
            <div className="w-full text-center text-sm pt-4 pb-4">
              <span>회원정보에 등록된 이름과 전화번호를 입력해주세요</span>
            </div>
            <div class="w-full my-2 transform border-b-2 bg-transparent text-base duration-300 focus-within:border-teal-700">
              <input type="text" placeholder="이름" class="w-full p-1 border-none bg-transparent outline-none focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}/>
            </div>
            <div class="w-full my-2 transform border-b-2 bg-transparent text-base duration-300 focus-within:border-teal-700">
              <input type="text" placeholder="전화번호" class="w-full p-1 border-none bg-transparent outline-none focus:outline-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}/>
            </div>
            <div className="w-full flex justify-center mt-5 mb-4">
              <button onClick={handleFindId} className="rounded bg-mainColor mt-4 mb-4 mr-2 px-4 py-1 text-base text-white hover:bg-teal-500 transition-colors">
                아이디 찾기
              </button>
              <button
                className="rounded bg-slate-400 mt-4 mb-4 px-4 py-1 text-base text-white hover:bg-slate-500 transition-colors"
                onClick={handleModalClose}
              >
              닫기
              </button>
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <div className="w-full text-center text-sm pt-4 pb-4">
              <span>{message}</span>
            </div>
            <div className="w-full flex justify-center mt-5 mb-4">
              <button
                className="rounded bg-slate-400 mt-4 mb-4 px-4 py-1 text-base text-white hover:bg-slate-500 transition-colors"
                onClick={handleModalClose}
              >
              닫기
              </button>
            </div>
          </div>
        );
      default:
        return <p>일시적인 오류입니다. 다시 실행해주세요</p>
    }
  };

  const renderContentPwd = () => {
    switch (step) {
      case 0:
        return (
          <div>
            <div className="w-full text-center text-sm pt-4 pb-4">
              <span>회원정보에 등록된 이메일 주소를 입력해주세요</span>
            </div>
            <div class="w-full my-2 transform border-b-2 bg-transparent text-base duration-300 focus-within:border-teal-700">
              <input type="email" placeholder="이메일 주소" class="w-full p-1 border-none bg-transparent outline-none focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className="w-full flex justify-center mt-5 mb-4">
              <button onClick={handleFindPwd} className="rounded bg-mainColor mt-4 mb-4 mr-2 px-4 py-1 text-base text-white hover:bg-teal-500 transition-colors">
                인증번호 발송
              </button>
              <button
                className="rounded bg-slate-400 mt-4 mb-4 px-4 py-1 text-base text-white hover:bg-slate-500 transition-colors"
                onClick={handleModalClose}
              >
              닫기
              </button>
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <div className="w-full text-center text-sm pt-4 pb-4">
              <span>인증번호를 입력하세요</span>
            </div>
            <div class="w-full my-2 transform border-b-2 bg-transparent text-base duration-300 focus-within:border-teal-700">
              <input type="text" placeholder="인증번호" class="w-full p-1 border-none bg-transparent outline-none focus:outline-none"
              value={inputNum}
              onChange={(e) => setInputNum(e.target.value)}/>
            </div>
            <div className="w-full flex justify-center mt-5 mb-4">
              <button onClick={handleCheckNum} className="rounded bg-mainColor mt-4 mb-4 mr-2 px-4 py-1 text-base text-white hover:bg-teal-500 transition-colors">
                인증하기
              </button>
              <button
                className="rounded bg-slate-400 mt-4 mb-4 px-4 py-1 text-base text-white hover:bg-slate-500 transition-colors"
                onClick={handleModalClose}
              >
              닫기
              </button>
            </div>
          </div>
        );
      case 2:
        return(
          <div>
          <div className="w-full text-center text-base pt-4 pb-4">
            <span>등록된 비밀번호는 {pwd}입니다</span>
          </div>
          <div className="w-full flex justify-center mt-5 mb-4">
            <button
              className="rounded bg-slate-400 mt-4 mb-4 px-4 py-1 text-base text-white hover:bg-slate-500 transition-colors"
              onClick={handleModalClose}
            >
            닫기
            </button>
          </div>
        </div>
        );
        case 3:
        return(
          <div>
          <div className="w-full text-center text-base pt-4 pb-4">
            <span>인증번호가 일치하지 않습니다. 다시 시도해 주세요</span>
          </div>
          <div className="w-full flex justify-center mt-5 mb-4">
            <button
              className="rounded bg-slate-400 mt-4 mb-4 px-4 py-1 text-base text-white hover:bg-slate-500 transition-colors"
              onClick={handleModalClose}
            >
            닫기
            </button>
          </div>
        </div>
        );
      default:
        return <p>일시적인 오류입니다. 다시 실행해주세요</p>
    }
  };

  return (
    <div className="max-h-400">
      <div className="flex justify-center">
        <div className="text-4xl m-1 p-1 font-extrabold">
          <img src={imgLogo2} alt="imgLogo2" className="object-contain h-48 w-96 ..." />
        </div>
      </div>
      <div className="border border-slate-300 p-4 shadow-md">
        <div className="flex justify-center">
          <div className="relative flex w-full flex-wrap items-stretch">
            <div className="w-full py-3 text-left font-bold">이메일</div>
            <input
              className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
              name="email"
              type={'text'}
              placeholder="이메일을 입력해주세요"
              value={loginParam.email}
              onChange={handleChange}
            ></input>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="relative mb-10 flex w-full flex-wrap items-stretch">
            <div className="w-full py-3 text-left font-bold">비밀번호</div>
            <input
              className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
              name="pwd"
              type={'password'}
              placeholder="비밀번호를 입력해주세요"
              value={loginParam.pwd}
              onChange={handleChange}
            ></input>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative mb-4 flex w-full justify-center">
            <div className="w-full flex justify-center font-bold">
              <button className="rounded p-2 w-full bg-slate-700 text-xl text-white hover:bg-black transition-colors"
              onClick={handleClickLogin}>
                로그인
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative mb-2 flex w-full justify-center">
            <div className="w-full flex justify-center font-bold">
              <button className="rounded p-2 w-full bg-mainColor hover:bg-teal-600 text-xl text-white transition-colors"
              onClick={() => moveToJoin()}>
                회원가입
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative mb-10 flex w-full justify-center">
            <div className="text-sm flex justify-center font-bold text-gray-500 hover:text-black cursor-pointer" onClick={handleClickFindId}>
              아이디 찾기
            </div>
            <span className="text-sm font-bold text-gray-500 mx-3">|</span>
            <div className="text-sm flex justify-center font-bold text-gray-500 hover:text-black cursor-pointer" onClick={handleClickFindPwd}>
              비밀번호 찾기
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative flex w-full justify-center">
            <div className="w-full flex justify-center font-bold text-gray-500">
              <HorizonLine text="카카오 간편 로그인" />
            </div>
          </div>
        </div>

        {/* <div className="flex justify-center">
          <div className="relative mb-4 flex w-full justify-center">
            <div className="w-full flex justify-center font-bold">
              <button className="rounded p-2 w-full bg-gray-300 text-xl text-white">Google</button>
            </div>
          </div>
        </div> */}

        <KakaoLoginComponent />

        {/* <div className="flex justify-center">
          <div className="relative mb-4 flex w-full justify-center">
            <div className="w-full flex justify-center font-bold">
              <button className="rounded p-2 w-full bg-green-400 text-xl text-white">Naver</button>
            </div>
          </div>
        </div> */}


      <FindIdModal title={'아이디 찾기'} isVisible={findIdModal} callbackFn={handleModalClose}>
        {renderContentId()}
      </FindIdModal>
      <FindPwdModal title={'비밀번호 찾기'} isVisible={findPwdModal} onClose={handleModalClose}>
        {renderContentPwd()}
      </FindPwdModal>
      </div>
    </div>
  );
}
export default LoginComponent;
