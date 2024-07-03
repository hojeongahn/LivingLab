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

const useCustomMyPage = () => {
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();
  const page = getNum(queryParams.get("page"), 1);
  const size = getNum(queryParams.get("size"), 10);
  const queryDefault = createSearchParams({ page, size }).toString();

  const moveToBuyList = (pageParam) => {
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
    navigate({ pathname: `/myPage/activity/buy`, search: queryStr });
  };

  const moveToTeamList = (pageParam) => {
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
    navigate({ pathname: `/myPage/activity/team`, search: queryStr });
  };

  const moveToMarketList = (pageParam) => {
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
    navigate({ pathname: `/myPage/activity/market`, search: queryStr });
  };

  const moveToShareRoomList = (pageParam) => {
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
    navigate({ pathname: `/myPage/activity/shareroom`, search: queryStr });
  };

  const moveToCommunityList = (pageParam) => {
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
    navigate({ pathname: `/myPage/activity/community`, search: queryStr });
  };

  const moveToLikeList = (pageParam) => {
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
    navigate({ pathname: `/myPage/activity/like`, search: queryStr });
  };

  const moveToRead = (type,num) => {
    navigate({ pathname: `/${type}/read/${num}`, search: queryDefault });
  };

  const moveToReadCommunity = (type,num) => {
    if(type === '1'){
      navigate({ pathname: `/community/tip/read/${num}`, search: queryDefault });
    }
    else if(type === '2'){
      navigate({ pathname: `/community/qna/read/${num}`, search: queryDefault });
    }
    else if(type === '3'){
      navigate({ pathname: `/community/review/read/${num}`, search: queryDefault });
    }
    else{
      navigate({ pathname: `/community/help/read/${num}`, search: queryDefault });
    }
  };

  return { moveToBuyList, moveToTeamList, moveToMarketList, moveToShareRoomList, moveToCommunityList, moveToLikeList, moveToRead, moveToReadCommunity, page, size };
};

export default useCustomMyPage;