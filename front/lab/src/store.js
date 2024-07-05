import { configureStore } from '@reduxjs/toolkit';
import loginSlice from './slices/loginSlice';

// store는 금고 역할 (앱의 상태를 유지하기 위해 만들어짐)
// reducer는 금고 안에서 파트가 나눠짐 (금고 지기 역할)
export default configureStore({
  reducer: {
    loginSlice: loginSlice,
    //partSlice: partSlice,
  },
});
// store가 있고, slice가 있고, slice안에는 reducer가 있고
// reducer가 유지하기 위한 값이 있다.
