//최신순, 마감임박순, 거리순, 좋아요순 선택 컴포넌트
import { useState } from 'react';

const selectList = [
    {id: 1, name: "최신순"},
    {id: 2, name: "마감임박순"},
    {id: 3, name: "거리순"},
    {id: 4, name: "좋아요순"},
];


function SelectComponent({ onSort, email }){
    const [ selected, setSelected ] = useState(selectList[0].name);
    const handleSelect = (e) => {
        setSelected(e.target.value);
        onSort(e.target.value);
    };
    return(
        <div className="flex w-full mb-2">
            <select onChange={handleSelect} value={selected} className="text-base w-24 float-right">
                {selectList.map((item) => (
                    <option
                        key={item.id}
                        value={item.name}
                        disabled={!email && item.id === 3}
                        title={!email && item.id === 3 ? "현재 위치 설정 후 이용할 수 있어요!" : ""}
                    >
                        {item.name}
                    </option>

                ))}
            </select>
        </div>
    );
};

export default SelectComponent;