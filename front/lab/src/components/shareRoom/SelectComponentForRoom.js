//최신순, 마감임박순, 거리순, 좋아요순 선택 컴포넌트
import { useState } from 'react';

const selectList = [
  { id: 1, name: '최신순' },
  { id: 2, name: '낮은가격순' },
  { id: 3, name: '좋아요순' }
];

function SelectComponent({ onSort }) {
  const [selected, setSelected] = useState(selectList[0].name);
  const handleSelect = (e) => {
    setSelected(e.target.value);
    onSort(e.target.value);
  };

  return (
    <div className="flex w-full">
      <select onChange={handleSelect} value={selected} className="text-base w-[110px] float-right border ml-12">
        {selectList.map((item) => (
          <option value={item.name} key={item.id} >{item.name}</option>
        ))}
      </select>
    </div>
  );
}

export default SelectComponent;
