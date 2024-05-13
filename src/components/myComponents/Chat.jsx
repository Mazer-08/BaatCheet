import { React, useEffect } from 'react'
import axios from 'axios'

import { Avatar } from '@chakra-ui/react'

import { useDispatch, useSelector } from 'react-redux'
import { setGroupName, setGroupId, setGroupAdminName, setGroupAdminId, setGroupMembers } from '../../features/groupChatBoxInfoSlice'
import { setChatBoxUser, setChatBoxUsername, setChatBoxUserid, setChatBoxUserpic, setChatId } from '../../features/chatboxSlice'
import { setChatMessages } from '../../features/chatMessagesSlice'
import { setChatListRefresher } from '../../features/userSearchSlice'
import { setNotification } from '../../features/socketSlice'

// import io from "socket.io-client";

// import {socket} from './ChatArea.jsx'

// const ENDPOINT = 'http://localhost:5000';
let  selectedChatCompare;

const Chat = ({chat, socket, chatBoxSelector}) => {

    //local variables
    const user = localStorage.getItem('username');
    const token = localStorage.getItem("token");

    // hooks
    const dispatch = useDispatch();

    // selectors
    const chatMessagesRefresher = useSelector((state) => state.chatMessages.chatMessagesRefresher);
    const chatList = useSelector((state) => state.userSearch.chatList);
    const chatListRefresher = useSelector((state) => state.userSearch.chatListRefresher);
    const chatMode = useSelector((state) => state.chatModeSelector.chatMode);
    const chatBoxUser = useSelector((state) => state.chatBox.chatBoxUser);
    const chatMessages = useSelector((state) => state.chatMessages.chatMessages);
    const notification = useSelector((state) => state.socket.notification);

    //functions

    // useEffect(() => {
    //     socket = io(ENDPOINT);

    //     socket.emit("setup", user);
    //     socket.on("connection", ()=>dispatch(setSocketConnected(true)));
    // },[]);

    {/*useEffect(() => {
        const renderMessages = async (chat) => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const {data} = await axios.get(`http://localhost:5000/api/message/${chat._id}`, config);
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        }
        renderMessages(chat);
    }, [chatMessagesRefresher])*/}

    const handleChatBoxSelector = async () => {
        console.log(chat);
        let fetchingId = "";
        if(chat.isGroupChat){
            dispatch(setGroupName(chat.chatName));
            dispatch(setGroupId(chat._id));
            dispatch(setGroupAdminName(chat.groupAdmin.name));
            dispatch(setGroupAdminId(chat.groupAdmin._id));
            dispatch(setGroupMembers(chat.users));
            dispatch(setChatBoxUser(""));
            dispatch(setChatBoxUsername(""));
            dispatch(setChatBoxUserid(""));
            dispatch(setChatBoxUserpic(""));
            dispatch(setChatId(""));
            fetchingId = chat._id;
        }
        else{
            dispatch(setChatBoxUser(chat.users[0].username===user ? chat.users[1].name : chat.users[0].name));
            dispatch(setChatBoxUsername(chat.users[0].username===user ? chat.users[1].username : chat.users[0].username));
            dispatch(setChatBoxUserid(chat.users[0].username===user ? chat.users[1]._id : chat.users[0]._id));
            dispatch(setChatBoxUserpic(chat.users[0].username===user ? chat.users[1].pic : chat.users[0].pic));
            dispatch(setChatId(chat._id));
            dispatch(setGroupName(""));
            dispatch(setGroupId(""));
            dispatch(setGroupAdminName(""));
            dispatch(setGroupAdminId(""));
            dispatch(setGroupMembers([]));
            fetchingId = chat._id;
        }
        try {
            selectedChatCompare = fetchingId;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const {data} = await axios.get(`http://localhost:5000/api/message/${fetchingId}`, config);
            console.log(data);
            dispatch(setChatMessages(data));
            socket.emit("join chat", fetchingId);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            // console.log("New Message Recieved", newMessageRecieved);
            if (!selectedChatCompare || selectedChatCompare !== newMessageRecieved.chat._id) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    // setFetchAgain(!fetchAgain);
                }
            } 
            else {
                dispatch(setChatMessages([...chatMessages, newMessageRecieved]));
                dispatch(setChatListRefresher(chatListRefresher));
            }
          });
    })

    

    return (
    <div onClick={handleChatBoxSelector} className='m-2 rounded-md grid grid-cols-4 bg-[#555D50] text-[#FFF5EA] max-h-[64px] overflow-hidden'>
        <div className="left ml-2 max-h-[64] col-span-1 justify-self-center content-center p-1">
            <Avatar 
                name={  chat.isGroupChat === false ? 
                            (chat.users[0].username===user ? 
                                chat.users[1].name : 
                                chat.users[0].name) : 
                        chat.chatName} 
                src={   chat.isGroupChat === false ? 
                            (chat.users[0].username===user ? 
                                chat.users[1].pic : 
                                chat.users[0].pic) : 
                        chat.chatName} 
            />
        </div>
        <div className="right ml-4 col-span-3 grid grid-rows-8">
            <div className="space"></div>
            <div className="Name max-h-[24px] row-span-3 text-md font-semibold">
                {chat.isGroupChat === false ? (chat.users[0].username===user ? chat.users[1].name : chat.users[0].name) : chat.chatName}
            </div>
            <div className="lastMsg max-h-[24px] row-span-3 text-sm font-light overflow-hidden">
                {chat.latestMessage ? chat.latestMessage.content : "Hey I joined BaatCheet!"}
            </div>
        </div>
    </div>
  )
}

export default Chat