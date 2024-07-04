import ReplyComponent from "../../common/ReplyComponent";
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { API_SERVER_HOST, getOneReview, deleteOne, increaseLike, decreaseLike } from "../../../api/communityApi";
import { addReply, getList } from "../../../api/replyApi";
import { likeClick, unlikeClick, likeInfo } from '../../../api/likeApi';
import useCustomReview from "../../../hooks/useCustomReview";
import ResultModal from "../../common/ResultModal";
import emptyheart from '../../../resources/images/heart_empty.png';
import fullheart from '../../../resources/images/heart_full.png';
import InfoModal from '../../common/InfoModal';

const initState = {
    commNo: 0,
    title: '',
    content: '',
    commHit: 0,
    commCategory: '',
    uploadFileNames: []
};

const initState2 = {
    likeNo: 0,
    id: 0,
    no: 0,
    type: ''
};


const host = API_SERVER_HOST;

const ReadComponent = ({commNo}) => {
    const [result, setResult] = useState(null); //게시글 삭제 모달창
    const [addResultModal, setAddResultModal] = useState(null); //댓글 등록 모달창
    const [review, setReview] = useState(initState); //해당 게시물 내용
    const [input, setInput] = useState(''); //댓글 내용
    const [replies, setReplies] = useState([]);
    const { moveToList, moveToModify } = useCustomReview();
    const loginInfo = useSelector((state) => state.loginSlice);
    const id = loginInfo?.id;
    const email = loginInfo?.email;
    const [isLiked, setIsLiked] = useState({}); // true/false에 따라 하트 이미지 변경
    const [like, setLike] = useState(initState2);
    const [info, setInfo] = useState(null); //좋아요 모달창 문구 설정

    useEffect(() => {
        getOneReview(commNo).then(data => {
            setReview(data)
        })
    }, [commNo, info])

    //댓글 리스트 호출
    useEffect(() => {
        getList(commNo).then(data => {
            setReplies(data);
        });
    }, [commNo, addResultModal]);

    //좋아요 정보 조회
    useEffect(() => {
        if (email) {
          //로그인시에만 실행
          likeInfo('community',commNo, id).then((data) => {
            setLike(data);
            if (data) {
              //data가 있으면 이미 좋아요 누른글
              setIsLiked(true);
            } else {
              setIsLiked(false);
            }
          });
        }
      }, [commNo, id, email, info]);

    const handleClickDelete = (e) => {
        deleteOne(commNo);
        setResult("게시글이 삭제되었습니다");
    }

    const closeModal = () => {
        setResult(null);
        moveToList();
    }

    //좋아요 관련 모달창
    const closeInfoModal = () => {
        setInfo(null);
    };

    //ReplyComponent에서 보낸 메세지값 처리
    const setModalMessage = (message) => {
        setAddResultModal(message);
    }

    // 댓글 등록
    const handleClickAddReply = () => {
        if(!email){
            setAddResultModal("로그인 후 이용할 수 있습니다");
            return;
        }
        if(!input){
            setAddResultModal("내용을 입력해주세요");
            return;
        }
        const newComment = {
            id: id,
            content: input,
            commNo : commNo
        };
        addReply(newComment);
        setAddResultModal("댓글이 등록되었습니다");
        setInput('');
    };

    //좋아요 클릭 시
    const handleLikeClick = () => {
        if (!email) {
          setInfo('로그인 후 이용 가능합니다');
          return;
        }
        if (isLiked) {
          unlikeClick(like.likeNo);
          decreaseLike(commNo);
          setInfo('좋아요 목록에서 삭제되었습니다');
        } else {
          likeClick('community',commNo, id);
          increaseLike(commNo);
          setInfo('좋아요 목록에 추가되었습니다');
        }
        setIsLiked(!isLiked);
      };

    return (
        <div className="relative p-4">
            <div className="max-w-5xl mx-auto">
                <div className="mt-3 w-full rounded-b flex flex-col justify-between leading-normal">
                    <div>
                        {result && <ResultModal title={'알림'} content={`${result}`} callbackFn={closeModal} />}
                        <div className="mb-2">
                            <span className="text-slate-900 text-base bg-teal-200 rounded-3xl px-2 pt-0.5 pb-1">
                                {review.commCategory === '1' && '부동산'}
                                {review.commCategory === '2' && '인테리어'}
                                {review.commCategory === '3' && '할인정보'}
                                {review.commCategory === '4' && '기타'}
                            </span>
                        </div>
                        <h1 className="text-gray-900 font-bold text-3xl">{review.title}</h1>
                        <div className="py-5 text-sm font-regular text-gray-900 flex">
                            <p className="mr-3 flex flex-row items-center">
                                <p className="ml-1">{review.nickname}</p>
                            </p>
                            <p className="mr-3 flex flex-row items-center">
                                <p className="ml-1">2024-06-02</p>
                            </p>
                            <p className="ml-auto mr-2 flex flex-row">
                                <img src={email && isLiked ? fullheart : emptyheart} onClick={handleLikeClick} alt="..." className="w-5 mr-3 inline" /><span className="mx-1">{review.commHit}</span>
                            </p>
                        </div>
                        <hr></hr>

                        {review.uploadFileNames.map((imgFile, i) =>
                            <img
                                alt="review"
                                key={i}
                                width={600}
                                src={`${host}/api/community/review/display/${imgFile}`}
                                className="my-3" />
                        )}

                        <p className="text-base leading-8 my-5">
                            {review.content.split('\n').map((line) => {
                                return (
                                    <span>{line}<br /></span>
                                );
                            })}
                        </p>
                        <hr></hr>
                        <div className="flex justify-center space-x-2 mt-4">
                            {id === review.id ?
                                (
                                    <>
                                        <button type="button" className="bg-gray-400 text-white rounded-md text-sm px-1 py-0.5 hover:bg-gray-500 ml-1" onClick={() => moveToModify(commNo)}>수정하기</button>
                                        <button type="button" className="bg-gray-400 text-white rounded-md text-sm px-1 py-0.5 hover:bg-gray-500 ml-1" onClick={handleClickDelete}>삭제하기</button>
                                    </>
                                )
                                :
                                (<></>)
                            }
                            <button type="button" className="bg-gray-400 text-white rounded-md text-sm px-1 py-0.5 hover:bg-gray-500 ml-1" onClick={() => moveToList()}>목록으로 이동</button>
                        </div>
                        <div>
                            <div className="my-6 flex items-center space-x-2">
                                <input
                                    type="text"
                                    placeholder="댓글을 입력해주세요"
                                    value={input}
                                    className="flex-1 py-2 px-2 text-base bg-white rounded-lg border border-gray-200"
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => (e.key === 'Enter' ? handleClickAddReply() : null)}
                                />
                                <button
                                    type="button"
                                    className="py-2.5 px-4 text-xs font-medium text-center text-white bg-subColor opacity-90 rounded-lg hover:bg-amber-900"
                                    onClick={handleClickAddReply}
                                >
                                    댓글 등록
                                </button>
                            </div>

                        </div>
                        {replies.length > 0 ? (
                            replies.map(reply =>
                                <ReplyComponent
                                    replyNo={reply.replyNo}
                                    id={reply.id}
                                    content={reply.content}
                                    regDate={reply.regDate}
                                    isWriter={review.id === reply.id ? true : false}
                                    isEdit={id === reply.id ? true : false}
                                    callbackFn={setModalMessage}
                                />
                            )
                        )
                            :
                            (
                                <div className="flex justify-center text-base">
                                    등록된 댓글이 없습니다
                                </div>
                            )}
                    </div>
                </div>
            </div>
            {addResultModal && (<ResultModal title={'알림'} content={`${addResultModal}`} callbackFn={() => setAddResultModal(null)} />)}
            {/* 좋아요 기능 알림 모달 */}
            {info && <InfoModal title={'알림'} content={`${info}`} callbackFn={closeInfoModal} />}
        </div>
    );
}

export default ReadComponent;