import MyInfoComponent from '../../../components/myPage/myInfo/MyInfoComponent';

const MyInfoPage = () => {

  return (
    <div className="text-xl flex-grow h-fit w-4/5">
      <div className="bg-white w-full rounded px-10 py-4 h-full shadow-md">
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <div className="text-2xl pl-2 my-2 border-l-4 font-Jua border-teal-300">회원정보</div>
                <MyInfoComponent />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyInfoPage;
