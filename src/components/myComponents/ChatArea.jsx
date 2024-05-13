import React, { useEffect } from 'react'
import axios from 'axios'

import { Input, Tooltip, useToast, useDisclosure, Button, Drawer, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody, Stack, Image, Link, Avatar, Text } from '@chakra-ui/react'
import { SettingsIcon } from '@chakra-ui/icons'
import GroupSettingsDrawer from './GroupSettingsDrawer'

import { useSelector, useDispatch } from 'react-redux'
import { setChatBoxUser, setChatBoxUsername, setChatBoxUserid, setChatBoxUserpic, setChatId } from '../../features/chatboxSlice'
import { setChatListRefresher } from '../../features/userSearchSlice'
import { setChatMessages, setMessageToSend } from '../../features/chatMessagesSlice'
import { setSocketConnected } from '../../features/socketSlice'

// import io from 'socket.io-client'

// const ENDPOINT = 'http://localhost:5000';
// export let socket;

const ChatArea = ({socket}) => {

    // local variables
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('name');
    const username = localStorage.getItem('username');


    // hooks
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const dispatch = useDispatch();

    // selectors
    const chatBoxUser = useSelector((state) => state.chatBox.chatBoxUser);
    const chatBoxUsername = useSelector((state) => state.chatBox.chatBoxUsername);
    const chatBoxUserpic = useSelector((state) => state.chatBox.chatBoxUserpic);
    const chatBoxUserid = useSelector((state) => state.chatBox.chatBoxUserid);
    const chatId = useSelector((state) => state.chatBox.chatId);
    const chatMode = useSelector((state) => state.chatModeSelector.chatMode);
    const groupName = useSelector((state) => state.groupChatBox.groupName);
    const groupId = useSelector((state) => state.groupChatBox.groupId);
    const chatListRefresher = useSelector((state) => state.userSearch.chatListRefresher);
    const chatMessages = useSelector((state) => state.chatMessages.chatMessages);
    const messageToSend = useSelector((state) => state.chatMessages.messageToSend);
    const socketConnected = useSelector((state) => state.socket.socketConnected);

    // const user = {
    //     _id: userId,
    //     username: username,
    //     name: name,
    // }

    // // functions
    // useEffect(() => {
    //     socket = io(ENDPOINT);

    //     //socket.emit("setup", user);
    //     socket.on("connection", ()=>dispatch(setSocketConnected(true)));
    // },[]);

    const handleDeleteChat = async () => {
        try {
            console.log("request made")
            const {data} = await axios.delete(`http://localhost:5000/api/chat/delete`,{
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },    
                data: {
                    "chatId": `${chatId}`,
                }
            });
            dispatch(setChatListRefresher(chatListRefresher));
            dispatch(setChatBoxUser(""));
            dispatch(setChatBoxUsername(""));
            dispatch(setChatBoxUserid(""));
            dispatch(setChatBoxUserpic(""));
            dispatch(setChatId(""));

        } catch (error) {
            console.log(error)
            toast({
                title: "Chat deletion failed",
                description: `${error}`,
                variant: "subtle",
                status: "error",
                position: "top-left",
                duration: 4000,
                isClosable: true,
                w: "100px",
            })
        }
    }

    const handleSend = async (e) => {
        if(e.key === "Enter" || e.type === "click"){    
            e.preventDefault();
            let sendChatId = "";
            if(chatMode){
                sendChatId = chatId;
            }
            else{
                sendChatId = groupId;
            }
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const body = {
                    "content": messageToSend,
                    "chatId": sendChatId,
                }
                const {data} = await axios.post(`http://localhost:5000/api/message`, body, config);
                console.log("newmsg" , data);
                socket.emit("new message", data);
                dispatch(setChatMessages([...chatMessages, data]));
                dispatch(setMessageToSend(""));
                dispatch(setChatListRefresher(chatListRefresher));
            } catch (error) {
                console.log(error);
            }
        }
    }

    const typingHandler = async () => {
        console.log("to be handled");
    }

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

    
    return (
    <>
        <div className="right col-span-3 ml-3 bg-[#111812] rounded-md">
            <div className="right-top mx-auto text-[#FFF5EA] px-6 mt-2 flex justify-between items-center">
                <div className="name">
                    {(groupName=="") && (chatBoxUser=="") ? "Select a chat" 
                        : (groupName=="") ? (`${chatBoxUser} | ${chatBoxUsername}`) :
                        `${groupName}`
                    }
                </div>
                <div className="useroptn text-black">
                    {chatMode && chatBoxUser!="" &&(
                        <Popover>
                            <PopoverTrigger>
                                <Avatar boxSize={6} name={chatBoxUser} src={chatBoxUserpic} />
                            </PopoverTrigger>
                            <PopoverContent className='overflow-hidden'>
                                {/* fix wavy bg */}
                                {/* <WavyBackground className="absolute z-10">
                                </WavyBackground> */}
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverHeader>{chatBoxUsername}</PopoverHeader>
                                <PopoverBody>
                                    <Stack className='flex justify-center items-center text-black' spacing={4}>
                                        <Image
                                            borderRadius='full'
                                            boxSize='200px'
                                            src={chatBoxUserpic}
                                            alt={chatBoxUser}
                                        />
                                        <Text>{chatBoxUser}</Text>
                                        <Link onClick={handleDeleteChat}>Delete Chat</Link>
                                    </Stack>
                                </PopoverBody>
                            </PopoverContent>
                        </Popover>
                    )}
                    {!chatMode && groupName!="" && (
                        <>
                            <Button boxSize={5} color="#111812" bgColor="#92b397" onClick={onOpen}>
                                <SettingsIcon boxSize={4}/>
                            </Button>
                            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                                <GroupSettingsDrawer/>
                            </Drawer>
                        </>
                    )}
                    
                </div>
            </div>
            <hr className="bg-[#FFF5EA] my-2" />
            <div className="right-bottom justify-between h-full max-h-[550px] relative">
                <div className="msgarea flex flex-col justify-end px-4 py-2">
                    {/* Chat messages */}
                    <div className="overflow-y-auto max-h-[480px] scrollbar-none hover:scrollbar-thin flex flex-col gap-1">
                        {/* Map through chat messages */}
                        {chatMessages.length === 0 ? 
                            <div className='text-white mx-auto text-[36px] my-auto'>
                                Start a conversation!
                            </div> :
                            chatMessages.map((message, index) => (
                                (message.sender._id === userId) ? 
                                    <Tooltip key={index} label={message.sender.username} aria-label='A tooltip'>
                                        <div className="msg flex gap-1 self-end cursor-pointer">
                                            <div className="rounded-lg w-fit px-3 py-1 bg-blue-500 text-white ">
                                                {message.content}
                                            </div>
                                        </div>
                                    </Tooltip>
                                :
                                    <div key={index} className="msg flex gap-1 self-start">
                                        <Avatar boxSize={8} name={message.sender.name} src={message.sender.pic} />
                                        <Tooltip label={message.sender.username}>
                                            <div className="rounded-lg w-fit px-3 py-1 bg-gray-200 text-gray-800">
                                                {message.content}
                                            </div>
                                        </Tooltip>
                                    </div>
                            ))
                        }
                    </div>
                </div>
                {/* Bottom-fixed input */}
                <form onKeyDown={handleSend} className="sendmsg absolute bottom-0 left-0 right-0 px-4 py-1 flex items-center">
                    <Input
                        type="text"
                        placeholder="Type your message..."
                        value={messageToSend}
                        onChange={(e) => {dispatch(setMessageToSend(e.target.value)); typingHandler();}}
                        className="w-full text-white px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                    />
                    <Button onClick={handleSend} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500">
                        Send
                    </Button>
                </form>
            </div>  
        </div>
    </>
  )
}

export default ChatArea