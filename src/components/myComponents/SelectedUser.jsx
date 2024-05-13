import React from 'react'
import {CloseIcon} from '@chakra-ui/icons'
import { Button } from '@chakra-ui/react'

const SelectedUser = (props) => {
    const {user, handleFunction} = props;
  return (
    <>
        <Button onClick={handleFunction} colorScheme="blue" borderRadius='40px'>
            <div className="name flex gap-2 justify-center items-center">
                <h1 className='text-xs'>{user.username}</h1>
                <CloseIcon boxSize={2} />
            </div>
        </Button>
    </>
  )
}

export default SelectedUser