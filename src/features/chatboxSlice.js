import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    chatBoxUser: "",
    chatBoxUsername: "",
    chatBoxUserpic: "",
    chatBoxUserid: "",
    chatId: "",
}

export const chatBoxSlice = createSlice({
    name: 'chatBox',
    initialState,
    reducers: {
        setChatBoxUser: (state, action) => {
            state.chatBoxUser = action.payload;
        },
        setChatBoxUsername: (state, action) => {
            state.chatBoxUsername = action.payload;
        },
        setChatBoxUserpic: (state, action) => {
            state.chatBoxUserpic = action.payload;
        },
        setChatBoxUserid: (state, action) => {
            state.chatBoxUserid = action.payload;
        },
        setChatId: (state, action) => {
            state.chatId = action.payload;
        },
    },
})

export const { setChatBoxUser, setChatBoxUsername, setChatBoxUserpic, setChatBoxUserid, setChatId } = chatBoxSlice.actions

export default chatBoxSlice.reducer