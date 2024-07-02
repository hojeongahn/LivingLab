import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useCustomMyPage from '../../../hooks/useCustomMyPage';
import { myLike } from '../../../api/likeApi';
import { getType } from '../../../api/communityApi';
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

const MyLikeListPage = () => {
  const { page, size, moveToLikeList } = useCustomMyPage();
  const [serverData, setServerData] = useState(initState);
  const loginInfo = useSelector((state) => state.loginSlice);
  const id = loginInfo.id;
  const navigate = useNavigate();

  useEffect(() => {
    myLike({ page, size }, id).then(data => {
      setServerData(data);
    })
  }, [page, size, id]);


  const handleRedirect = async (like) => {
    if(like.buyNo != null){
      navigate(`/buy/read/${like.buyNo}`);
    }
    else if(like.teamNo != null){
      navigate(`/team/read/${like.teamNo}`);
    }
    else if(like.marketNo != null){
      navigate(`/market/read/${like.marketNo}`);
    }
    else if(like.commNo != null){
      const type = await getType(like.commNo);
      if(type === '1'){
        navigate(`/community/tip/read/${like.commNo}`);
      }
      if(type === '2'){
        navigate(`/community/qna/read/${like.commNo}`);
      }
      if(type === '3'){
        navigate(`/community/review/read/${like.commNo}`);
      }
      if(type === '4'){
        navigate(`/community/help/read/${like.commNo}`);
      }
    }
    else if(like.roomNo != null){
      navigate(`/shareRoom/read/${like.roomNo}`);
    }
  }

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
                        <h3 className="text-xl font-bold leading-none text-gray-900">나의 좋아요</h3>
                      </div>
                      <hr className="my-4" />
                      <table className="min-w-full text-center text-lg font-light text-surface">
                        <thead className="text-sm border-b-2 border-neutral-500 font-semibold">
                          <tr>
                            <th scope="col" className="w-3/12 py-4">카테고리</th>
                            <th scope="col" className="w-6/12 py-4">제목</th>
                            <th scope="col" className="w-3/12 py-4">작성자</th>
                          </tr>
                        </thead>
                        <tbody>
                          {serverData.dtoList.length > 0 ? (
                            serverData.dtoList.map(like =>
                              <tr
                                className="text-base border-b border-neutral-200 transition duration-300 ease-in-out hover:bg-neutral-100 hover:cursor-pointer"
                                onClick={()=>handleRedirect(like)}>
                                <td className="whitespace-nowrap py-4">
                                  {like.buyNo && '공동구매'}
                                  {like.teamNo && '동네모임'}
                                  {like.marketNo && '동네장터'}
                                  {like.commNo && '커뮤니티'}
                                  {like.roomNo && '자취방쉐어'}
                                </td>
                                <td className="whitespace-nowrap py-4">{like.title}</td>
                                <td className="whitespace-nowrap py-4">
                                  {like.nickname}
                                </td>
                              </tr>
                            ))
                            :
                            (
                              <tr>
                                <td colSpan="5" className="py-4">
                                  작성한 게시물이 없습니다
                                </td>
                              </tr>
                            )}
                        </tbody>
                      </table>
                      <PageComponent serverData={serverData} movePage={moveToLikeList} />
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

export default MyLikeListPage;