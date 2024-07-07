import { useRef, useState, useEffect } from 'react';
import { modify, getOne, API_SERVER_HOST } from '../../api/buyApi';
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
  buyCategory: '',
  buyHit: 0,
  files: [],
  uploadFileNames: [],
};

const host = API_SERVER_HOST;

const ModifyComponent = ({ buyNo }) => {
  const [result, setResult] = useState(null);
  const [addResultModal, setAddResultModal] = useState(null);
  const [previewFiles, setPreviewFiles] = useState([]);
  const [buy, setBuy] = useState({ ...initState });
  const { moveToRead } = useCustomMove();
  const uploadRef = useRef();

  const [location, setLocation] = useState(null); // 현재 위치를 저장할 상태

  useEffect(() => {
    getOne(buyNo).then((data) => {
      setBuy(data);
    });
  }, [buyNo]);

  const handleChangeBuy = (e) => {
    setBuy((prevBuy) => ({
      ...prevBuy,
      [e.target.name]: e.target.value,
    }));
  };

  // 이미지 변경
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

  // 수정하기 버튼
  const handleClickModify = async () => {
    try {
      const { latitude, longitude } = await handleGeocode(); // 주소검색해서 등록한 주소를 좌표로 받기

      //유효성 검사
      if (!buy.title || !buy.content) {
        setAddResultModal('제목과 내용을 입력해주세요');
        return;
      }
      if (!buy.buyCategory) {
        setAddResultModal('카테고리를 선택해주세요');
        return;
      }
      if (!buy.deadline || !buy.location) {
        setAddResultModal('마감시간과 거래장소를 입력해주세요');
        return;
      }
      const time = new Date();
      const timeElement = new Date(buy.deadline);
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
      formData.append('user_id', buy.user_id);
      formData.append('title', buy.title);
      formData.append('content', buy.content);
      formData.append('buyHit', buy.buyHit);
      formData.append('buyCategory', buy.buyCategory);
      formData.append('nickname', buy.nickname);
      formData.append('location', buy.location);
      formData.append('latitude', latitude); // 위도
      formData.append('longitude', longitude); // 경도
      formData.append('max', buy.max);
      formData.append('deadline', buy.deadline);
      formData.append('uploadFileNames', buy.uploadFileNames);

      const result = await modify(buyNo, formData);
      if (result) {
        setResult('게시글이 수정되었습니다.');
      } else {
        setAddResultModal('모집인원은 현재 인원수보다 적게 수정할 수 없습니다.');
      }
    } catch (error) {
      console.error('Error Modifying post:', error);
    }
  };

  const closeModal = () => {
    setResult(null);
    moveToRead(buyNo);
  };

  // 주소검색 결과주소를 좌표로 변환해서 location에 저장
  const handleGeocode = () => {
    return new Promise((resolve, reject) => {
      const { kakao } = window;
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(buy.location, function (result, status) {
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
      const newUploadFileNames = buy.uploadFileNames.filter((_, i) => i !== index);
      setBuy((prevBuy) => ({
        ...prevBuy,
        uploadFileNames: newUploadFileNames,
      }));
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
    setBuy((prevBuy) => ({
      ...prevBuy,
      location: address,
    }));
  };

  const handleInputValidation = (e) => {
    const value = e.target.value;
    if (value !== '' && (isNaN(value) || value < 2)) {
      e.target.value = Math.max(2, value);
    }
    handleChangeBuy(e);
  };

  return (
    <div>
      <div className="flex items-center w-1/2 mx-auto text-xl font-semibold pl-2 border-l-4 border-teal-300">
        공동구매 <img src={iconNext} className="w-7 mx-2" alt="Next Icon" /> 글 수정
      </div>
      <div className="grid grid-cols-8 gap-3 w-1/2 mx-auto mt-2 p-2 text-xl shadow-set mb-5">
        <div className="col-start-3 col-span-4 mt-2 border rounded overflow-x-scroll whitespace-nowrap">
          {buy.uploadFileNames.map((imgFile, index) => (
            <div key={index} className="relative m-3 w-36 h-36 inline-block align-top border">
              <img src={`${host}/api/buy/display/${imgFile}`} alt="buy" className="w-36 h-36 object-cover" />
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
          <label htmlFor="buyCategory" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <img src={iconEdit} className="w-3 h-3" alt="edit"></img>&nbsp;카테고리
          </label>
          <select id="buyCategory" name="buyCategory" className="w-full pl-2 h-9 rounded-md border border-stone-400 text-base" value={buy.buyCategory} onChange={handleChangeBuy}>
            <option value="1">배달음식</option>
            <option value="2">생필품</option>
            <option value="3">식료품</option>
            <option value="4">가구/가전</option>
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
            value={buy.max}
            min="2"
            step="1"
            onInput={handleInputValidation}
            onChange={handleChangeBuy}
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
            value={buy.deadline}
            onChange={handleChangeBuy}
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
            value={buy.title}
            onChange={handleChangeBuy}
            placeholder="제목을 입력하세요"
            className="w-full h-9 pl-2 rounded-md border border-stone-400 placeholder:text-base pb-1"
          />
        </div>
        <div className="col-start-2 col-span-6">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <img src={iconEdit} className="w-3 h-3" alt="edit"></img>&nbsp;거래장소
          </label>
          <div className="w-1/5 ml-1 text-base">
            <PostComponent setAddress={setAddress}></PostComponent>
          </div>
          <div className="flex">
            <div className="w-4/5 pl-1">
              <input
                className="w-full h-10 pl-2 rounded-md border border-stone-400 placeholder:text-base pb-1"
                name="addr"
                type="text"
                placeholder="주소(우편번호 및 도로명 검색)"
                value={buy.location}
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
            value={buy.content}
            rows="6"
            onChange={handleChangeBuy}
            placeholder="내용을 입력하세요"
            className="w-full pl-2 rounded-md border border-stone-400 placeholder:text-base pb-1"
          ></textarea>
        </div>
        <div className="col-start-6 col-span-2 mb-3">
          <div className="flex">
            <button className="text-base text-white bg-mainColor p-2 rounded-md w-1/2 mr-2 hover:bg-emerald-600" onClick={handleClickModify}>
              등록하기
            </button>
            <button className="text-base text-white bg-slate-300 p-2 rounded-md w-1/2 hover:bg-slate-400" onClick={() => moveToRead(buy.buyNo)}>
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
