import { React, useEffect } from 'react'
import axios from 'axios'

import { useToast } from '@chakra-ui/react'
import Chat from './Chat'

import { useDispatch, useSelector } from 'react-redux'
import { setChatList, setChatListRefresher } from '../../features/userSearchSlice'
import { setChatMode, setGroupMode } from '../../features/chatModeSlice'
import { setChatBoxUser, setChatBoxUsername, setChatBoxUserid, setChatBoxUserpic, setChatId } from '../../features/chatboxSlice'
import { setGroupName, setGroupId, setGroupAdminName, setGroupAdminId, setGroupMembers } from '../../features/groupChatBoxInfoSlice'
import { setChatMessages } from '../../features/chatMessagesSlice'


const ChatsDisplay = ({socket}) => {

    //local variables
    const user = localStorage.getItem('username');
    const token = localStorage.getItem("token");

    // hooks
    const dispatch = useDispatch();
    const toast = useToast();

    // selectors
    const chatList = useSelector((state) => state.userSearch.chatList);
    const chatListRefresher = useSelector((state) => state.userSearch.chatListRefresher);
    const chatMode = useSelector((state) => state.chatModeSelector.chatMode);
    const chatBoxUser = useSelector((state) => state.chatBox.chatBoxUser);
 
    // functions
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                if(chatMode){
                    const {data} = await axios.get("http://localhost:5000/api/chat", config);
                    dispatch(setChatList(data));
                    // console.log(data);
                }
                else{
                    const {data} = await axios.get("http://localhost:5000/api/chat/group", config);
                    dispatch(setChatList(data));
                    // console.log(data);
                }
            } 
            catch (error) {
                toast({
                    title: "User not found",
                    description: `${error}`,
                    variant: "subtle",
                    status: "error",
                    position: "top-left",
                    duration: 4000,
                    isClosable: true,
                    w: "100px",
                });
                return;
            }
        };
        fetchChats();
    }, [chatListRefresher]);

    const setToChat = () => {
        dispatch(setChatMode());
        dispatch(setChatListRefresher(chatListRefresher));
        {/*dispatch(setChatBoxUser(""));
        dispatch(setChatBoxUsername(""));
        dispatch(setChatBoxUserid(""));
        dispatch(setChatBoxUserpic(""));
    dispatch(setGroupName(""));*/}
    };

    const setToGroup = () => {
        dispatch(setGroupMode());
        dispatch(setChatListRefresher(chatListRefresher));
        {/*dispatch(setChatBoxUser(""));
        dispatch(setChatBoxUsername(""));
        dispatch(setChatBoxUserid(""));
    dispatch(setChatBoxUserpic(""));*/}
    };

    const chatBoxSelectorHandler = (chat) => {
        return () => {
            console.log(chat);
            if(chat.isGroupChat){
                dispatch(setGroupName(chat.chatName));
                dispatch(setGroupId(chat._id));
                dispatch(setGroupAdminName(chat.groupAdmin.name));
                dispatch(setGroupAdminId(chat.groupAdmin._id));
                dispatch(setGroupMembers(chat.users));
            }
            else{
                dispatch(setChatBoxUser(chat.users[0].username===user ? chat.users[1].name : chat.users[0].name));
                dispatch(setChatBoxUsername(chat.users[0].username===user ? chat.users[1].username : chat.users[0].username));
                dispatch(setChatBoxUserid(chat.users[0].username===user ? chat.users[1]._id : chat.users[0]._id));
                dispatch(setChatBoxUserpic(chat.users[0].username===user ? chat.users[1].pic : chat.users[0].pic));
                dispatch(setChatId(chat._id));
            }  
        }
    }

    return (
    <>
        <div className="left col-span-1 bg-[#111812] rounded-md">
            <div className="left-top grid grid-cols-2 justify-center pt-2 text-[#FFF5EA] font-semibold">
                <div
                    onClick={setToChat}
                    className="left-top-left text-center hover:cursor-pointer"
                >
                    Chat
                </div>
                <div
                    onClick={setToGroup}
                    className="left-top-right text-center hover:cursor-pointer"
                >
                    Groups
                </div>
            </div>
            <hr className="bg-[#FFF5EA] my-2" />
            <div className="left-bottom max-h-[550px] overflow-y-auto scrollbar-none hover:scrollbar-thin">
                {
                    chatList.map((chat, index) => {
                        return <Chat key={index} chat={chat} socket={socket} chatBoxSelector={chatBoxSelectorHandler(chat)}/>;
                    })
                }
            </div>
          </div>
    </>
  )
}

export default ChatsDisplay