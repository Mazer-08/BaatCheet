import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  chatMessages: [],
  chatMessagesRefresher: false,
  messageToSend: "",
}

export const chatMessagesSlice = createSlice({
  name: 'chatMessages',
  initialState,
  reducers: {
    setChatMessages: (state, action) => {
      state.chatMessages = action.payload
    },
    setChatMessagesRefresher: (state, action) => {
      state.chatMessagesRefresher = !action.payload
    },
    setMessageToSend: (state, action) => {
      state.messageToSend = action.payload
    },
  },
})

export const { setChatMessages, setMessageToSend } = chatMessagesSlice.actions

export default chatMessagesSlice.reducer