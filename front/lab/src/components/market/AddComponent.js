import React, { useState, useEffect, useRef } from 'react';
import useCustomMove from '../../hooks/useCustomMove';
import { postAddMarket } from '../../api/marketApi';
import ResultModal from '../common/ResultModal';
import PostComponent from '../common/PostComponent';
import { getUser } from './../../api/userApi';
import { useSelector } from 'react-redux';
import iconNext from '../../resources/images/icon-next.png';
import iconEdit from '../../resources/images/iconEdit.png';

const initState = {
  id: 0,
  nickname: '',
  title: '',
  location: '',
  content: '',
  marketCategory: '',
  deadline: '',
  marketHit: '0',
  price: 0,
  files: [],
};

const AddComponent = () => {
  const { moveToList } = useCustomMove();
  const [postImageFiles, setPostImageFiles] = useState([]); // 이미지 파일 프리뷰
  const [market, setMarket] = useState({ ...initState });
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

  const handleGeocode = () => {
    return new Promise((resolve, reject) => {
      const { kakao } = window;
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(market.location, function (result, status) {
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

  const handleChangeMarket = (e) => {
    const { name, value } = e.target;
    setMarket((prev) => ({ ...prev, [name]: value }));
  };

  const handleClickAdd = async () => {
    try {
      const { latitude, longitude } = await handleGeocode();

      if (!market.marketCategory) {
        setAddResultModal('카테고리를 선택해주세요');
        return;
      }
      if (!market.title || !market.content) {
        setAddResultModal('제목과 내용을 입력해주세요');
        return;
      }
      if (!market.deadline || !market.location) {
        setAddResultModal('마감시간과 거래장소를 입력해주세요');
        return;
      }
      const time = new Date();
      const timeElement = new Date(market.deadline);
      console.log('time:', time);
      console.log('timeElement:', timeElement);
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
      formData.append('title', market.title);
      formData.append('location', market.location);
      formData.append('latitude', latitude); // 위도
      formData.append('longitude', longitude); // 경도
      formData.append('content', market.content);
      formData.append('marketCategory', market.marketCategory);
      formData.append('deadline', market.deadline);
      formData.append('marketHit', market.marketHit);
      formData.append('price', market.price);

      postAddMarket(formData);
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
    setMarket((prev) => ({ ...prev, location: address }));
  };

  const handleInputValidation = (e) => {
    const value = e.target.value;
    if (value !== '' && (isNaN(value) || value < 0)) {
      e.target.value = Math.max(0, value);
    }
    handleChangeMarket(e);
  };

  return (
    <div>
      <div className="flex items-center w-1/2 mx-auto text-xl font-semibold pl-2 border-l-4 border-teal-300">
        동네장터 <img src={iconNext} className="w-7 mx-2" alt="Next Icon" /> 글 작성
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
          <label htmlFor="marketCategory" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <img src={iconEdit} className="w-3 h-3" alt="edit"></img>&nbsp;카테고리
          </label>
          <select
            id="marketCategory"
            name="marketCategory"
            className="w-full pl-2 h-9 rounded-md border border-stone-400 text-base"
            value={market.marketCategory}
            onChange={handleChangeMarket}
          >
            <option disabled hidden value="">
              카테고리 선택
            </option>
            <option value="1">구매</option>
            <option value="2">판매</option>
            <option value="3">교환</option>
            <option value="4">나눔</option>
          </select>
        </div>
        {market.marketCategory !== "3" && market.marketCategory !== "4" && (
          <div className="col-start-5 col-span-1 relative">
            <label htmlFor="price" className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <img src={iconEdit} className="w-3 h-3" alt="edit"></img>&nbsp;가격
            </label>
            <div className="relative">
              <input type="number" name="price" id="price" value={market.price} min="0" step="10" onInput={handleInputValidation}
              onChange={handleChangeMarket} className="w-full h-9 pl-2 rounded-md border border-stone-400 text-base"/>
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700 text-base">원</span>
            </div>
          </div>
        )}
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
            value={market.deadline}
            onChange={handleChangeMarket}
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
            value={market.title}
            onChange={handleChangeMarket}
            placeholder="제목을 입력하세요"
            className="w-full h-9 pl-2 rounded-md border border-stone-400 placeholder:text-base pb-1"
          />
        </div>
        <div className="col-start-2 col-span-6">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <img src={iconEdit} className="w-3 h-3" alt="edit"></img>&nbsp;거래장소
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
                value={market.location}
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
            value={market.content}
            rows="6"
            onChange={handleChangeMarket}
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
