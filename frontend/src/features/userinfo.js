import {createSlice} from '@reduxjs/toolkit'

const getInitialUser = () => {
    try {
        const saved = localStorage.getItem('libraryUser');
        return saved ? JSON.parse(saved) : null;
    } catch (e) {
        return null;
    }
};

const userSlice = createSlice({
    name: 'user',
    initialState: {
        value: getInitialUser()
    },
    reducers: {
        userinfo: (state, action) => {
            state.value = action.payload;
            if (action.payload) {
                localStorage.setItem('libraryUser', JSON.stringify(action.payload));
            } else {
                localStorage.removeItem('libraryUser');
            }
        }
    }
})

export const {userinfo} = userSlice.actions;
export default userSlice.reducer