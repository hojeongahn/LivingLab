const ResultModal = ({ title, content, callbackFn }) => {
  return (
    <div
      className={`fixed top-0 left-0 z-[1055] flex h-full w-full items-center justify-center bg-black bg-opacity-20`}
      onClick={() => {
        if (callbackFn) {
          callbackFn();
        }
      }}
    >
      <div
        className="relative bg-white shadow opacity-100 w-1/4 rounded-md px-6 min-w-[300px] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal on inner click
      >
        <div className="w-full text-center bg-warming-400 mt-6 mb-6 pb-2 text-xl border-b-2 border-gray-500">
          {title}
        </div>
        <div className="w-full text-center text-xl pt-4 pb-4">
          {content}
        </div>
        <div className="w-full flex justify-center">
          <button
            className="rounded bg-mainColor mt-4 mb-4 px-6 py-2 text-lg text-white hover:bg-teal-600"
            onClick={() => {
              if (callbackFn) {
                callbackFn();
              }
            }}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
export default ResultModal;