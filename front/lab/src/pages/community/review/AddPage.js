import AddComponent from "../../../components/community/review/AddComponent";

const AddPage = () => {
  return (
    <div className="text-xl p-4 flex-grow">
      <div className="m-auto bg-white w-4/5 rounded-md px-10 py-4">
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <div className="text-xl font-semibold pl-2 my-2 border-l-4 border-teal-300">리뷰게시판</div>
                <AddComponent/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPage;