import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  chatMode: true,
  text: "New Chat👤",
}

export const chatModeSlice = createSlice({
  name: 'chatModeSelector',
  initialState,
  reducers: {
    setChatMode: (state, action) => {
      state.text = "New Chat👤";
      state.chatMode = true;
    },
    setGroupMode: (state, action) => {
      state.text = "New Group👥";
      state.chatMode = false;
    },
  },
})

export const { setChatMode, setGroupMode } = chatModeSlice.actions

export default chatModeSlice.reducer