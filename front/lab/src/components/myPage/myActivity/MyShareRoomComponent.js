import React, { useEffect, useState } from 'react';
import { myList } from '../../../api/shareRoomApi';
import { useNavigate } from 'react-router-dom';


const MyShareRoomComponent = ({id}) => {
  const [serverData, setServerData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    myList(id).then((data) => {
      setServerData(data);
    });
  }, [id]);

  const moveToRead = (no) => {
    const intNo = Number(no);
    navigate(`/shareRoom/read/${intNo}`);
  }

  const moveToList = () => {
    navigate('/myPage/activity/shareroom');
  }

  return (
      <div className="w-1/2 h-72 m-4">
        <div className="p-6 h-full overflow-hidden bg-white rounded-lg border shadow-md">
          <div className="flex justify-between items-center ml-2 mb-6">
            <h3 className="text-xl font-bold leading-none text-gray-900">자취방쉐어</h3>
            <span className="text-base font-semibold text-gray-500 cursor-pointer" onClick={()=>moveToList()}>
              더보기
            </span>
          </div>
            <ul className="divide-y divide-gray-200 h-full">
              {serverData.length > 0 ? (
                serverData.map((room) => (
                  <li className="py-4 hover:bg-slate-100 cursor-pointer" onClick={()=>moveToRead(room.no)}>
                  <div className="grid grid-cols-5">
                    <div className="col-span-2 pl-2 text-left whitespace-nowrap overflow-hidden text-ellipsis">
                      <span className="text-base font-semibold text-gray-900">
                        {room.title}
                      </span>
                    </div>
                    <div className="col-span-3 text-right">
                      <span className="text-sm text-gray-900 mr-2">
                      {room.rentStartDate} ~ {room.rentEndDate}
                      </span>
                      <span className="text-sm text-black font-semibold p-1 rounded mr-1 bg-yellow-100">
                      총 {parseInt(room.rent_fee).toLocaleString()}원
                      </span>
                    </div>
                  </div>
                 </li>
                ))
              ) 
              : 
              (
                <li className="py-4">
                <div className="grid grid-cols-4">
                  <div className="col-span-4 text-center text-base">
                      작성한 게시물이 없습니다
                  </div>
                </div>
               </li>
              )}
            </ul>

        </div>
      </div>
  );
};
export default MyShareRoomComponent;
