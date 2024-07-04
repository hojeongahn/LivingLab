import JoinComponent from '../../components/user/JoinComponent';
import BasicLayout from '../../layouts/BasicLayout';

const JoinPage = () => {
  return (
    <div className=' header-space'>
      <BasicLayout>
        <div className="flex flex-wrap mb-10 w-full h-full justify-center items-center">
          <JoinComponent />
        </div>
      </BasicLayout>
    </div>
  );
};

export default JoinPage;
