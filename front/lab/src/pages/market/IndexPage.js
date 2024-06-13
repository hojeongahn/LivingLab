import BasicLayout from '../../layouts/BasicLayout';
import { Outlet } from 'react-router-dom';

const IndexPage = () => {
  return (
    <div>
      <BasicLayout>
        <div className="text-xl p-4 flex-grow">
            <Outlet/>
        </div>
      </BasicLayout>
    </div>
  );
};

export default IndexPage;
