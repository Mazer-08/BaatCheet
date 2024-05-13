import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import { Box, Input, DrawerHeader, DrawerBody, useToast } from '@chakra-ui/react'
import SearchEntry from './SearchEntry';

import { useDispatch, useSelector } from 'react-redux'
import { setSearch, setChatList, setSearchResults, setChatListRefresher } from '../../features/userSearchSlice'


const SingleChatDrawer = () => {
	
	const token = localStorage.getItem("token");
	
    // hooks
    const dispatch = useDispatch();
	const toast = useToast();
	const navigate = useNavigate();
	
    // selectors
    const search = useSelector(state => state.userSearch.search);
	const searchResults = useSelector(state => state.userSearch.searchResults);
	const chatList = useSelector((state) => state.userSearch.chatList);
	const chatListRefresher = useSelector((state) => state.userSearch.chatListRefresher);

    // functions
	const handleUserSearch = async() => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			};
			const {data} = await axios.get(`http://localhost:5000/api/user?search=${search}`, config);
			dispatch(setSearchResults(data));
			// console.log(data);
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
	}

	const createChat = async (userId) => {
		try {
			const config = {
				headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
				},
			};
			const {data} = await axios.post("http://localhost:5000/api/chat", {"userId": `${userId}`}, config);
			dispatch(setChatListRefresher(chatListRefresher));
			dispatch(setSearch(""));
			//functionality regarding already existing chat
			// can be handles later
			// if(res.status == 200){
			// 	console.log("200 mein hu");
			// 	dispatch(setChatList([res.data, ...chatList]))
			// }
			// else{
			// 	console.log("duplicate wale m hu");
			// 	toast({
			// 		title: res.data,
			// 		variant: "subtle",
			// 		status: "error",
			// 		position: "top-left",
			// 		duration: 4000,
			// 		isClosable: true,
			// 		w: "100px",
			// 	});
			// 	console.log(res);
			// 	return;
			// }
			// console.log(res);
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
  	}

    return (
    <>
      	<DrawerHeader borderBottomWidth="1px">Search for a User</DrawerHeader>
      	<DrawerBody>
        	<Box className="flex gap-2">
				<Input
					id="username"
					placeholder="Search Name or Username"
					value={search}
					onChange={(e) => {
						dispatch(setSearch(e.target.value));
						handleUserSearch();
					}}
				/>
        	</Box>
        	<Box className="flex flex-col">
				{searchResults.map((user, index) => {
					return (
					<SearchEntry
						key={index}
						user={user}
						handleFunction={() => createChat(user._id)}
					/>
					);
				})}
        	</Box>
      	</DrawerBody>
    </>
  );
};

export default SingleChatDrawer;