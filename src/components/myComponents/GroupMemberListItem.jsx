import React, { useEffect } from 'react'
import axios from 'axios'

import { Avatar, Button, useToast } from '@chakra-ui/react'

import { useSelector, useDispatch } from 'react-redux'
import { setChatListRefresher } from '../../features/userSearchSlice'
import { setGroupMembers } from '../../features/groupChatBoxInfoSlice'

const GroupMemberListItem = ({member}) => {

    //local variables
    const id = localStorage.getItem('userId');
    const token = localStorage.getItem("token");

    //hooks
    const toast = useToast();
    const dispatch = useDispatch();

    // selectors
    const groupAdminId = useSelector((state) => state.groupChatBox.groupAdminId);
    const groupId = useSelector((state) => state.groupChatBox.groupId);
    const chatListRefresher = useSelector((state) => state.userSearch.chatListRefresher);

    // functions
    const handleRemove = async() => {
        const config = {
            headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
            },
        };
        const body = {
            "chatId": `${groupId}`,
            "userId": `${member._id}`,
        }
        try {
            console.log('request made')
            const {data} = await axios.put(`http://localhost:5000/api/chat/groupremove`, body, config);
            dispatch(setGroupMembers(data.users));
            dispatch(setChatListRefresher(chatListRefresher));
        } 
        catch (error) {
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

    return (
    <div className="container flex gap-2 justify-between items-center bg-[#4c5d4f] rounded-lg p-2 text-sm text-white">
        <div className="info flex gap-2 justify-between items-center">
            <div className="pic">
                <Avatar name={member.name} src={member.pic} />
            </div>
            <div className="name">
                {id === member._id ? "You" : member.name}
            </div>
        </div>
        <div className="admin">
            <div className="role text-xs">
                {(groupAdminId === member._id) && <span>Admin</span> }
                    
            </div>
            <div className="removefn">
                {(groupAdminId !== id) ? <></> : 
                    (groupAdminId === member._id) ? <></> : <Button color="#111812" bgColor="#92b397" onClick={handleRemove}><p className='text-sm'>Remove</p></Button>
                }
                    
            </div>

        </div>
    </div>
  )
}

export default GroupMemberListItem