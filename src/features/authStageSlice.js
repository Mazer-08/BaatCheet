import { createSlice } from '@reduxjs/toolkit'

// (authStage == true) ? login : register 

const initialState = {
  value: true,
  text: "New user? Register Here🎯",
  authCmd: "Login",
}

export const authStageSlice = createSlice({
  name: 'authStage',
  initialState,
  reducers: {
    toggle: (state, action) => {
      state.authCmd = (state.value == true)?"Sign Up":"Sign In";
      state.text = (state.value == true)?"Already a user? Sign in":"New user? Register Here🎯";
      state.value = !state.value;
    },
  },
})

export const { toggle } = authStageSlice.actions

export default authStageSlice.reducer