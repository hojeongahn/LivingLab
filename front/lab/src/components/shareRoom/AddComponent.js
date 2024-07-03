import React, { useRef, useState } from 'react';
import { postAddShareRoom } from '../../api/shareRoomApi';
import ResultModal from '../common/ResultModal';
import useRoomCustomMove from '../../hooks/useRoomCustomMove';
import { useSelector } from 'react-redux';
import PostComponentForRoom from '../../components/shareRoom/PostComponentForRoom';
import Image1 from '../../resources/images/radio1.svg';
import Image2 from '../../resources/images/radio2.svg';
import iconEdit from '../../resources/images/iconEdit.png';
import { postCreateRoom } from '../../api/chatApi';

const AddComponent = () => {
  const [addResultModal, setAddResultModal] = useState(null);
  const [result, setResult] = useState(null);
  const [postImageFiles, setPostImageFiles] = useState([]); // 이미지 파일 프리뷰
  const { moveToList } = useRoomCustomMove();
  const imgRef = useRef();
  const loginInfo = useSelector((state) => state.loginSlice);
  const ino = loginInfo.id;

  const setAddress = (address) => {
    setShareRoom((prev) => ({ ...prev, location: address }));
  };

  const handleImageChange = (e) => {
    // 이미지 변경
    const files = Array.from(e.target.files);
    const nonImageFiles = files.filter((file) => !file.type.startsWith('image/'));

    if (nonImageFiles.length > 0) {
      setAddResultModal('이미지 파일만 등록 가능합니다');
      imgRef.current.value = '';
      setPostImageFiles([]);
      return;
    }

    const imagePreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));

    setPostImageFiles(imagePreviews);
  };

  const handleRemoveImage = (index) => {
    // 이미지 제거
    setPostImageFiles((postFiles) => postFiles.filter((_, i) => i !== index));
    updateFileInput(index);
  };

  const updateFileInput = (removeIndex) => {
    // 입력된 파일 업데이트
    const dataTransfer = new DataTransfer();
    const files = Array.from(imgRef.current.files);
    files.forEach((file, index) => {
      if (index !== removeIndex) {
        //removeIndex와 일치하지 않는 파일만 dataTransfer에 추가
        dataTransfer.items.add(file);
      }
    });
    imgRef.current.files = dataTransfer.files; //제거된 파일 반영
  };

  const initState = {
    roomNo: 0,
    title: '',
    rentFee: 0,
    parking: '',
    option1: '',
    location: '',
    files: [],
    id : 0,
    roomHit: 0,
    uploadFileNames: [],
  };
  const [shareRoom, setShareRoom] = useState({ ...initState });

  const handleChangeShareRoom = (e) => {
    shareRoom[e.target.name] = e.target.value;
    setShareRoom({ ...shareRoom });
  };

  const calculateDaysBetweenDates = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    return Math.round(daysDiff); // 소수점은 제거하고 정수로 반환
  };

  const handleClickAdd = async () => {
    try {
      const files = imgRef.current.files;
      const formData = new FormData();
      const daysBetween = calculateDaysBetweenDates(shareRoom.rentStartDate, shareRoom.rentEndDate);
      const averFee = Math.ceil(shareRoom.rentFee / daysBetween);

      if (!shareRoom.title || !shareRoom.content) {
        setAddResultModal('제목과 내용을 입력해주세요');
        return;
      }
      if (!shareRoom.rentFee) {
        setAddResultModal('금액을 입력해 주세요');
        return;
      }
      if (!shareRoom.option1) {
        setAddResultModal('옵션을 입력해 주세요');
        return;
      }
      if (!shareRoom.parking) {
        setAddResultModal('주차 가능여부를 선택해 주세요');
        return;
      }
      if (!shareRoom.rentStartDate || !shareRoom.rentEndDate) {
        setAddResultModal('시작일과 종료일을 입력해 주세요');
        return;
      }
      if (!shareRoom.location) {
        setAddResultModal('주소를 입력해주세요');
        return;
      }
      if (!files[0]) {
        setAddResultModal('사진을 등록해주세요');
        return;
      }

      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      // 파일이 아닌 데이터를 formData에 추가
      formData.append('id', ino);
      formData.append('title', shareRoom.title);
      formData.append('content', shareRoom.content);
      formData.append('rentFee', shareRoom.rentFee);
      formData.append('parking', shareRoom.parking);
      formData.append('option1', shareRoom.option1);
      formData.append('rentEndDate', shareRoom.rentEndDate);
      formData.append('rentStartDate', shareRoom.rentStartDate);
      formData.append('averFee', averFee);
      formData.append('days', daysBetween);
      formData.append('roomHit', shareRoom.roomHit); // roomHit 값을 formData에 추가
      formData.append('location', shareRoom.location);

      postAddShareRoom(formData);
      setResult('게시글이 등록되었습니다');
    } catch (error) {
      console.error('Error adding post:', error);
      setAddResultModal('게시글 등록에 실패했습니다.');
    }
  };

  const closeModal = () => {
    setResult(null);
    moveToList();
  };

  return (
    <div id="full" className="w-[1200px] h-full mx-auto">
      {result && <ResultModal title={'알림'} content={`${result}`} callbackFn={closeModal} />}
      {addResultModal && <ResultModal title={'알림'} content={`${addResultModal}`} callbackFn={() => setAddResultModal(null)} />}
      <div id="title-area" className="pt-[80px] pb-[64px]">
        <h1 className="text-5xl text-gray-900 leading-3 font-bold text-center tracking-tighter">자취방 등록</h1>
      </div>
      <div id="main-area" className="w-full">
        <section id="info" className="">
          <header className="flex items-end justify-between mb-4">
            <h1 className="text-xl text-gray-900 leading-8 font-bold ">방 정보</h1>
          </header>
          <table id="select-info" className="w-full border-t-2 border-gray-900 border-collapse">
            <colgroup>
              <col className="w-[150px]"></col>
              <col></col>
            </colgroup>
            <tbody>
              <tr className="border-b border-neutral-200">
                <th className="pl-5 text-left align-middle bg-neutral-100">
                  <h1 className="text-[14px] text-gray-900 leading-6 font-bold">제목</h1>
                </th>
                <td className="align-middle px-4 py-5 border-l border-neutral-200">
                  <div className="w-auto">
                    <div className="w-full flex">
                      <div className="flex-grow flex flex-wrap justify-start">
                        <div className="">
                          <input
                            type="text"
                            value={shareRoom.title}
                            onChange={handleChangeShareRoom}
                            name="title"
                            className="w-full h-full text-gray-900 text-sm leading-6 font-normal px-4 border border-gray-200 rounded-sm bg-white select-none"
                          ></input>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-neutral-200">
                <th className="pl-5 text-left align-middle bg-neutral-100">
                  <h1 className="text-[14px] text-gray-900 leading-6 font-bold">상세설명</h1>
                </th>
                <td className="align-middle px-4 py-5 border-l border-neutral-200">
                  <div className="w-auto">
                    <div className="w-full flex">
                      <div className="flex-grow flex flex-wrap justify-start">
                        <label className="flex flex-col w-full h-48 py-2.5 px-4 relative">
                          <div className="flex-grow flex items-start w-full h-full">
                            <textarea
                              row="3"
                              value={shareRoom.content}
                              onChange={handleChangeShareRoom}
                              name="content"
                              className="py-2.5 px-4 text-gray-900 text-sm leading-6 font-normal border bg-transparent absolute inset-0.5 select-none resize-none z-10"
                            ></textarea>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-neutral-200">
                <th className="pl-5 text-left align-middle bg-neutral-100">
                  <h1 className="text-[14px] text-gray-900 leading-6 font-bold">금액 (전체기간)</h1>
                </th>
                <td className="align-middle px-4 py-5 border-l border-neutral-200">
                  <div className="w-[160px]">
                    <div className="w-full flex">
                      <div className="flex-grow flex flex-wrap justify-start">
                        <div className="block w-full h-11 relative">
                          <input
                            type="text"
                            value={shareRoom.rentFee}
                            onChange={handleChangeShareRoom}
                            name="rentFee"
                            className="w-full h-full text-gray-900 text-sm leading-6 font-normal px-9 border border-gray-200 rounded-sm bg-white select-none"
                          ></input>
                          <p className="text-gray-900 text-sm leading-6 font-normal whitespace-nowrap absolute top-1/4 right-4 pointer-events-none select-none">원</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-neutral-200">
                <th className="pl-5 text-left align-middle bg-neutral-100">
                  <h1 className="text-[14px] text-gray-900 leading-6 font-bold">옵션</h1>
                </th>
                <td className="align-middle px-4 py-5 border-l border-neutral-200">
                  <div className="w-auto">
                    <div className="w-full flex">
                      <div className="flex-grow flex flex-wrap justify-start">
                        <div className="">
                          <input
                            type="text"
                            value={shareRoom.option1}
                            onChange={handleChangeShareRoom}
                            name="option1"
                            className="w-full h-full text-gray-900 text-sm leading-6 font-normal px-4 border border-gray-200 rounded-sm bg-white select-none"
                          ></input>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-neutral-200">
                <th className="pl-5 text-left align-middle bg-neutral-100">
                  <h1 className="text-[14px] text-gray-900 leading-6 font-bold">주차</h1>
                </th>
                <td className="align-middle px-4 py-5 border-l border-neutral-200">
                  <div className="flex items-start justify-start w-full">
                    <div className="flex-none w-auto">
                      <div className="flex w-full pt-0 pb-0">
                        <div className="flex-grow flex flex-wrap justify-start mt-[-20px] ml-[-16px]">
                          <label className="mt-5 ml-4 flex-none flex items-start justify-start max-w-full pt-0 pb-0">
                            <input
                              className="flex-none w-6 h-6 m-0 border-0 rounded-full appearance-none cursor-pointer"
                              type="radio"
                              name="parking"
                              value="O"
                              checked={shareRoom.parking === 'O'}
                              onChange={handleChangeShareRoom}
                              style={{
                                backgroundImage: shareRoom.parking === 'O' ? `url(${Image2})` : `url(${Image1})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                              }}
                            ></input>
                            <p className="pl-1 text-black text-sm leading-6 select-none cursor-pointer">가능</p>
                          </label>
                          <label className="mt-5 ml-4 flex-none flex items-start justify-start max-w-full pt-0 pb-0">
                            <input
                              className="flex-none w-6 h-6 m-0 border-0 rounded-full appearance-none cursor-pointer"
                              type="radio"
                              name="parking"
                              value="X"
                              checked={shareRoom.parking === 'X'}
                              onChange={handleChangeShareRoom}
                              style={{
                                backgroundImage: shareRoom.parking === 'X' ? `url(${Image2})` : `url(${Image1})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                              }}
                            ></input>
                            <p className="pl-1 text-black text-sm leading-6 select-none cursor-pointer">불가능</p>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-neutral-200">
                <th className="pl-5 text-left align-middle bg-neutral-100">
                  <h1 className="text-[14px] text-gray-900 leading-6 font-bold">시작일</h1>
                </th>
                <td className="align-middle px-4 py-5 border-l border-neutral-200">
                  <div className="w-auto">
                    <div className="w-full flex">
                      <div className="flex-grow flex flex-wrap justify-start">
                        <div className="">
                          <input
                            type="date"
                            value={shareRoom.rentStartDate}
                            onChange={handleChangeShareRoom}
                            name="rentStartDate"
                            className="w-full h-full text-gray-900 text-sm leading-6 font-normal px-4 border border-gray-200 rounded-sm bg-white select-none"
                          ></input>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-neutral-200">
                <th className="pl-5 text-left align-middle bg-neutral-100">
                  <h1 className="text-[14px] text-gray-900 leading-6 font-bold">종료일</h1>
                </th>
                <td className="align-middle px-4 py-5 border-l border-neutral-200">
                  <div className="w-auto">
                    <div className="w-full flex">
                      <div className="flex-grow flex flex-wrap justify-start">
                        <div className="">
                          <input
                            type="date"
                            value={shareRoom.rentEndDate}
                            onChange={handleChangeShareRoom}
                            name="rentEndDate"
                            className="w-full h-full text-gray-900 text-sm leading-6 font-normal px-4 border border-gray-200 rounded-sm bg-white select-none"
                          ></input>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-neutral-200">
                <th className="pl-5 text-left align-middle bg-neutral-100">
                  <h1 className="text-[14px] text-gray-900 leading-6 font-bold">주소</h1>
                </th>
                <td className="align-middle px-4 py-5 border-l border-neutral-200">
                  <div className="w-auto">
                    <div className="w-full flex">
                      <div className="flex-grow flex flex-wrap justify-start">
                        <div className="">
                          <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                            <div className="flex">
                              <div className="w-full pl-1">
                                <input
                                  className="w-full h-full text-gray-700 text-base leading-6 font-normal px-4 border border-gray-300 rounded-sm bg-white transition-all duration-150 ease-out select-none"
                                  name="address"
                                  type="text"
                                  placeholder="주소(우편번호 및 도로명 검색)"
                                  value={shareRoom.location}
                                />
                              </div>
                              <div className="w-1/5 text-base">
                                <PostComponentForRoom setAddress={setAddress}></PostComponentForRoom>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
        <section id="photo" className="mt-12">
          <header className="flex items-end justify-between mb-4">
            <h1 className="text-xl text-gray-900 leading-8 font-bold ">사진 등록</h1>
          </header>
          <table id="select-info" className="w-full border-t-2 border-gray-900 border-collapse">
            <colgroup>
              <col className="w-[150px]"></col>
              <col></col>
            </colgroup>
            <tbody>
              <tr className="border-b border-neutral-200">
                <th className="pl-5 text-left align-middle bg-neutral-100">
                  <h1 className="text-[14px] text-gray-900 leading-6 font-bold">방 사진</h1>
                </th>
                <td className="align-middle px-4 py-5 border-l border-neutral-200">
                  <div className="col-start-3 col-span-4 mt-2 border rounded overflow-x-scroll whitespace-nowrap">
                    {postImageFiles.map((file, index) => (
                      <div key={index} className="relative m-3 w-36 h-36 inline-block align-top border">
                        <img src={file.url} alt={file.name} className="w-36 h-36 object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 bg-slate-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-slate-600"
                          aria-label="Remove image"
                        >
                          X
                        </button>
                      </div>
                    ))}
                    <div className="relative inline-block m-3 w-36 h-36 border-2 border-gray-300 border-dashed rounded-md items-center justify-center cursor-pointer hover:bg-slate-100">
                      <input ref={imgRef} id="file-upload" type="file" multiple={true} onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <label htmlFor="file-upload" className="text-mainColor font-bold text-4xl flex flex-col items-center justify-center h-full w-full">
                        +<span className="text-base mt-1">이미지 첨부</span>
                      </label>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
        <div className="flex justify-end">
          <div className="relative mb-4 flex p-4 flex-wrap items-stretch">
            <button type="button" className="rounded p-4 w-36 bg-blue-500 text-xl text-white" onClick={handleClickAdd}>
              완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddComponent;
