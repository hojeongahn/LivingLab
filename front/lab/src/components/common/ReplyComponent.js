import userIcon from "../../resources/images/user3.png";
import { getUser } from "../../api/userApi";
import { deleteReply, modifyReply } from "../../api/replyApi";
import { useEffect, useState } from "react";

const ReplyComponent = ({ replyNo, id, content, regDate, isWriter, isEdit, callbackFn }) => {
    const [nickname, setNickname] = useState('');
    const [isEditing, setIsEditing] = useState(false); // 수정 모드 관리 상태
    const [editedContent, setEditedContent] = useState(content); // 수정된 댓글 내용

    useEffect(() => {
        getUser(id).then(data => {
            setNickname(data.nickname);
        });
    }, [id]);

    const handleDelete = () => {
        deleteReply(replyNo).then(() => {
            callbackFn('댓글이 삭제되었습니다');
        });
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedContent(content); // 원래 내용으로 되돌리기
    };

    const handleSave = () => {
        if(!editedContent){
            callbackFn('최소 한 글자 이상 입력해주세요');
            return;
        }
        modifyReply(replyNo, editedContent).then(() => {
            setIsEditing(false);
            callbackFn('댓글이 수정되었습니다');
        });
    };

    return (
        <article id={replyNo} className="p-6 my-3 text-base border border-gray-200">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    <p className="inline-flex items-center mr-1 text-sm text-gray-900 font-semibold">
                        {nickname}
                    </p>
                    {isWriter && (
                        <span className="bg-teal-500 text-white text-sm px-1 rounded-3xl">작성자</span>
                    )}
                    <p className="ml-2 text-sm text-gray-600">{regDate}</p>
                </div>
                {isEdit && ( //해당 댓글 작성자만 수정/삭제 버튼 활성화
                    <div>
                        {!isEditing ? ( //수정버튼 누르기 전
                            <>
                                <button
                                    className="inline-flex items-center p-1 text-xs font-medium text-center text-white bg-gray-400 rounded-lg hover:bg-gray-500 focus:ring-4 focus:outline-none focus:ring-gray-50"
                                    type="button"
                                    onClick={handleEdit}
                                >
                                    수정
                                </button>
                                <button
                                    className="inline-flex items-center p-1 text-xs font-medium text-center text-white ml-1 bg-gray-400 rounded-lg hover:bg-gray-500 focus:ring-4 focus:outline-none focus:ring-gray-50"
                                    type="button"
                                    onClick={handleDelete}
                                >
                                    삭제
                                </button>
                            </>
                        ) : ( //수정버튼 누른 후
                            <>
                                <button
                                    className="inline-flex items-center p-1 text-xs font-medium text-center text-white bg-blue-400 rounded-lg hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-50"
                                    type="button"
                                    onClick={handleSave}
                                >
                                    수정 완료
                                </button>
                                <button
                                    className="inline-flex items-center p-1 text-xs font-medium text-center text-white ml-1 bg-slate-500 rounded-lg hover:bg-slate-700 focus:ring-4 focus:outline-none focus:ring-red-50"
                                    type="button"
                                    onClick={handleCancel}
                                >
                                    취소
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
            {!isEditing ? ( //수정버튼 누르기 전
                <p className="text-gray-500 dark:text-gray-400">{content}</p>
            ) : ( //수정버튼 누른 후
                <input
                    className="border border-gray-300 p-1 text-gray-900 rounded-lg w-full"
                    type="text"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                />
            )}
        </article>
    );
}

export default ReplyComponent;
