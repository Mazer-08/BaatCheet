import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    signupName: "",
    signupUsername: "",
    signupEmail: "",
    signupPW: "",
    signupRePW: "",
    signupImg: "",
}

export const signupCredSlice = createSlice({
    name: "signupCred",
    initialState: initialState,
    reducers:{
        setSignupName: (state, action)=>{
            state.signupName = action.payload;
        },
        setSignupUsername: (state, action)=>{
            state.signupUsername = action.payload;
        },
        setSignupEmail: (state, action)=>{
            state.signupEmail = action.payload;
        },
        setSignupPW: (state, action)=>{
            state.signupPW = action.payload;
        },
        setSignupRePW: (state, action)=>{
            state.signupRePW = action.payload;
        },
        setSignupImg: (state, action)=>{
            state.signupImg = action.payload;
        }
    }
})

export const { setSignupName, setSignupUsername, setSignupEmail, setSignupPW, setSignupRePW, setSignupImg } = signupCredSlice.actions
export default signupCredSlice.reducer