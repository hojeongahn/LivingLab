import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ListComponent from '../../components/team/ListComponent';
import LocationComponent from '../../components/common/location/LocationComponent';
//import MoveMarkerComponent from '../../components/common/location/MoveLocationComponent';
import SearchComponent from '../../components/common/SearchComponent';
import SelectComponent from '../../components/common/SelectComponent';
import useCustomMove from './../../hooks/useCustomMove';
import ResultModal from '../../components/common/ResultModal';

const ListPage = () => {
  const [sort, setSort] = useState('');
  const [search, setSearch] = useState('');
  const { moveToAdd } = useCustomMove();
  const [addResultModal, setAddResultModal] = useState(null);
  const navigate = useNavigate();
  const loginInfo = useSelector((state) => state.loginSlice); // 전역상태에서 loginSlice는 로그인 사용자의 상태정보

  // ? 사용: loginInfo가 null/undefined일때도 오류없이 처리
  const email = loginInfo?.email;

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

  const handleSearch = (query) => {
    setSearch(query);
  };

  const handleSort = (query) => {
    setSort(query);
  };

  return (
    <>
      <div className="m-auto w-1/2 mb-2 pl-2 text-3xl font-Jua border-l-4 border-mainColor">동네모임</div>
      <div className="m-auto w-1/2 items-center">
        <LocationComponent />
        {/* <MoveMarkerComponent /> */}
      </div>
      <div className="m-auto bg-slate-200 w-1/2 rounded-md px-10 py-4">
        <SearchComponent onSearch={handleSearch} />

        <div className="flex">
          <SelectComponent onSort={handleSort} email={email} />
          <button
            type="button"
            className="w-32 mb-2 float-right inline-block rounded bg-teal-400 px-6 pb-2 pt-2.5 text-base font-medium leading-normal text-white shadow-md transition duration-150 ease-in-out hover:bg-teal-500 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-teal-600 motion-reduce:transition-none"
            onClick={handleClickWrite}
          >
            글쓰기
          </button>
        </div>

        <ListComponent search={search} sort={sort} />
      </div>
      {addResultModal && <ResultModal title={'알림'} content={addResultModal} callbackFn={handleModalClose} />}
    </>
  );
};

export default ListPage;
