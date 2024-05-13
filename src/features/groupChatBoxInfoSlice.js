import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    groupName: "",
    groupAdminName: "",
    groupAdminId: "",
    groupMembers: [],
    groupId: "",
}

export const groupChatBoxSlice = createSlice({
    name: 'groupChatBox',
    initialState,
    reducers: {
        setGroupName: (state, action) => {
            state.groupName = action.payload;
        },
        setGroupAdminName: (state, action) => {
            state.groupAdminName = action.payload;
        },
        setGroupAdminId: (state, action) => {
            state.groupAdminId = action.payload;
        },
        setGroupMembers: (state, action) => {
            state.groupMembers = action.payload;
        },
        setGroupId: (state, action) => {
            state.groupId = action.payload;
        },
    },
})

export const { setGroupAdminId, setGroupAdminName, setGroupId, setGroupMembers, setGroupName } = groupChatBoxSlice.actions

export default groupChatBoxSlice.reducer