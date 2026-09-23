import { configureStore } from "@reduxjs/toolkit";
import userSlice from '../features/userinfo.js';
import attendanceSlice from '../features/attendance.js';

export const Store = configureStore({
    reducer:{
        user: userSlice,
        attendance: attendanceSlice
   
    }
})