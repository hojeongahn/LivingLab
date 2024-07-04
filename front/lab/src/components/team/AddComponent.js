import React, { useState, useEffect, useRef } from 'react';
import useCustomMove from '../../hooks/useCustomMove';
import { postAddTeam } from '../../api/teamApi';
import ResultModal from '../common/ResultModal';
import PostComponent from '../common/PostComponent';
import { getUser } from './../../api/userApi';
import { useSelector } from 'react-redux';
import iconNext from '../../resources/images/icon-next.png';
import iconEdit from '../../resources/images/iconEdit.png';
import { postCreateRoom } from '../../api/chatApi';
const initState = {
  id: 0,
  nickname: '',
  title: '',
  location: '',
  content: '',
  teamCategory: '',
  max: 2,
  current: 1,
  deadline: '',
  teamHit: 0,
  files: [],
};

const AddComponent = () => {
  const { moveToList } = useCustomMove();
  const [postImageFiles, setPostImageFiles] = useState([]); // 이미지 파일 프리뷰
  const [team, setTeam] = useState({ ...initState });
  const [result, setResult] = useState(null);
  const [addResultModal, setAddResultModal] = useState(null);
  const imgRef = useRef();
  const [location, setLocation] = useState(null); // 현재 위치를 저장할 상태
  const [user, setUser] = useState(initState);
  const loginInfo = useSelector((state) => state.loginSlice); // 전역상태에서 loginSlice는 로그인 사용자의 상태정보
  const ino = loginInfo.id;
  useEffect(() => {
    getUser(ino).then((data) => {
      setUser(data);
    });
  }, [ino]);

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

  const handleChangeTeam = (e) => {
    const { name, value } = e.target;
    setTeam((prev) => ({ ...prev, [name]: value }));
  };

  const handleGeocode = () => {
    return new Promise((resolve, reject) => {
      const { kakao } = window;
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(team.location, function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          setLocation({
            latitude: coords.getLat(),
            longitude: coords.getLng(),
          });
          resolve({
            latitude: coords.getLat(),
            longitude: coords.getLng(),
          });
        } else {
          setAddResultModal('주소 변환에 실패했습니다.');
          reject(new Error('Failed to geocode the address.'));
        }
      });
    });
  };

  const handleClickAdd = async () => {
    try {
      const { latitude, longitude } = await handleGeocode();

      if (!team.teamCategory) {
        setAddResultModal('카테고리를 선택해주세요');
        return;
      }
      if (!team.title || !team.content) {
        setAddResultModal('제목과 내용을 입력해주세요');
        return;
      }
      if (!team.deadline || !team.location) {
        setAddResultModal('마감시간과 모임장소를 입력해주세요');
        return;
      }
      const time = new Date();
      const timeElement = new Date(team.deadline);
      if (time > timeElement) {
        setAddResultModal('현재 시간보다 이전의 날짜는 설정할 수 없습니다');
        return;
      }

      const files = imgRef.current.files;
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      formData.append('id', ino);
      formData.append('nickname', user.nickname);
      formData.append('title', team.title);
      formData.append('location', team.location);
      formData.append('latitude', latitude); // 위도
      formData.append('longitude', longitude); // 경도
      formData.append('content', team.content);
      formData.append('teamCategory', team.teamCategory);
      formData.append('max', team.max);
      formData.append('current', team.current);
      formData.append('deadline', team.deadline);
      formData.append('teamHit', team.teamHit);
      const response = await postAddTeam(formData);
      const createRequest = { teamNo: response.teamNo };
      await postCreateRoom(formData.get('id'), formData.get('title'), '동네모임', createRequest);
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

  const setAddress = (address) => {
    setTeam((prev) => ({ ...prev, location: address }));
  };

  const handleInputValidation = (e) => {
    const value = e.target.value;
    if (value !== '' && (isNaN(value) || value < 2)) {
      e.target.value = Math.max(2, value);
    }
    handleChangeTeam(e);
  };

  return (
    <div>
      <div className="flex items-center w-1/2 mx-auto text-xl font-semibold pl-2 border-l-4 border-teal-300">
        동네모임 <img src={iconNext} className="w-7 mx-2" alt="Next Icon" /> 글 작성
      </div>
      <div className="grid grid-cols-8 gap-3 w-1/2 mx-auto mt-2 p-2 text-xl shadow-set mb-5">
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
        <div className="col-start-2 col-span-2">
          <label htmlFor="teamCategory" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <img src={iconEdit} className="w-3 h-3" alt="edit"></img>&nbsp;카테고리
          </label>
          <select
            id="teamCategory"
            name="teamCategory"
            className="w-full pl-2 h-9 rounded-md border border-stone-400 text-base"
            value={team.teamCategory}
            onChange={handleChangeTeam}
          >
            <option disabled hidden value="">
              카테고리 선택
            </option>
            <option value="1">운동</option>
            <option value="2">문화생활</option>
            <option value="3">반려동물</option>
            <option value="4">취미생활</option>
            <option value="5">기타</option>
          </select>
        </div>
        <div className="col-start-5 col-span-1">
          <label htmlFor="max" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <img src={iconEdit} className="w-3 h-3" alt="edit"></img>&nbsp;모집인원
          </label>
          <input
            type="number"
            name="max"
            id="max"
            value={team.max}
            min="2"
            step="1"
            onInput={handleInputValidation}
            onChange={handleChangeTeam}
            className="w-full h-9 pl-2 rounded-md border border-stone-400 text-base"
          />
        </div>
        <div className="col-start-6 col-span-2">
          <label htmlFor="deadline" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <img src={iconEdit} className="w-3 h-3" alt="edit"></img>&nbsp;모집마감시간
          </label>
          <input
            type="datetime-local"
            required
            aria-required="true"
            name="deadline"
            id="deadline"
            value={team.deadline}
            onChange={handleChangeTeam}
            className="w-full h-9 rounded-md border border-stone-400 text-base"
          />
        </div>
        <div className="col-start-2 col-span-6">
          <label htmlFor="title" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <img src={iconEdit} className="w-3 h-3" alt="edit"></img>&nbsp;제목
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={team.title}
            onChange={handleChangeTeam}
            placeholder="제목을 입력하세요"
            className="w-full h-9 pl-2 rounded-md border border-stone-400 placeholder:text-base pb-1"
          />
        </div>
        <div className="col-start-2 col-span-6">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <img src={iconEdit} className="w-3 h-3" alt="edit"></img>&nbsp;모임장소
          </label>
          <div className="flex">
            <div className="w-1/5 text-base">
              <PostComponent setAddress={setAddress}></PostComponent>
            </div>
            <div className="w-4/5 pl-1">
              <input
                className="w-full h-10 pl-2 rounded-md border border-stone-400 placeholder:text-base pb-1"
                name="addr"
                type="text"
                placeholder="주소(우편번호 및 도로명 검색)"
                value={team.location}
              />
            </div>
          </div>
        </div>
        <div className="col-start-2 col-span-6">
          <label htmlFor="content" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <img src={iconEdit} className="w-3 h-3" alt="edit"></img>&nbsp;내용
          </label>
          <textarea
            name="content"
            id="content"
            value={team.content}
            rows="6"
            onChange={handleChangeTeam}
            placeholder="내용을 입력하세요"
            className="w-full pl-2 rounded-md border border-stone-400 placeholder:text-base pb-1"
          ></textarea>
        </div>
        <div className="col-start-6 col-span-2 mb-3">
          <div className="flex">
            <button className="text-base text-white bg-mainColor p-2 rounded-md w-1/2 mr-2 hover:bg-emerald-600" onClick={handleClickAdd}>
              등록하기
            </button>
            <button className="text-base text-white bg-slate-300 p-2 rounded-md w-1/2 hover:bg-slate-400" onClick={() => moveToList()}>
              목록
            </button>
          </div>
        </div>
        {result && <ResultModal title={'알림'} content={`${result}`} callbackFn={closeModal} />}
        {addResultModal && <ResultModal title={'알림'} content={`${addResultModal}`} callbackFn={() => setAddResultModal(null)} />}
      </div>
    </div>
  );
};
export default AddComponent;
