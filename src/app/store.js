import { configureStore } from "@reduxjs/toolkit"
import authStageReducer from "../features/authStageSlice"
import loginCredReducer from "../features/loginCredSlice"
import signupCredReducer from "../features/signupCredSlice";
import chatModeReducer from "../features/chatModeSlice";
import userSearchReducer from "../features/userSearchSlice";
import groupChatReducer from "../features/groupChatSlice";
import chatBoxReducer from "../features/chatboxSlice";
import groupChatBoxReducer from "../features/groupChatBoxInfoSlice";
import chatMessagesReducer from "../features/chatMessagesSlice";
import socketReducer from "../features/socketSlice";

export const store = configureStore({
    reducer: {
        authStage: authStageReducer,
        loginCred: loginCredReducer,
        signupCred: signupCredReducer,
        chatModeSelector: chatModeReducer,
        userSearch: userSearchReducer,
        groupChat: groupChatReducer,
        chatBox: chatBoxReducer,
        groupChatBox: groupChatBoxReducer,
        chatMessages: chatMessagesReducer,
        socket: socketReducer,
    },
});