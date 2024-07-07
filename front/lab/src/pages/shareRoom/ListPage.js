import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ListComponent from '../../components/shareRoom/ListComponent';
import SelectComponentForRoom from '../../components/shareRoom/SelectComponentForRoom';
import SearchComponentForRoom from '../../components/shareRoom/SearchComponentForRoom';
import useCustomMove from './../../hooks/useRoomCustomMove';
import ResultModal from '../../components/common/ResultModal';

const ListPage = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const { moveToAdd } = useCustomMove();
  const [addResultModal, setAddResultModal] = useState(null);
  const loginInfo = useSelector((state) => state.loginSlice); // 전역상태에서 loginSlice는 로그인 사용자의 상태정보
  const email = loginInfo?.email;
  const navigate = useNavigate();


  const handleSearch = (query) => {
    setSearch(query);
  };

  const handleSort = (query) => {
    setSort(query);
  };

  const handleClickWrite = (e) => {
    if (!email) {
      setAddResultModal('로그인 후 이용할 수 있습니다');
    } else {
      moveToAdd();
    }
  };

  const handleModalClose = () => {
    setAddResultModal(null);
    navigate('/user/login'); // 로그인 페이지로 이동
  };



  return (
    <>
      <div className="m-auto w-2/5 mb-2 pl-2 text-3xl font-Jua border-l-4 border-mainColor">자취방쉐어</div>
       {/* <div className="m-auto w-2/5 items-center">
        <LocationComponent />
      </div> */}
      <div className='h-1/2 items-center'>
        <SearchComponentForRoom onSearch={handleSearch}/>
      </div>
      <div className="max-w-[1200px] min-w-[1150px] flex mx-auto">
          <SelectComponentForRoom onSort={handleSort} />
          <div>
            <button
              type="button"
              className="w-32 mb-2 float-right inline-block rounded bg-teal-400 px-6 pb-2 pt-2.5 text-base font-medium leading-normal text-white shadow-md transition duration-150 ease-in-out hover:bg-teal-500 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-teal-600 motion-reduce:transition-none"
              onClick={handleClickWrite}
            >
              글쓰기
            </button>
          </div>
        </div>
      <div>
        <ListComponent search={search} sort={sort}/>
      </div>
      {addResultModal && <ResultModal title={'알림'} content={addResultModal} callbackFn={handleModalClose} />}
    </>
  );
};

export default ListPage;
