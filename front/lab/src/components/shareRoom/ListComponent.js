import { useEffect, useState } from "react";
import { API_SERVER_HOST, getList } from "../../api/shareRoomApi";
import useRoomCustomMove from "../../hooks/useRoomCustomMove";
import PageComponent from "../common/PageComponent";
import LandingComponent from  "../common/mapSearch/LandingComponent";

const host = API_SERVER_HOST;
const initState = {
  dtoList: [],
  pageNumList: [],
  roomPageRequestDto: null,
  prev: false,
  next: false,
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0,
};

const ListComponent = ({ search, sort }) => {
  const { page, size, moveToList, moveToRead } = useRoomCustomMove();
  const [serverData, setServerData] = useState(initState);

  const checkDeadline = (rentEndDate) => {
    const currentDate = new Date();
    const deadline = new Date(rentEndDate);
    deadline.setDate(deadline.getDate() + 1);  // 종료 날짜에 1일을 더합니다.
    return currentDate > deadline ? '종료' : '진행 중';
  };

  useEffect(() => {
    getList({ page, size }, search, sort).then(data => {
      const updatedData = {
        ...data,
        dtoList: data.dtoList.map((shareRoom) => ({
          ...shareRoom,
          recruit: checkDeadline(shareRoom.rentEndDate),
        })),
      };
      setServerData(updatedData);
    })
  }, [page, size, search, sort]);

  return (
    <>
      <div className=' '></div>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-3 py-10 max-w-7xl min-w-[1280px] items-center mx-auto">
        {serverData.dtoList.map((shareRoom) => (
          <div
            key={shareRoom.roomNo}
            className={`group mx-12 overflow-hidden rounded-sm shadow-lg h-90 w-60 md:w-80 relative ${shareRoom.recruit === '종료' ? 'pointer-events-none' : 'cursor-pointer'}`}
            onClick={shareRoom.recruit === '진행 중' ? () => moveToRead(shareRoom.roomNo) : null}
          >
            <img alt="..." src={`${host}/api/shareRoom/display/${shareRoom.uploadFileNames[0]}`} className="object-cover w-full max-h-40 transition duration-500 group-hover:blur-xl group-hover:brightness-150"/>
            {shareRoom.recruit === '종료' && (
              <div className="absolute top-0 w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-50 text-white">
                <p className="text-xl font-bold">종료되었습니다</p>
              </div>
            )}
            <div className="absolute top-0 w-full flex flex-col items-center justify-center px-4 group-hover:z-10">
              <p className="text-gray-900 text-lg leading-5 font-bold mb-2 hidden group-hover:block rounded px-2 pt-6">
                {shareRoom.title}
              </p>
              <p className="text-gray-900 text-sm leading-5 font-medium mb-2 hidden group-hover:block rounded px-2 pt-10">
                옵션: {shareRoom.option1}
              </p>
            </div>
            <div className="w-full p-4 bg-white">
              <p className="text-gray-900 text-sm leading-5 font-normal mb-1">
                {shareRoom.location}
              </p>
              <div className="flex">
                <p className="mb-2 text-xl font-medium text-blue-500">
                  {shareRoom.averFee.toLocaleString()}원/박
                </p>
                <p className="ml-10 mb-2 text-xl font-medium text-gray-800">
                  총 {parseInt(shareRoom.rentFee).toLocaleString()}원
                </p>
              </div>
              <div className="flex">
                <div>
                  <p className="text-gray-500 text-sm leading-6 font-normal whitespace-nowrap overflow-hidden overflow-ellipsis">
                    {shareRoom.rentStartDate} 부터
                  </p>
                  <p className="text-gray-500 text-sm leading-6 font-normal whitespace-nowrap overflow-hidden overflow-ellipsis">
                    {shareRoom.rentEndDate} 까지
                  </p>
                </div>
                <div className="w-full ml-16 mt-3">
                  <p className="text-gray-500 text-xl leading-6 whitespace-nowrap overflow-hidden overflow-ellipsis font-semibold">
                    {shareRoom.days} 일 동안
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <PageComponent serverData={serverData} movePage={moveToList} />
    </>
  );
};

export default ListComponent;
