import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useCustomMyPage from '../../../hooks/useCustomMyPage';
import { API_SERVER_HOST, myListAll } from '../../../api/buyApi';
import PageComponent from '../../../components/common/PageComponent';

const initState = {
  dtoList: [], // 한 페이지에 불러오는 게시물 갯수
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

const host = API_SERVER_HOST;

const MyReplyListPage = () => {
  const { page, size, moveToBuyList, moveToRead } = useCustomMyPage();
  const [serverData, setServerData] = useState(initState);
  const loginInfo = useSelector((state) => state.loginSlice);
  const id = loginInfo.id;

  useEffect(() => {
    myListAll({ page, size }, id).then(data => {
      setServerData(data);
    })
  }, [page, size, id]);

  const formatDeadline = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);

    const padZero = (num) => num.toString().padStart(2, '0');
    const isToday = (date) => {
      return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
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

  return (
    <div className="text-xl flex-col h-fit flex w-4/5">
      <div className="bg-white w-full rounded px-10 py-4 h-full shadow-md">
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <div className="text-2xl pl-2 my-2 border-l-4 font-Jua border-teal-300">나의 활동</div>
                <div className="flex h-full justify-center">
                  <div className="w-full m-4">
                    <div className="p-6 h-full overflow-hidden bg-white rounded-lg border shadow">
                      <div className="flex justify-between items-center ml-2 mt-0.5">
                        <h3 className="text-xl font-bold leading-none text-gray-900">나의 댓글</h3>
                      </div>
                      <hr className="my-4" />
                      <div id="items" className="flex flex-wrap">
                        {serverData.dtoList.length > 0 ? (
                          serverData.dtoList.map((buy) => (
                            <div className="flex border p-2 m-1 w-[49%] h-48 box-border cursor-pointer hover:bg-slate-100" onClick={() => moveToRead(`buy`, buy.buyNo)}>
                              <div className="h-full w-48">
                                <img className="object-cover h-full w-full shadow" src={`${host}/api/buy/display/${buy.uploadFileNames[0]}`} alt='...' />
                              </div>
                              <div className="p-5 w-full">
                                <div className="flex justify-between items-start">
                                  <div className="w-full">
                                    <span className="text-base font-semibold bg-slate-200 text-center pb-0.5 px-2 mr-2 rounded">
                                      {buy.buyCategory === '1' && '배달음식'}
                                      {buy.buyCategory === '2' && '생필품'}
                                      {buy.buyCategory === '3' && '식료품'}
                                      {buy.buyCategory === '4' && '가구/가전'}
                                      {buy.buyCategory === '5' && '기타'}
                                    </span>
                                    <span className="bg-amber-400 text-white pb-0.5 px-2 text-center text-sm rounded-full">{buy.current} / {buy.max}</span>
                                    <div className="block mt-3 text-lg text-black">{buy.title}</div>
                                    <p className="mt-2 text-slate-500 text-sm w-72 whitespace-nowrap overflow-hidden text-ellipsis">{buy.location}</p>
                                    <div className="text-right text-sm mt-2">{formatDeadline(buy.deadline)}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                          )
                        )
                          :
                          (
                            <div>작성한 게시물이 없습니다</div>
                          )
                        }
                      </div>
                      <PageComponent serverData={serverData} movePage={moveToBuyList} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyReplyListPage;