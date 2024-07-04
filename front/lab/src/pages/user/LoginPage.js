import LoginComponent from '../../components/user/LoginComponent';
import BasicLayout from '../../layouts/BasicLayout';

const LoginPage = () => {
  return (
    <div className=' header-space'>
      <BasicLayout>
        <div className="flex flex-wrap mb-10 w-full h-full justify-center items-center">
          <LoginComponent />
        </div>
      </BasicLayout>
    </div>
  );
};

export default LoginPage;
