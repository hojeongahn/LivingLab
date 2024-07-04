import { useEffect, useState } from 'react';
import { API_SERVER_HOST, getList, updateMarketFlag } from '../../api/marketApi';
import useCustomMove from '../../hooks/useCustomMove';
import PageComponent from '../common/PageComponent';
import { getUser } from '../../api/userApi';
import { useSelector } from 'react-redux';
import nolist from "../../resources/images/nolist2.png";
import heart from "../../resources/images/heart_full.png";
import mapIcon from '../../resources/images/map.png';

const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDto: null,
  prev: false,
  next: false,
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0,
};

const initUser = {
  nickname: '',
  profileImage: '',
  latitude: 0,
  longitude: 0,
};

const host = API_SERVER_HOST;

const ListComponent = ({ search, sort }) => {
  const { page, size, moveToList, moveToRead } = useCustomMove();
  const [serverData, setServerData] = useState(initState);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [user, setUser] = useState(initUser);

  const loginInfo = useSelector((state) => state.loginSlice);
  const email = loginInfo?.email;
  const ino = loginInfo.id;

  const checkDeadline = (market) => {
    const currentDate = new Date();
    const deadlineDate = new Date(market.deadline);

    if (market.flag) {      
      return '모집 종료';
    } else {
      // 모집 종료로 결정되면 데이터베이스 업데이트
      if (currentDate > deadlineDate) {
        updateMarketFlag(market.marketNo, true)
          .then(() => {
          })
          .catch((error) => {
            console.error(`Failed to update flag for market No ${market.marketNo}`, error);
          });

        return '모집 종료';
      } else {
        return '모집 중';
      }
    }
  };

  const formatDeadline = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);

    const padZero = (num) => num.toString().padStart(2, '0');
    const isToday = (date) => {
      return date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate();
    };

    const hours = deadlineDate.getHours();
    const minutes = padZero(deadlineDate.getMinutes());
    const amPm = hours < 12 ? '오전' : '오후';
    const displayHours = padZero(hours % 12 || 12);

    if (isToday(deadlineDate)) {
      return `오늘 ${amPm} ${displayHours}:${minutes}까지`;
    } else {
      const year = deadlineDate.getFullYear();
      const month = padZero(deadlineDate.getMonth() + 1);
      const day = padZero(deadlineDate.getDate());
      return `${year}-${month}-${day} ${amPm} ${displayHours}:${minutes}까지`;
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  useEffect(() => {
    if (email) {
      getUser(ino).then((data) => {
        setUser(data);
      });
    }
  }, [ino, email]);

  useEffect(() => {
    getList({ page, size }, search, sort, selectedCategory, user.latitude, user.longitude).then((data) => {
      const updatedData = {
        ...data,
        dtoList: data.dtoList.map((market) => ({
          ...market,
          recruit: checkDeadline(market),
        })),
      };
      setServerData(updatedData);
    });
  }, [page, size, search, sort, selectedCategory, user.latitude, user.longitude]);

  return (
    <div>
      <div className="list-button-container ">
        <button
          className={`list-tagbtn ${selectedCategory === '1' ? 'tag-btn-active' : ''}`}
          onClick={() => handleCategoryClick('1')}
        >
          #구매
        </button>
        <button
          className={`list-tagbtn ${selectedCategory === '2' ? 'tag-btn-active' : ''}`}
          onClick={() => handleCategoryClick('2')}
        >
          #판매
        </button>
        <button
          className={`list-tagbtn ${selectedCategory === '3' ? 'tag-btn-active' : ''}`}
          onClick={() => handleCategoryClick('3')}
        >
          #교환
        </button>
        <button
          className={`list-tagbtn ${selectedCategory === '4' ? 'tag-btn-active' : ''}`}
          onClick={() => handleCategoryClick('4')}
        >
          #나눔
        </button>
      </div>
      {serverData.dtoList.length > 0 ? (
        serverData.dtoList.map(market => (
          <div key={market.marketNo} className="w-full mb-4 cursor-pointer" onClick={() => moveToRead(market.marketNo)}>
            <div className="flex flex-col items-center px-5 bg-white border border-gray-200 rounded-lg shadow sm:flex-row hover:bg-gray-100">
              <div className="w-60 h-48">
                <img className="w-full h-full object-cover rounded-none border-2" src={`${host}/api/market/display/${market.uploadFileNames[0]}`} alt="..." />
              </div>
              <div className="flex flex-col p-4 ml-5 leading-normal w-full">
                <div className="mb-2 inline-flex items-center">
                  <span className="bg-white text-gray-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-xl border border-gray-900">
                    {market.marketCategory === '1' && '구매'}
                    {market.marketCategory === '2' && '판매'}
                    {market.marketCategory === '3' && '교환'}
                    {market.marketCategory === '4' && '나눔'}
                  </span>
                  <div className="text-gray-800 text-sm font-medium ml-auto">
                    <img src={heart} alt="..." className="w-4 inline" />&ensp;{market.marketHit}
                  </div>
                </div>
                <div className="flex justify-end w-full">
                  <div className={`font-bold text-base ${market.recruit === '모집 중' ? 'text-green-700' : 'text-gray-900'}`}>
                      {formatDeadline(market.deadline)}
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className={`font-bold text-base ${market.recruit === '모집 중' ? 'text-red-500' : 'text-gray-900'}`}>
                      {market.recruit}
                  </div>
                </div>
                <div className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{market.title}</div>
                <div className="mb-3 text-base text-gray-700">
                  <img src={mapIcon} alt="..." className="w-4 inline" />&ensp;{market.location}
                </div>
                <div className="flex justify-end mb-2 text-lg tracking-tight text-gray-900">{market.nickname}</div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white p-2 mt-2">
          <img src={nolist} alt="..." className="mx-auto w-72" />
        </div>
      )}
      <PageComponent serverData={serverData} movePage={moveToList} />
    </div>
  );
};

export default ListComponent;