import { useRef, useState, useEffect } from "react";
import { modifyHelp, getOneHelp, API_SERVER_HOST } from "../../../api/communityApi";
import ResultModal from "../../common/ResultModal";
import useCustomHelp from "../../../hooks/useCustomHelp";

const initState = {
    user_id: 'iamuser',
    type: '4', //도움요청 게시판은 4
    title: '',
    content: '',
    commHit: 0,
    commCategory: '1',
    nickname: '김유저',
    files: [],
    uploadFileNames: []
};

const host = API_SERVER_HOST;

const ModifyComponent = ({commNo}) => {
    const [result, setResult] = useState(null);
    const [addResultModal, setAddResultModal] = useState(null);
    const [previewFiles, setPreviewFiles] = useState([]);
    const [ help, setHelp ] = useState({...initState});
    const { moveToRead } = useCustomHelp();
    const uploadRef = useRef();

    useEffect(() => {
        getOneHelp(commNo).then(data => {
            setHelp(data)
        })
    }, [commNo])

    const handleChangeHelp = (e) => {
        help[e.target.name] = e.target.value;
        setHelp({...help});
    }

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const nonImageFiles = files.filter(file => !file.type.startsWith('image/'));

        if (nonImageFiles.length > 0) {
            setAddResultModal("이미지 파일만 등록 가능합니다");
            uploadRef.current.value = ""; // Clear the file input
            setPreviewFiles([]);
            return;
        }

        const imagePreviews = files.map(file => ({
            url: URL.createObjectURL(file),
            name: file.name
        }));

        setPreviewFiles(imagePreviews);
    }

    const handleClickModify = (e) => {
        //유효성 검사
        if (!help.title || !help.content){
            setAddResultModal("제목과 내용을 입력해주세요");
            return;
        }
        const files = uploadRef.current.files;
        const formData = new FormData();
        for(let i=0; i<files.length; i++){
            formData.append("files",files[i]);
        }
        //파일이 아닌 데이터를 formData에 추가
        formData.append("user_id", help.user_id);
        formData.append("type",help.type);
        formData.append("title", help.title);
        formData.append("content", help.content);
        formData.append("commHit", help.commHit);
        formData.append("commCategory",help.commCategory);
        formData.append("nickname", help.nickname);
        formData.append("uploadFileNames", help.uploadFileNames);

        // for (const x of formData.entries()){
        //     console.log(x);
        // }
        modifyHelp(commNo,formData);
        setResult("게시글이 수정되었습니다");
    }
    const closeModal = () => {
        setResult(null);
        moveToRead(commNo);
    }

    //이미지 리스트에서 X버튼 눌렀을때
    const handleRemoveImage = (index, isPreview) => {
        if (isPreview) { //새로 추가된 이미지인 경우
            setPreviewFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
            updateFileInput(index); //삭제된 이미지를 입력된 파일에서도 삭제
        } else { //기존에 업로드된 이미지인 경우
            const newUploadFileNames = help.uploadFileNames.filter((_, i) => i !== index);
            help.uploadFileNames = newUploadFileNames;
            setHelp({ ...help});
        }
    };

    // 입력된 파일 업데이트
    const updateFileInput = (removeIndex) => {
        const dataTransfer = new DataTransfer();
        const files = Array.from(uploadRef.current.files);
        files.forEach((file, index) => {
            if (index !== removeIndex) { //removeIndex와 일치하지 않는 파일만 dataTransfer에 추가
                dataTransfer.items.add(file);
            }
        });
        uploadRef.current.files = dataTransfer.files; //제거된 파일 반영
    };

    return (
        <div>
            <div className="space-y-12 text-base">
                <div className="border-b border-gray-900/10 pb-12">
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        {result ? <ResultModal title={'알림'} content={`${result}`} callbackFn={closeModal} /> : <></>}
                        {addResultModal ? (
                            <ResultModal title={'알림'} content={`${addResultModal}`} callbackFn={() => setAddResultModal(null)} />
                        ) : <></>}
                        <div className="col-span-full">
                            <label htmlFor="title" className="block font-medium leading-6 text-gray-900">제목</label>
                            <div className="mt-2">
                                <input type={'text'} name="title" id="title" value={help.title} onChange={handleChangeHelp} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600" />
                            </div>
                        </div>
                        <div className="col-span-full">
                            <label htmlFor="content" className="block font-medium leading-6 text-gray-900">내용</label>
                            <div className="mt-2">
                                <textarea id="content" name="content" value={help.content} onChange={handleChangeHelp} rows="6"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600">
                                    {help.content}
                                </textarea>
                            </div>
                        </div>
                        <div className="col-span-full">
                            <div className="flex flex-wrap items-start">
                                {help.uploadFileNames.map((imgFile, index) =>
                                    <div key={index} className="relative inline-block">
                                        <img alt="help" src={`${host}/api/community/help/display/${imgFile}`} className="my-3 mx-1 w-36 h-36 object-cover" />
                                        <button type="button"
                                            onClick={() => handleRemoveImage(index, false)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                            aria-label="Remove image">
                                            X
                                        </button>
                                    </div>
                                )}
                                {previewFiles.map((file, index) => (
                                    <div key={index} className="relative inline-block">
                                        <img src={file.url} alt={file.name} className="my-3 mx-1 w-36 h-36 object-cover" />
                                        <button type="button"
                                            onClick={() => handleRemoveImage(index, true)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                            aria-label="Remove image">
                                            X
                                        </button>
                                    </div>
                                ))}
                                <div className="relative inline-block my-3 mx-1 w-36 h-36 border-2 border-gray-300 border-dashed rounded-md items-center justify-center cursor-pointer">
                                    <input ref={uploadRef} id="file-upload" type={'file'} multiple={true} onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    <label htmlFor="file-upload" className="text-gray-500 text-4xl flex items-center justify-center h-full w-full">
                                        +
                                    </label>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={() => moveToRead(help.commNo)}>취소하기</button>
                <button type="button" className="rounded-md bg-mainColor px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={handleClickModify}>수정하기</button>
            </div>
        </div>
    );
}

export default ModifyComponent;