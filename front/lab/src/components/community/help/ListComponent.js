import SearchComponent from "../../common/SearchComponent";
import useCustomHelp from "../../../hooks/useCustomHelp";
import { getListHelp } from "../../../api/communityApi";
import { useEffect, useState } from "react";
import PageComponent from "../../common/PageComponent";
import nolist from "../../../resources/images/nolist.png"
import flagIcon from "../../../resources/images/flagIcon.png"
import fullheart from "../../../resources/images/heart_full.png";

const initState = {
  dtoList: [], //한 페이지에 불러오는 게시물 갯수
  pageNumList: [],
  pageRequestDto: null,
  prev: false,
  next: false,
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0
}

const ListComponent = () => {
  const {page, size, moveToList, moveToRead} = useCustomHelp();
  const [serverData, setServerData] = useState(initState);
  const [search, setSearch] = useState('');
  useEffect(()=>{
    getListHelp({page,size}, search).then(data=>{
          setServerData(data);
      })
  }, [page,size, search]);

  const handleSearch = (query) => {
    setSearch(query);
  };

    return(
      <>
      <div className="my-5">
      <SearchComponent onSearch={handleSearch}/>
      </div>
      <table className="min-w-full text-center text-lg font-light text-surface">
        <thead className="text-sm border-b-2 border-neutral-500 font-semibold">
          <tr>
            <th scope="col" className="w-2/12 py-4">카테고리</th>
            <th scope="col" className="w-1/12 py-4"><img src={fullheart} className="w-4 mx-auto"/></th>
            <th scope="col" className="w-6/12 py-4">제목</th>
            <th scope="col" className="w-1/12 py-4">날짜</th>
            <th scope="col" className="w-2/12 py-4">작성자</th>
          </tr>
        </thead>
        <tbody>
        {serverData.dtoList.length>0? (
        serverData.dtoList.map(help=>
            <tr
              className="text-base border-b border-neutral-200 transition duration-300 ease-in-out hover:bg-neutral-100 hover:cursor-pointer"
              onClick={()=>moveToRead(help.commNo)}>
              <td className="whitespace-nowrap py-4">
                {help.commCategory === '1' && '부동산'}
                {help.commCategory === '2' && '인테리어'}
                {help.commCategory === '3' && '할인정보'}
                {help.commCategory === '4' && '기타'}
              </td>
              <td className="whitespace-nowrap py-4">{help.commHit}</td>
              <td className="whitespace-nowrap py-4">
                {help.title}
                {help.flag && (
                    <img src={flagIcon} alt="Flag Icon" className="inline-block ml-2 w-5 h-5" />
                  )}
              </td>
              <td className="whitespace-nowrap py-4">{help.regDate}</td>
              <td className="whitespace-nowrap py-4">{help.nickname}</td>
            </tr>
        ))
        :
        (
          <tr>
            <td colSpan="5" className="py-4">
              등록된 게시물이 없습니다
              <img src={nolist} width={60} alt="..." className="mx-auto mt-3"/>
            </td>
          </tr>
        )}
          </tbody>
          </table>
          <PageComponent serverData={serverData} movePage={moveToList}/>
      </>
    );

}

export default ListComponent;