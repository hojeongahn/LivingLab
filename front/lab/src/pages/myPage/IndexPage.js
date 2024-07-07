import { useSelector } from 'react-redux';
import BasicLayout from '../../layouts/BasicLayout';
import { API_SERVER_HOST, getUser } from '../../api/userApi';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import chatIcon1 from '../../resources/images/chat_black.png';
import chatIcon2 from '../../resources/images/chat_maincolor.png';
import penIcon1 from '../../resources/images/pen_black.png';
import penIcon2 from '../../resources/images/pen_maincolor.png';
import userIcon1 from '../../resources/images/user_black.png';
import userIcon2 from '../../resources/images/user_maincolor.png';

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

const IndexPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(initState);
  const loginInfo = useSelector((state) => state.loginSlice); // 전역상태에서 loginSlice는 로그인 사용자의 상태정보

  const ino = loginInfo.id;
  const email = loginInfo.email;

  const getTextClass = (path) => {
    return location.pathname.startsWith(path) ? 'header-active' : 'text-gray-500';
  };

  const getImageClass1 = (path) => {
    return location.pathname.startsWith(path) ? penIcon2 : penIcon1;
  };

  const getImageClass2 = (path) => {
    return location.pathname.startsWith(path) ? chatIcon2 : chatIcon1;
  };

  const getImageClass3 = (path) => {
    return location.pathname.startsWith(path) ? userIcon2 : userIcon1;
  };

  //useCallback 훅을 사용할 때는 두 번째 인자로 의존성 배열을 전달해야함
  const handleClickActivity = useCallback(() => {
    navigate({ pathname: 'activity' });
  }, [navigate]);
  const handleClickChat = useCallback(() => {
    navigate({ pathname: 'chat' });
  }, [navigate]);
  const handleClickInfo = useCallback(() => {
    navigate({ pathname: 'info' });
  }, [navigate]);


  useEffect(() => {
    if(!email){
      alert('비정상적인 접근입니다');
      navigate('/user/login');
      return;
    }
    getUser(ino).then((data) => {
      setUser(data);
    });
  }, [ino,email,navigate]);

  return (
    <div className=' header-space'>
      <BasicLayout>
        <div className="text-xl flex-grow bg-opacity-20 bg-mainColor">
          <div className="min-h-screen flex flex-row w-4/5 mx-auto my-10">
            <div className="flex flex-col w-1/5 bg-white overflow-hidden h-fit rounded mr-5 shadow-md">
              <ul className="flex flex-col py-4 my-8">
                <img src={`${host}/api/user/display/${user.profileImage}`} alt="프로필이미지" className="rounded-full w-40 h-40 mx-auto shadow-md object-cover" />

                <li>
                  <div className="flex items-center pt-3 pb-10 text-gray-900 rounded-lg dark:text-white">
                    <span className="flex-1 whitespace-nowrap text-center font-bold">{user.nickname}님</span>
                  </div>
                </li>
                <li>
                  <div
                    className="relative flex flex-row items-center h-24 overflow-hidden group hover:cursor-pointer"
                    onClick={handleClickActivity}
                  >
                    <div className="absolute inset-0 bg-gray-100 scale-x-0 origin-left transition-transform duration-300 ease-in-out group-hover:scale-x-100"></div>
                    <span className={`relative z-10 text-xl font-semibold ml-24 ${getTextClass('/myPage/activity')}`}>
                      <img src={`${getImageClass1('/myPage/activity')}`} className="w-4 inline-flex mr-2 opacity-60" alt="..."/>
                      나의 활동
                    </span>
                  </div>
                </li>
                <li>
                  <div
                    className="relative flex flex-row items-center h-24 overflow-hidden group hover:cursor-pointer"
                    onClick={handleClickChat}
                  >
                    <div className="absolute inset-0 bg-gray-100 scale-x-0 origin-left transition-transform duration-300 ease-in-out group-hover:scale-x-100"></div>
                    <span className={`relative z-10 text-xl font-semibold ml-24 ${getTextClass('/myPage/chat')}`}>
                      <img src={`${getImageClass2('/myPage/chat')}`} className="w-4 inline-flex mr-2 opacity-60" alt="..."/>
                      채팅
                    </span>
                  </div>
                </li>
                <li>
                  <div
                    className="relative flex flex-row items-center h-24 overflow-hidden group hover:cursor-pointer"
                    onClick={handleClickInfo}
                  >
                    <div className="absolute inset-0 bg-gray-100 scale-x-0 origin-left transition-transform duration-300 ease-in-out group-hover:scale-x-100"></div>
                    <span className={`relative z-10 text-xl font-semibold ml-24 ${getTextClass('/myPage/info')}`}>
                      <img src={`${getImageClass3('/myPage/info')}`} className="w-4 inline-flex mr-2 opacity-60" alt="..."/>
                      회원정보
                    </span>
                  </div>
                </li>

              </ul>
            </div>
            <Outlet />
          </div>
        </div>
      </BasicLayout>
    </div>
  );
};

export default IndexPage;