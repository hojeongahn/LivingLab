import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { myList } from '../../../api/replyApi';
import { getType } from '../../../api/communityApi';


const MyReplyListPage = () => {
  const [loadedReplies, setLoadedReplies] = useState([]);
  const loginInfo = useSelector((state) => state.loginSlice);
  const id = loginInfo.id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const data = await myList(id);
        const repliesWithTypes = await Promise.all(
          data.map(async (reply) => {
            const type = await getType(reply.commNo);
            let formattedType = '';
            let root = '';
            switch (type) {
              case '1':
                formattedType = '자취TIP공유';
                root = 'tip';
                break;
              case '2':
                formattedType = '질문게시판';
                root = 'qna';
                break;
              case '3':
                formattedType = '리뷰게시판';
                root = 'review';
                break;
              case '4':
                formattedType = '도움요청';
                root = 'help';
                break;
              default:
                formattedType = '기타';
                root = 'tip';
            }
            return { ...reply, formattedType, root };
          })
        );
        setLoadedReplies(repliesWithTypes);
      } catch (error) {
        console.error("Error fetching replies:", error);
      }
    };

    fetchReplies();
  }, [id]);

  const handleRedirect = (root, commNo) => {
        navigate(`/community/${root}/read/${commNo}`);
  };

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
                        <h3 className="text-xl font-bold leading-none text-gray-900">나의 댓글</h3>
                      </div>
                      <hr className="my-4" />
                      <table className="min-w-full text-center text-lg font-light text-surface">
                        <thead className="text-sm border-b-2 border-neutral-500 font-semibold">
                          <tr>
                            <th scope="col" className="w-2/12 py-4">게시판</th>
                            <th scope="col" className="w-7/12 py-4">내용</th>
                            <th scope="col" className="w-3/12 py-4">작성일</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loadedReplies.length > 0 ? (
                            loadedReplies.map(reply =>
                              <tr
                                className="text-base border-b border-neutral-200 transition duration-300 ease-in-out hover:bg-neutral-100 hover:cursor-pointer"
                                onClick={()=>handleRedirect(reply.root, reply.commNo)}>
                                <td className="whitespace-nowrap py-4">{reply.formattedType}</td>
                                <td className="whitespace-nowrap py-4">{reply.content}</td>
                                <td className="whitespace-nowrap py-4">{reply.regDate}</td>
                              </tr>
                            ))
                            :
                            (
                              <tr>
                                <td colSpan="5" className="py-4">
                                  작성한 댓글이 없습니다
                                </td>
                              </tr>
                            )}
                        </tbody>
                      </table>
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

export default MyReplyListPage;