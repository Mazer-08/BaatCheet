import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  groupChatTitle: "",
  selectedUsers: [],
}

export const groupChatSlice = createSlice({
  name: 'groupChat',
  initialState,
  reducers: {
    setGroupChatTitle: (state, action) => {
      state.groupChatTitle = action.payload;
    },
    addToSelectedUsers: (state, action) => {
      state.selectedUsers = [...state.selectedUsers, action.payload];
    },
    removeFromSelectedUsers: (state, action) => {
      state.selectedUsers = state.selectedUsers.filter(user => user.username !== action.payload.username);
    },
  },
})

export const { setGroupChatTitle, addToSelectedUsers, removeFromSelectedUsers } = groupChatSlice.actions

export default groupChatSlice.reducer