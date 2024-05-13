import { React, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { BellIcon, AddIcon } from '@chakra-ui/icons'
import { Input, Button, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure, Stack, Box, FormLabel, Avatar, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody, Link, Popover, useToast, Image, Skeleton } from '@chakra-ui/react'
import Chat from '../components/myComponents/Chat'
import { WavyBackground } from '../components/ui/wavy-background';
import SearchEntry from '../components/myComponents/SearchEntry';
import SelectedUser from '../components/myComponents/SelectedUser';

// redux
import { useSelector, useDispatch } from 'react-redux'
import { setChatMode, setGroupMode } from '../features/chatModeSlice'
import { setSearch, setSearchResults, setChatListRefresher, setChatList, setGroupChatList, setIsLoading } from '../features/userSearchSlice';
import { setGroupChatTitle, removeFromSelectedUsers, addToSelectedUsers } from '../features/groupChatSlice';
import SingleChatDrawer from '../components/myComponents/SingleChatDrawer';
import GroupChatDrawer from '../components/myComponents/GroupChatDrawer';
import { Chatlist } from '../components/myComponents/Chatlist';
import Navbar from '../components/myComponents/Navbar';
import ChatsDisplay from '../components/myComponents/ChatsDisplay';
import ChatArea from '../components/myComponents/ChatArea';

import io from 'socket.io-client'

const ENDPOINT = 'http://localhost:5000';
export let socket;


const ChatPage = () => {
    
    // initial check for token
    // const token = localStorage.getItem("token");
    // useEffect(() => {
    //     const token = localStorage.getItem("token");
    //     if (!token) {
    //         toast({
    //             title: "Login to continue",
    //             variant: "subtle",
    //             status: "info",
    //             duration: 4000,
    //             isClosable: true,
    //             w: "100px",
    //         });
    //         navigate("/");
    //     }
    // }, []);

    // getting logged in user info
    // const userId = localStorage.getItem("userId");
    // const name = localStorage.getItem("name");
    // const pic = localStorage.getItem("pic");

	// local variables
	// const user = localStorage.getItem('username');
	const token = localStorage.getItem("token");
	const username = localStorage.getItem("username");
	const userId = localStorage.getItem("userId");
	const name = localStorage.getItem("name");


    const user = {
		_id: userId,
		username: username,
		name: name,
  	};

	const toast = useToast();
	const navigate = useNavigate();

   // functions
   	useEffect(() => {
		socket = io(ENDPOINT);

		socket.emit("setup", user);
		socket.on("connection", ()=>dispatch(setSocketConnected(true)));
	},[]);

	


    // user search variables
    const search = useSelector((state) => state.userSearch.search);
    const searchResults = useSelector((state) => state.userSearch.searchResults);
    const chatListRefresher = useSelector((state) => state.userSearch.chatListRefresher);
    const chatList = useSelector((state) => state.userSearch.chatList);
    const isLoading = useSelector((state) => state.userSearch.isLoading);
    const groupChatList = useSelector((state) => state.userSearch.groupChatList);

    // group chat variables
    const selectedUsers = useSelector((state) => state.groupChat.selectedUsers);
    const groupChatTitle = useSelector((state) => state.groupChat.groupChatTitle);

    // function to create group
    const handleCreateGroup = async () => {
        // if(selectedUsers.length < 2){
        //     toast({
        //         title: "Select atleast 2 users",
        //         variant: "subtle",
        //         status: "warning",
        //         position: "top-left",
        //         duration: 4000,
        //         isClosable: true,
        //         w: "100px",
        //       });
        //       return;
        // }
        // try {
        //     let useridList = [];
        //     let name = groupChatTitle;
        //     selectedUsers.map((user) => {
        //         useridList.push(user._id);
        //     });
        //     const body = {
        //       "name": name,
        //       "users": JSON.stringify(selectedUsers.map((user) => user._id)),
        //     }
        //     console.log(body);
        //     const config = {
        //         headers: {
        //             "Content-Type": "application/json",
        //             Authorization: `Bearer ${token}`,
        //         },
        //     };
        //     const {data} = await axios.post("http://localhost:5000/api/chat/group", body, config);
        //     console.log("Group Created");
        //     console.log(data);
        //     // console.log(data._id);
        // } catch (error) {
        //     toast({
        //         title: "User not found",
        //         description: `${error}`,
        //         variant: "subtle",
        //         status: "error",
        //         position: "top-left",
        //         duration: 4000,
        //         isClosable: true,
        //         w: "100px",
        //       });
        //       console.log(error);
        //       return;
        // }
    };

    // function to handle user search
    // const handleUserSearch = async() => {
    //     // if(!search){
    //     //     // toast({
    //     //     //     title: "Enter a username",
    //     //     //     variant: "subtle",
    //     //     //     status: "warning",
    //     //     //     position: "top-left",
    //     //     //     duration: 4000,
    //     //     //     isClosable: true,
    //     //     //     w: "100px",
    //     //     //   });
    //     //     //   return;
    //     // }
    //     // else{
    //     //     try {
                
    //     //         const config = {
    //     //             headers: {
    //     //                 Authorization: `Bearer ${token}`,
    //     //             },
    //     //         };
    //     //         const {data} = await axios.get(`http://localhost:5000/api/user?search=${search}`, config);
    //     //         dispatch(setSearchResults(data));
    //     //         // console.log(data);
    //     //     } catch (error) {
    //     //         toast({
    //     //             title: "User not found",
    //     //             description: `${error}`,
    //     //             variant: "subtle",
    //     //             status: "error",
    //     //             position: "top-left",
    //     //             duration: 4000,
    //     //             isClosable: true,
    //     //             w: "100px",
    //     //           });
    //     //           return;
    //     //     }
    //     // }
    // };


    // function to create chat
    // const createChat = async (userId) => {
    //     // console.log(props);
    //     // console.log(userId);
    //     try {
    //         const config = {
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         };
    //         const {data} = await axios.post("http://localhost:5000/api/chat", {"userId": `${userId}`}, config);
    //         dispatch(setChatListRefresher(chatListRefresher));
    //         // console.log(data._id);
    //     } catch (error) {
    //         toast({
    //             title: "User not found",
    //             description: `${error}`,
    //             variant: "subtle",
    //             status: "error",
    //             position: "top-left",
    //             duration: 4000,
    //             isClosable: true,
    //             w: "100px",
    //           });
    //           return;
    //     }
    // };

    // function to add to group
    const addToGroup = async (user) => {
    //   if(!selectedUsers.includes(user)){
    //     dispatch(addToSelectedUsers(user));
    //   }
    }

    // function to remove from group
    const handleRemove = (user) => {
    //   dispatch(removeFromSelectedUsers(user));
    };

    // function to render chats
    


    // logout handler
    // const handleLogout = () => {
    //   localStorage.removeItem("token");
    //   localStorage.removeItem("userId");
    //   localStorage.removeItem("name");
    //   localStorage.removeItem("username");
    //   navigate("/");
    // };


  return (
	<>
		{(!token) && useEffect(() => {
			if(!token){
				toast({
					title: "Please Login to Continue",
					variant: "subtle",
					status: "error",
					position: "top-left",
					duration: 4000,
					isClosable: true,
					w: "100px",
				});
				navigate("/");
			}
		},[])}
		{token && 
		<>
		<div className="h-dvh w-screen bg-[#92B397] flex flex-col">
			<Navbar />
			<div className="bottom h-full grid grid-cols-4 mx-5 my-2">
			<ChatsDisplay socket={socket}/>
			<ChatArea socket={socket}/>
			</div>
		</div>
		</>}
	</>
  );
}

export default ChatPage