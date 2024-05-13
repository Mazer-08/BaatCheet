import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    search: "",
    searchResults: [],
    chatListRefresher: false,
    chatList: [],
    groupChatList: [],
    isLoading: false,
}

export const userSearchSlice = createSlice({
    name: "userSearch",
    initialState: initialState,
    reducers:{
        setSearch: (state, action)=>{
            state.search = action.payload;
        },
        setSearchResults: (state, action)=>{
            state.searchResults = action.payload;
        },
        setChatListRefresher: (state, action)=>{
            state.chatListRefresher=!action.payload;
        },
        setChatList: (state, action)=>{
            state.chatList = action.payload;
        },
        setGroupChatList: (state, action)=>{
            state.groupChatList = action.payload;
        },
        setIsLoading: (state, action)=>{
            state.isLoading = action.payload;
        },
    }
})

export const { setSearch, setSearchResults, setChatListRefresher, setChatList, setGroupChatList, setIsLoading } = userSearchSlice.actions
export default userSearchSlice.reducer