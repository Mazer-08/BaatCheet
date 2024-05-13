import React from "react";
import axios from "axios";
import { Avatar, useToast } from "@chakra-ui/react";
import {ChatIcon, AddIcon} from '@chakra-ui/icons'

import { useSelector } from "react-redux";


const SearchEntry = ({user, handleFunction}) => {

    const chatMode = useSelector((state) => state.chatModeSelector.chatMode);
    
  return (
    <div className="mt-2 border-2 rounded-md">
        <div className="padder p-1 grid grid-cols-8 gap-2">
            <div className="left col-span-2 flex items-center">
                <Avatar size='md' name={user.name} src={user.pic} />
            </div>
            <div className="right col-span-5 flex items-center">
                <div className="content flex flex-col">
                    <h1>{user.name}</h1>
                    <h1 className="text-xs"><span className="font-bold">Username:</span> {user.username}</h1>
                </div>
            </div>
            <div className="add col-span-1 flex items-center">
                {chatMode && <ChatIcon className="cursor-pointer" onClick={handleFunction}/>}
                {!chatMode && <AddIcon className="cursor-pointer" onClick={handleFunction}/>}
            </div>
        </div>
    </div>
  );
};

export default SearchEntry;
