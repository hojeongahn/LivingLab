import MyBuyComponent from '../../../components/myPage/myActivity/MyBuyComponent';
import MyTeamComponent from '../../../components/myPage/myActivity/MyTeamComponent';
import MyMarketComponent from '../../../components/myPage/myActivity/MyMarketComponent';
import MyShareRoomComponent from '../../../components/myPage/myActivity/MyShareRoomComponent';
import MyCommunityComponent from '../../../components/myPage/myActivity/MyCommunityComponent';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import heart from "../../../resources/images/heart_full.png";
import reply from "../../../resources/images/reply.png";

const MyActivityPage = () => {
  const loginInfo = useSelector((state) => state.loginSlice);
  const id = loginInfo.id;
  const navigate = useNavigate();

  const moveToLike = () => {
    navigate('/myPage/activity/like');
  }

  const moveToReply = () => {
    navigate('/myPage/activity/reply');
  }

  return (
    <div className="text-xl flex-grow h-fit flex w-4/5">
      <div className="bg-white w-full rounded px-10 py-4 h-full shadow-md">
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <div className="text-2xl pl-2 my-2 border-l-4 font-Jua border-teal-300">나의 활동</div>
                <div className="flex h-full justify-center">
                  <MyBuyComponent id={id}/>
                  <MyTeamComponent id={id}/>
                </div>
                <div className="flex h-full justify-center">
                  <MyMarketComponent id={id}/>
                  <MyShareRoomComponent id={id}/>
                </div>
                <div className="flex h-full justify-center">
                  <MyCommunityComponent id={id}/>
                  <div className="w-1/4 h-72 ml-5 mr-1 my-4 group" onClick={()=>moveToLike()}>
                    <div className="p-6 h-full overflow-hidden bg-white rounded-lg border shadow-md flex flex-col justify-center items-center transition-colors duration-300 group-hover:bg-gray-100 group-hover:cursor-pointer">
                      <p className="text-xl font-bold text-gray-900 mb-4">나의 좋아요</p>
                      <img src={heart} alt="..." className="w-24 h-24 transform transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  </div>
                  <div className="w-1/4 h-72 ml-1 mr-4 my-4 group" onClick={()=>moveToReply()}>
                    <div className="p-6 h-full overflow-hidden bg-white rounded-lg border shadow-md flex flex-col justify-center items-center transition-colors duration-300 group-hover:bg-gray-100 group-hover:cursor-pointer">
                      <p className="text-xl font-bold text-gray-900 mb-4">나의 댓글</p>
                      <img src={reply} alt="..." className="w-24 h-24 transform transition-transform duration-300 group-hover:scale-110" />
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

export default MyActivityPage;
