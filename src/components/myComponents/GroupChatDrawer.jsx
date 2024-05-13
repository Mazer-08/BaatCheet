import React from 'react'
import axios from 'axios'
// import { useNavigate } from 'react-router-dom'

import { Box, Input, DrawerHeader, DrawerBody, Stack, FormLabel, Button, useToast } from '@chakra-ui/react'
import SearchEntry from './SearchEntry';
import SelectedUser from './SelectedUser';

import { useDispatch, useSelector } from 'react-redux'
import { setChatList, setSearch, setSearchResults } from '../../features/userSearchSlice'
import { setGroupChatTitle, addToSelectedUsers, removeFromSelectedUsers } from '../../features/groupChatSlice'

const GroupChatDrawer = () => {

	const token = localStorage.getItem("token");
	
    // hooks
    const dispatch = useDispatch();
	const toast = useToast();
	// const navigate = useNavigate();
	
    // selectors
    const groupChatTitle = useSelector((state) => state.groupChat.groupChatTitle);
	const search = useSelector(state => state.userSearch.search);
	const searchResults = useSelector(state => state.userSearch.searchResults);
	const selectedUsers = useSelector((state) => state.groupChat.selectedUsers);
	const chatList = useSelector((state) => state.userSearch.chatList);

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

	const handleCreateGroup = async () => {
        if(selectedUsers.length < 2){
            toast({
                title: "Select atleast 2 users",
                variant: "subtle",
                status: "warning",
                position: "top-left",
                duration: 4000,
                isClosable: true,
                w: "100px",
            });
            return;
        }
        try {
            let useridList = [];
            let name = groupChatTitle;
            selectedUsers.map((user) => {
                useridList.push(user._id);
            });
            const body = {
				"name": name,
				"users": JSON.stringify(selectedUsers.map((user) => user._id)),
            }
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const {data} = await axios.post("http://localhost:5000/api/chat/group", body, config);
			dispatch(setChatList([data, ...chatList]));
			dispatch(setSearch(""));
			dispatch(setGroupChatTitle(""));
            console.log("Group Created");
            console.log(data);

            // console.log(data._id);
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
            console.log(error);
            return;
        }
    };

	const addToGroup = async (user) => {
		if(!selectedUsers.includes(user)){
			dispatch(addToSelectedUsers(user));
		}
	}

	const handleRemove = (user) => {
		dispatch(removeFromSelectedUsers(user));
	};

    return (
    <>
	<DrawerHeader borderBottomWidth="1px">Create New Group</DrawerHeader>

	<DrawerBody>
        <Stack spacing={4}>
          	<Box className="flex">
				<Input
					id="groupname"
					placeholder="Enter Group Name"
					onChange={(e) => {
						dispatch(setGroupChatTitle(e.target.value));
					}}
					value={groupChatTitle}
				/>
          	</Box>
          	<Box>
				<Stack spacing={1}>
					<FormLabel htmlFor="owner">Search Participants</FormLabel>
					<Box className="flex gap-2">
						<Input
							id="participants"
							placeholder="Name or Username"
							onChange={(e) => {
								dispatch(setSearch(e.target.value));
								handleUserSearch();
							}}
							value={search}
						/>
						<Button onClick={handleCreateGroup} colorScheme="blue">
							<p className="text-xs">Create Group</p>
						</Button>
					</Box>
					<Box className="flex flex-grow gap-2 my-1 ">
						{selectedUsers.map((user, index) => {
						return (
							<SelectedUser
								key={index}
								user={user}
								handleFunction={() => handleRemove(user)}
							/>
						);
						})}
					</Box>
					<Box className="flex flex-col">
						{searchResults.map((user, index) => {
							return (
								<SearchEntry
									key={index}
									user={user}
									handleFunction={() => addToGroup(user)}
								/>
							);
						})}
					</Box>
				</Stack>
			</Box>
		</Stack>
	</DrawerBody>
    </>
  );
}

export default GroupChatDrawer