import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    socketConnected: false,
    notification: [],
}

export const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        setSocketConnected: (state, action) => {
            state.socketConnected = action.payload;
        },
        setNotification: (state, action) => {
            state.notification = action.payload;
        },
    },
})

export const { setSocketConnected, setNotification } = socketSlice.actions

export default socketSlice.reducer