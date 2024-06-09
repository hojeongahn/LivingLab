import image from '../../resources/images/room.jpg';
import React,{ useEffect, useState } from "react"
import { getOne,deleteOne } from "../../api/shareRoomApi"
import useCustomMove from "../../hooks/useCustomMove"

const initState = {
    roomNo: 0,
    title: '',
    rentFee: 0,
    parking: '',
    option1: '',
    location: ''
}



const ReadComponent = ({roomNo}) => {
    const [shareRoom, setShareRoom] = useState(initState)
    const { moveToModify,moveToList } = useCustomMove()
    const [result, setResult] = useState(null)

    useEffect(() => {
        getOne(roomNo).then(data => {
            console.log(data)
            setShareRoom(data)
        })
    }, [roomNo])
    
    const handleClickDelete = () => {
    
        deleteOne(roomNo).then(result => {
        console.log("delete result : " +result)
        setResult('Deleted')
        moveToList()
        })
    }

    return(
        <div class="flex flex-col w-3/4 gap-5 p-2 mx-auto bg-white shadow-lg select-none sm:p-4 sm:h-96 rounded-2xl sm:flex-row ">            
            <img alt="..." src={image} class="h-52 sm:h-80 sm:w-72 rounded-xl"/>            
            <div class="flex flex-col flex-1 gap-5 sm:p-2">
                <div class="flex flex-col flex-1 gap-5">
                    <div class="w-full bg-gray-200 h-10 rounded-2xl flex items-center justify-center">{shareRoom.title}
                    </div>
                    <div class="w-full h-52 bg-gray-200 rounded-2xl px-4">
                        <div class="flow-root">
                            <dl class="-my-3 divide-y divide-gray-100 text-sm">
                                <div class="pt-6 pb-3 pl-2 flex">
                                    <div class="font-bold text-gray-900 flex-none text-lg">월세</div>
                                    <div class="grow"></div>
                                    <div class="text-gray-700 sm:col-span-2 flex-none">{shareRoom.rentFee}</div>
                                </div>
                                <div class="py-3 pl-2 flex">
                                    <div class="font-bold text-gray-900 flex-none text-lg">주차</div>
                                    <div class="grow"></div>
                                    <div class="text-gray-700 sm:col-span-2 flex-none">{shareRoom.parking}</div>
                                </div>
                                <div class="py-3 pl-2 flex">
                                    <div class="font-bold text-gray-900 flex-none text-lg">옵션</div>
                                    <div class="grow"></div>
                                    <div class="text-gray-700 sm:col-span-2 flex-none">{shareRoom.option1}</div>
                                </div>
                                <div class="py-3 pl-2 flex">
                                    <div class="font-bold text-gray-900 flex-none text-lg">위치</div>
                                    <div class="grow"></div>
                                    <div class="text-gray-700 sm:col-span-2 flex-none">{shareRoom.location}</div>
                                </div>
                            </dl>
                        </div>
                    </div>            
                    <div class="flex gap-3 mt-auto">
                        <div class="w-20 h-8 ml-auto bg-gray-200 rounded-full">
                            문의하기
                        </div>
                    </div>
                    <div className="flex justify-end p-4">
                        <button type="button" className="rounded p-4 m-2 text-xl w-32 text-white bg-gray-400" onClick={() => moveToModify(roomNo)}>
                            Modify
                        </button>
                        <button type="button" className="rounded p-4 m-2 text-xl w-32 text-white bg-red-400" onClick={handleClickDelete}>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>  
    );
}

export default ReadComponent;