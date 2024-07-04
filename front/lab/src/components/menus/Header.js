import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRightToBracket, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import useCustomLogin from '../../hooks/useCustomLogin';
import Logo from '../../resources/images/logo1_vector.png';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const loginState = useSelector((state) => state.loginSlice);
  const { doLogout, moveToPath } = useCustomLogin();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClickLogout = () => {
    doLogout();
    alert('로그아웃되었습니다.');
    moveToPath('/');
  };

  const getLinkClass = (path) => {
    if (path === '/') {
      return location.pathname === path ? 'header-active' : 'sign-btn-group  color-wood';
    }
    return location.pathname.startsWith(path) && location.pathname !== '/' ? 'header-active' : 'sign-btn-group  color-wood';
  };

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 flex-wrap flex w-full py-2.5 transition-colors duration-300 ${
        isScrolled ? 'bg-white bg-opacity-95 backdrop-filter backdrop-blur-lg shadow' : 'bg-transparent'
      }`}
    >
      <div className="flex w-full flex-wrap items-center justify-between px-3">
        <Link to={'/'}>
          <img
            src={Logo}
            alt="LOGO"
            className="w-60 m-2 transition-opacity duration-300"
          />
        </Link>
        <ul className="flex flex-row p-3 list-none header-fontsize items-center">
          <li className="menu-home">
            <Link to={'/'} className={getLinkClass('/')}>
              홈
            </Link>
          </li>
          <li className="menu-width">
            <Link to={'/buy'} className={getLinkClass('/buy')}>
              공동구매
            </Link>
          </li>
          <li className="menu-width">
            <Link to={'/team'} className={getLinkClass('/team')}>
              동네모임
            </Link>
          </li>
          <li className="menu-width">
            <Link to={'/market'} className={getLinkClass('/market')}>
              동네장터
            </Link>
          </li>
          <li className="menu-width">
            <Link to={'/shareRoom'} className={getLinkClass('/shareRoom')}>
              자취방쉐어
            </Link>
          </li>
          <li className="menu-width">
            <Link to={'/community'} className={getLinkClass('/community')}>
              커뮤니티
            </Link>
          </li>
        </ul>
        <div className="relative flex items-center">
          {!loginState.email ? (
            <div className='relative flex items-center'>
              <button
                type="button"
                className="sign-btn"
              >
                <Link to={'/user/join'}>
                  <div className="sign-btn-group menu-width">
                    <svg
                      className="flex-shrink-0 w-5 h-5 mr-2 transition duration-75"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z" />
                      <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z" />
                      <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z" />
                    </svg>
                    회원가입
                  </div>
                </Link>
              </button>
              <button
                type="button"
                className="sign-btn "
              >
                <Link to={'/user/login'}>
                  <div className="sign-btn-group menu-login">
                    <FontAwesomeIcon
                      icon={faRightToBracket}
                      className="flex-shrink-0 w-5 h-5 transition duration-75"
                    />
                    <span className="ms-2">로그인</span>
                  </div>
                </Link>
              </button>
            </div>
          ) : (
            <div className="relative flex items-center">
              <button
                type="button"
                className="sign-btn"
              >
                <Link to={'/myPage/activity'}>
                  <div className="sign-btn-group  menu-mypage ">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="flex-shrink-0 w-5 h-5 mr-1 transition duration-75"
                    />
                    마이페이지
                  </div>
                </Link>
              </button>
              <button
                type="button"
                className="sign-btn"
                onClick={handleClickLogout}
              >
                <div className="sign-btn-group  menu-width">
                  <FontAwesomeIcon
                    icon={faRightFromBracket}
                    className="flex-shrink-0 w-5 h-5 transition duration-75"
                  />
                  <span className="ms-2">
                    로그아웃
                  </span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
