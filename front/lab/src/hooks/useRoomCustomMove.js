import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

const getNum = (param, defaultValue) => {
  if (!param) {
    return defaultValue;
  }
  return parseInt(param);
};

const useRoomCustomMove = () => {
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();
  const page = getNum(queryParams.get("page"), 1);
  const size = getNum(queryParams.get("size"), 9);
  const queryDefault = createSearchParams({ page, size }).toString();

  const moveToList = (pageParam) => {
    let queryStr = "";
    if (pageParam) {
      const pageNum = getNum(pageParam.page, 1);
      const sizeNum = getNum(pageParam.size, 9);
      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
      }).toString();
    } else {
      queryStr = queryDefault;
    }
    navigate({ pathname: `../list`, search: queryStr });
  };

  const moveToModify = (num) => {
    console.log(queryDefault);
    console.log("what is num"+num);
    navigate({ pathname: `../modify/${num}`, search: queryDefault }); // 수정시에 기존의 쿼리문자열을 유지하기 위해
  };

  const moveToRead = (num) => {
    console.log(queryDefault);
    navigate({ pathname: `../read/${num}`, search: queryDefault });
  };

  const moveToAdd = () => {
    console.log(queryDefault);
    navigate({ pathname: `../add`, search: queryDefault });
  }

  return { moveToList, moveToModify, moveToRead, moveToAdd, page, size };
};
export default useRoomCustomMove;
// 네비게이션 관련 커스텀 훅
