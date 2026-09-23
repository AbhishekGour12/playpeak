import { createSlice } from '@reduxjs/toolkit'

const attendanceSlice = createSlice({
    name: 'attendance',
    initialState: {
        value: ''
    },
    reducers: {
        attendanceinfo: (state, action) => {
            state.value = action.payload
        }
    }


})

export const { attendanceinfo } = attendanceSlice.actions;
export default attendanceSlice.reducer