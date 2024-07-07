//최신순, 마감임박순, 거리순, 좋아요순 선택 컴포넌트
import { useState } from 'react';

const selectList = [
    {id: 1, name: "부동산"},
    {id: 2, name: "인테리어"},
    {id: 3, name: "할인정보"},
    {id: 4, name: "기타"},
];


function SelectComponent({ onSort }){
    const [ selected, setSelected ] = useState(selectList[0].name);
    const handleSelect = (e) => {
        setSelected(e.target.value);
        onSort(e.target.value);
    };
    return(
        <div className="flex items-center mr-2">
            <select onChange={handleSelect} value={selected} className="w-24 border border-gray-300 rounded-lg bg-gray-50 text-sm py-2">
                {selectList.map((item) => (
                    <option value={item.name} key={item.id}>{item.name}</option>
                ))}
            </select>
        </div>
    );
};

export default SelectComponent;