//커뮤니티 게시판 커스텀훅
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
  
  const getNum = (param, defaultValue) => {
    if (!param) {
      return defaultValue;
    }
    return parseInt(param);
  };
  
  const useCustomTip = () => {
    const navigate = useNavigate();
    const [queryParams] = useSearchParams();
    const page = getNum(queryParams.get("page"), 1);
    const size = getNum(queryParams.get("size"), 10);
    const queryDefault = createSearchParams({ page, size }).toString();
  
    const moveToList = (pageParam) => {
      let queryStr = "";
      if (pageParam) {
        const pageNum = getNum(pageParam.page, 1);
        const sizeNum = getNum(pageParam.size, 10);
        queryStr = createSearchParams({
          page: pageNum,
          size: sizeNum,
        }).toString();
      } else {
        queryStr = queryDefault;
      }
      navigate({ pathname: `../tip/list`, search: queryStr });
    };
  
    const moveToModify = (num) => {
      navigate({ pathname: `../tip/modify/${num}`, search: queryDefault }); // 수정시에 기존의 쿼리문자열을 유지하기 위해
    };
  
    const moveToRead = (num) => {
      navigate({ pathname: `../tip/read/${num}`, search: queryDefault });
    };
  
    const moveToAdd = () => {
      navigate({ pathname: `../tip/add`, search: '' });
    };
  
    return { moveToList, moveToModify, moveToRead, moveToAdd, page, size };
  };

  export default useCustomTip;
  