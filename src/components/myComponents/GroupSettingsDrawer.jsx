import React from 'react'
import axios from 'axios'

import { useDisclosure, useToast, Button, Box, Input, DrawerHeader, DrawerBody, DrawerFooter, DrawerOverlay, DrawerContent, DrawerCloseButton } from '@chakra-ui/react'
import SearchEntry from './SearchEntry'
import GroupMemberListItem from './GroupMemberListItem'

import { useSelector, useDispatch } from 'react-redux'
import { setSearch, setSearchResults } from '../../features/userSearchSlice'
import { setGroupAdminId, setGroupAdminName, setGroupId, setGroupMembers, setGroupName } from '../../features/groupChatBoxInfoSlice'
import { setChatListRefresher } from '../../features/userSearchSlice'

const GroupSettingsDrawer = () => {

    // local variables
    const id = localStorage.getItem('userId');
    const token = localStorage.getItem("token");

    //hooks
    const dispatch = useDispatch();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    //selectors
    const search = useSelector((state) => state.userSearch.search);
    const searchResults = useSelector((state) => state.userSearch.searchResults);
    const groupName = useSelector((state) => state.groupChatBox.groupName);
    const groupAdminId = useSelector((state) => state.groupChatBox.groupAdminId);
    const groupMembers = useSelector((state) => state.groupChatBox.groupMembers);
    const groupId = useSelector((state) => state.groupChatBox.groupId);
    const chatListRefresher = useSelector((state) => state.userSearch.chatListRefresher);

    // functions
    const handleRename = () => {
        if(groupName === "" || groupName === " " || groupName === "   "){
            toast({
                title: "Group name cannot be empty",
                variant: "subtle",
                status: "error",
                position: "top-left",
                duration: 4000,
                isClosable: true,
                w: "100px",
            });
            return;
        }
        const config = {
            headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
            },
        };
        const body = {
            "chatId": `${groupId}`,
            "chatName": `${groupName}`,
        }
        try {
            const {data} = axios.put(`http://localhost:5000/api/chat/rename`, body, config);
            dispatch(setChatListRefresher(chatListRefresher));
        } catch (error) {
            toast({
                title: "Group name change failed",
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

    const addToGroup = async (userId) => {
        const config = {
            headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
            },
        };
        const body = {
            "chatId": `${groupId}`,
            "userId": `${userId}`,
        }
        try {
            const {data} = await axios.put(`http://localhost:5000/api/chat/groupadd`, body, config);
            dispatch(setGroupMembers(data.users));
            dispatch(setChatListRefresher(chatListRefresher));
        } catch (error) {
            console.log(error);
            toast({
                title: "User not added",
                description: `${error.response.data}`,
                variant: "subtle",
                status: "error",
                position: "top-left",
                duration: 4000,
                isClosable: true,
                w: "100px",
            })
        }
    }

    const handleDeleteGroup = async() => {
        // axios.delete works differently
        try {
            console.log("request made")
            const {data} = await axios.delete(`http://localhost:5000/api/chat/delete`,{
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },    
                data: {
                    "chatId": `${groupId}`,
                }
            });
            dispatch(setChatListRefresher(chatListRefresher));
            dispatch(setGroupAdminId(""));
            dispatch(setGroupAdminName(""));
            dispatch(setGroupId(""));
            dispatch(setGroupMembers([]));
            dispatch(setGroupName(""));
        } catch (error) {
            console.log(error)
            toast({
                title: "Group deletion failed",
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

    const handleLeaveGroup = () => {
        console.log("to be handled");
    }

    return (
    <>
        <DrawerOverlay />
        <DrawerContent>
            <DrawerCloseButton />

            <DrawerHeader borderBottomWidth="1px">Group Settings</DrawerHeader>
      	    <DrawerBody className="flex flex-col gap-2">
                {(id === groupAdminId) && (
                    <Box className="editGroupname flex flex-col gap-2">
                        <h1>Edit Group Name</h1>
                        <div className="form flex gap-1">
                            <Input
                                id="username"
                                value={groupName}
                                onChange={(e) => dispatch(setGroupName(e.target.value))}
                            />
                            <Button color="#111812" bgColor="#92b397" onClick={handleRename}>Rename</Button>
                        </div>
                    </Box>
                )}

                <Box className="groupMembersAndRemoveFn flex flex-col gap-2">
                    <h1>Group Members</h1>
                    {/* <GroupMemberListItem/> */}
                    {groupMembers.map((member, index) => { return (<GroupMemberListItem key={index} member={member} />)})}
                </Box>
                
                {(id === groupAdminId) && <Box className="addGroupMembers flex flex-col gap-2">
                    <h1>Add New Member</h1>
                    <div className="form flex flex-col gap-1">
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
                                    handleFunction={() => addToGroup(user._id)}
                                />
                                );
                            })}
                        </Box>
                        
                    </div>
                </Box>}

                <Box className="leave/delete-group grid grid-cols-1 gap-2">
                    {(groupAdminId === id) ? <Button color="#111812" bgColor="#92b397" onClick={handleDeleteGroup}>Delete Group</Button> : 
                    <Button color="#111812" bgColor="#92b397" onClick={handleLeaveGroup}>Leave</Button>}
                </Box>
      	    </DrawerBody>

            <DrawerFooter borderTopWidth="1px" className="text-xs">
                Brought to you by
                <span className="text-red-500 ml-1">
                    <a href="https://sabhyaks.netlify.app/">Mazer</a>
                </span>
            </DrawerFooter>
        </DrawerContent>
    </>
  )
}

export default GroupSettingsDrawer