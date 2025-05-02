import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import jobsReducer from './slices/jobsSlice';
import companiesReducer from './slices/companiesSlice';
import userJobsReducer from './slices/userJobsSlice';
import resumesReducer from './slices/resumesSlice';

// 创建Redux存储
const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
    companies: companiesReducer,
    userJobs: userJobsReducer,
    resumes: resumesReducer,
  },
  // 开发环境启用devTools
  devTools: process.env.NODE_ENV !== 'production',
});

// 导出RootState和AppDispatch类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;