import { useRef, useState, useEffect } from 'react';
import { modify, getOne, API_SERVER_HOST } from '../../api/marketApi';
import ResultModal from '../common/ResultModal';
import useCustomMove from '../../hooks/useCustomMove';
import PostComponent from '../common/PostComponent';
import iconNext from '../../resources/images/icon-next.png';
import iconEdit from '../../resources/images/iconEdit.png';

const initState = {
  user_id: '',
  nickname: '',
  title: '',
  location: '',
  content: '',
  max: 0,
  current: 0,
  deadline: '',
  marketCategory: '',
  marketHit: 0,
  files: [],
  uploadFileNames: [],
  price: 0,
};

const host = API_SERVER_HOST;

const ModifyComponent = ({ marketNo }) => {
  const [result, setResult] = useState(null);
  const [addResultModal, setAddResultModal] = useState(null);
  const [previewFiles, setPreviewFiles] = useState([]);
  const [market, setMarket] = useState({ ...initState });
  const { moveToRead } = useCustomMove();
  const uploadRef = useRef();
  const [location, setLocation] = useState(null); // 현재 위치를 저장할 상태

  useEffect(() => {
    getOne(marketNo).then((data) => {
      setMarket(data);
    });
  }, [marketNo]);

  const handleChangeMarket = (e) => {
    market[e.target.name] = e.target.value;
    setMarket({ ...market });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const nonImageFiles = files.filter((file) => !file.type.startsWith('image/'));

    if (nonImageFiles.length > 0) {
      setAddResultModal('이미지 파일만 등록 가능합니다');
      uploadRef.current.value = ''; // Clear the file input
      setPreviewFiles([]);
      return;
    }

    const imagePreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));

    setPreviewFiles(imagePreviews);
  };

  const handleClickModify = async () => {
    try {
      const { latitude, longitude } = await handleGeocode(); // 주소검색해서 등록한 주소를 좌표로 받기

      //유효성 검사
      if (!market.title || !market.content) {
        setAddResultModal('제목과 내용을 입력해주세요');
        return;
      }
      if (!market.marketCategory) {
        setAddResultModal('카테고리를 선택해주세요');
        return;
      }
      if (!market.deadline || !market.location) {
        setAddResultModal('마감시간과 거래장소를 입력해주세요');
        return;
      }
      const time = new Date();
      const timeElement = new Date(market.deadline);
      if (time > timeElement) {
        setAddResultModal('현재 시간보다 이전의 날짜는 설정할 수 없습니다');
        return;
      }

      const files = uploadRef.current.files;
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      //파일이 아닌 데이터를 formData에 추가
      formData.append('user_id', market.user_id);
      formData.append('title', market.title);
      formData.append('content', market.content);
      formData.append('marketHit', market.marketHit);
      formData.append('marketCategory', market.marketCategory);
      formData.append('nickname', market.nickname);
      formData.append('location', market.location);
      formData.append('latitude', latitude); // 위도
      formData.append('longitude', longitude); // 경도
      formData.append('max', market.max);
      formData.append('deadline', market.deadline);
      formData.append('uploadFileNames', market.uploadFileNames);
      formData.append('price', market.price);

      // for (const x of formData.entries()){
      //     console.log(x);
      // }
      await modify(marketNo, formData);
      setResult('게시글이 수정되었습니다');
    } catch (error) {
      console.error('Error Modifying post:', error);
    }
  };
  const closeModal = () => {
    setResult(null);
    moveToRead(marketNo);
  };

  // 주소검색 결과주소를 좌표로 변환해서 location에 저장
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
          setAddResultModal('Failed to geocode the address.');
          reject(new Error('Failed to geocode the address.'));
        }
      });
    });
  };

  //이미지 리스트에서 X버튼 눌렀을때
  const handleRemoveImage = (index, isPreview) => {
    if (isPreview) {
      //새로 추가된 이미지인 경우
      setPreviewFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
      updateFileInput(index); //삭제된 이미지를 입력된 파일에서도 삭제
    } else {
      //기존에 업로드된 이미지인 경우
      const newUploadFileNames = market.uploadFileNames.filter((_, i) => i !== index);
      market.uploadFileNames = newUploadFileNames;
      setMarket({ ...market });
    }
  };

  // 입력된 파일 업데이트
  const updateFileInput = (removeIndex) => {
    const dataTransfer = new DataTransfer();
    const files = Array.from(uploadRef.current.files);
    files.forEach((file, index) => {
      if (index !== removeIndex) {
        //removeIndex와 일치하지 않는 파일만 dataTransfer에 추가
        dataTransfer.items.add(file);
      }
    });
    uploadRef.current.files = dataTransfer.files; //제거된 파일 반영
  };

  const setAddress = (address) => {
    setMarket((prev) => ({ ...prev, location: address }));
  };

  const handleInputValidation = (e) => {
    const value = e.target.value;
    if (value !== '' && (isNaN(value) || value < 2)) {
      e.target.value = Math.max(2, value);
    }
    handleChangeMarket(e);
  };

  return (
    <div>
      <div className="flex items-center w-1/2 mx-auto text-xl font-semibold pl-2 border-l-4 border-teal-300">
        동네장터 <img src={iconNext} className="w-7 mx-2" alt="Next Icon" /> 글 수정
      </div>
      <div className="grid grid-cols-8 gap-3 w-1/2 mx-auto mt-2 p-2 text-xl shadow-set mb-5">
        <div className="col-start-3 col-span-4 mt-2 border rounded overflow-x-scroll whitespace-nowrap">
          {market.uploadFileNames.map((imgFile, index) => (
            <div key={index} className="relative m-3 w-36 h-36 inline-block align-top border">
              <img src={`${host}/api/market/display/${imgFile}`} alt="market" className="w-36 h-36 object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveImage(index, false)}
                className="absolute top-2 right-2 bg-slate-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-slate-600"
                aria-label="Remove image"
              >
                X
              </button>
            </div>
          ))}
          {previewFiles.map((file, index) => (
            <div key={index} className="relative m-3 w-36 h-36 inline-block align-top border">
              <img src={file.url} alt={file.name} className="w-36 h-36 object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveImage(index, true)}
                className="absolute top-2 right-2 bg-slate-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-slate-600"
                aria-label="Remove image"
              >
                X
              </button>
            </div>
          ))}
          <div className="relative inline-block m-3 w-36 h-36 border-2 border-gray-300 border-dashed rounded-md items-center justify-center cursor-pointer hover:bg-slate-100">
            <input ref={uploadRef} id="file-upload" type="file" multiple={true} onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
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
            <option value="1">구매</option>
            <option value="2">판매</option>
            <option value="3">교환</option>
            <option value="4">나눔</option>
          </select>
        </div>
        <div className="col-start-5 col-span-1">
          <label htmlFor="max" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <img src={iconEdit} className="w-3 h-3" alt="edit"></img>&nbsp;가격
          </label>
          <div className="relative">
            <input
              type="text"
              name="price"
              id="price"
              value={market.price}
              min="0"
              step="10"
              onInput={handleInputValidation}
              onChange={handleChangeMarket}
              className="w-full h-9 pl-2 rounded-md border border-stone-400 text-base"
            />
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700 text-base">원</span>
          </div>
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
            <button className="text-base text-white bg-mainColor p-2 rounded-md w-1/2 mr-2 hover:bg-emerald-600" onClick={handleClickModify}>
              등록하기
            </button>
            <button className="text-base text-white bg-slate-300 p-2 rounded-md w-1/2 hover:bg-slate-400" onClick={() => moveToRead(market.marketNo)}>
              취소하기
            </button>
          </div>
        </div>
        {result && <ResultModal title={'알림'} content={`${result}`} callbackFn={closeModal} />}
        {addResultModal && <ResultModal title={'알림'} content={`${addResultModal}`} callbackFn={() => setAddResultModal(null)} />}
      </div>
    </div>
  );
};

export default ModifyComponent;
