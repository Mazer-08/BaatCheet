import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    loginUsername: "",
    loginPW: "",
}

export const loginCredSlice = createSlice({
    name: 'loginCred',
    initialState: initialState,
    reducers:{
        setLoginUsername: (state, action)=>{
            // console.log("Slice username = ", state.loginUsername);
            state.loginUsername = action.payload;
            // console.log("Slice username = ", state.loginUsername);
        },
        setLoginPW: (state, action)=>{
            // console.log("Slice pw = ", state.loginPW);
            state.loginPW = action.payload;
            // console.log("Slice pw = ", state.loginPW);
        }
    }
})

export const { setLoginUsername, setLoginPW } = loginCredSlice.actions

export default loginCredSlice.reducer