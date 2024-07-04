import BasicLayout from '../../layouts/BasicLayout';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';

const IndexPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getTextClass = (path) => {
    return location.pathname.startsWith(path) ? 'header-active' : 'text-gray-500';
  };

  //useCallback 훅을 사용할 때는 두 번째 인자로 의존성 배열을 전달해야함
  const handleClickTip = useCallback(() => {
    navigate({ pathname: 'tip/list' });
  }, [navigate]);
  const handleClickQna = useCallback(() => {
    navigate({ pathname: 'qna/list' });
  }, [navigate]);
  const handleClickReview = useCallback(() => {
    navigate({ pathname: 'review/list' });
  }, [navigate]);
  const handleClickHelp = useCallback(() => {
    navigate({ pathname: 'help/list' });
  }, [navigate]);

  return (
    <div className=' header-space'>
      <BasicLayout>
        <div className="text-xl flex-grow bg-slate-100 py-8">
          <div className="min-h-screen flex flex-row bg-white w-2/3 mx-auto">
            <div className="flex flex-col w-80 bg-white shadow-lg overflow-hidden">
              <ul className="flex flex-col py-4 mt-8">
                <li>
                  <div
                    className="flex flex-row items-center h-24 group transform hover:translate-x-2 hover:cursor-pointer transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
                    onClick={handleClickTip}
                  >
                    <span className={`text-lg font-semibold ml-24 group-hover:underline-offset-1 ${getTextClass('/community/tip')}`}>자취 TIP 공유</span>
                  </div>
                </li>
                <li>
                  <div
                    className="flex flex-row items-center h-24 transform hover:translate-x-2 hover:cursor-pointer transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
                    onClick={handleClickQna}
                  >
                    <span className={`text-lg font-semibold ml-24 ${getTextClass('/community/qna')}`}>질문게시판</span>
                  </div>
                </li>
                <li>
                  <div
                    className="flex flex-row items-center h-24 transform hover:translate-x-2 hover:cursor-pointer transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
                    onClick={handleClickReview}
                  >
                    <span className={`text-lg font-semibold ml-24 ${getTextClass('/community/review')}`}>리뷰게시판</span>
                  </div>
                </li>
                <li>
                  <div
                    className="flex flex-row items-center h-24 transform hover:translate-x-2 hover:cursor-pointer transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
                    onClick={handleClickHelp}
                  >
                    <span className={`text-lg font-semibold ml-24 ${getTextClass('/community/help')}`}>도움요청</span>
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
