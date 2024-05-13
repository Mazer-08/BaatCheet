import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useDisclosure, Button, Avatar, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody, Stack, Image, Link, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerFooter } from '@chakra-ui/react'
import { BellIcon, AddIcon } from '@chakra-ui/icons'

import SingleChatDrawer from './SingleChatDrawer'
import GroupChatDrawer from './GroupChatDrawer'

import { useSelector, useDispatch } from 'react-redux'

const Navbar = () => {

	//hooks
		const { isOpen, onOpen, onClose } = useDisclosure();
		const dispatch = useDispatch();
		const navigate = useNavigate();

	//selectors
		const addText = useSelector((state) => state.chatModeSelector.text);
		const chatMode = useSelector((state) => state.chatModeSelector.chatMode);

	//local variables
		const name = localStorage.getItem("name");
		const pic = localStorage.getItem("pic");

	// functions
	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("userId");
		localStorage.removeItem("name");
		localStorage.removeItem("username");
		localStorage.removeItem("email");
		localStorage.removeItem("pic");
		navigate("/");
	}

  	return (
		<>
			<div className="w-full h-min px-6 py-2 bg-[#111812] flex justify-between">
          		<div className="left-search-create flex items-center">
					<Button color="#111812" bgColor="#92b397" leftIcon={<AddIcon />} onClick={onOpen}>
						{addText}
					</Button>
					<Drawer isOpen={isOpen} placement="left" onClose={onClose}>
						<DrawerOverlay />
						<DrawerContent>
							<DrawerCloseButton />

							{/* chatmode==1 => SingleChat Drawer */}
							{chatMode && <SingleChatDrawer/>}

							{/* chatmode==0 => GroupChat Drawer */}
							{!chatMode && <GroupChatDrawer/>}

							<DrawerFooter borderTopWidth="1px" className="text-xs">
								Brought to you by
								<span className="text-red-500 ml-1">
									<a href="https://sabhyaks.netlify.app/">Mazer</a>
								</span>
							</DrawerFooter>
						</DrawerContent>
					</Drawer>
          		</div>

				<div className="center-brand flex items-center">
					<h1 className="text-[#FFF5EA] text-2xl hover:cursor-pointer">
					BaatCheet
					</h1>
				</div>

				<div className="right-notif-profile flex gap-10 items-center">
					<BellIcon boxSize={7} color="#FFF5EA" />
					<Popover>
						<PopoverTrigger>
							<Avatar name={name} src={pic} />
						</PopoverTrigger>
						<PopoverContent className='overflow-hidden'>
							{/* fix wavy bg */}
							{/* <WavyBackground className="absolute z-10">
							</WavyBackground> */}
							<PopoverArrow />
							<PopoverCloseButton />
							<PopoverHeader>Sabhya</PopoverHeader>
							<PopoverBody>
								<Stack className='flex justify-center items-center' spacing={4}>
									<Image
										borderRadius='full'
										boxSize='200px'
										src={pic}
										alt={name}
									/>
									<Link>Profile</Link>
									<Link onClick={handleLogout}>Logout</Link>
								</Stack>
							</PopoverBody>
						</PopoverContent>
					</Popover>
				</div>

        	</div>
		</>
  	)
}

export default Navbar