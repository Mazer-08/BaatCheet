import React from 'react'
import Chat from './Chat';
import { useDispatch, useSelector } from 'react-redux';

export const Chatlist = () => {
    const dispatch = useDispatch();
    const chatList = useSelector(state => state.userSearch.chatList);
    const chatMode = useSelector(state => state.chatModeSelector.chatMode);
    return (
        <>
            {chatMode && chatList.map((chat, index) => {
                return <Chat key={index} chat={chat} />;
            })}
        </>
    )
};
