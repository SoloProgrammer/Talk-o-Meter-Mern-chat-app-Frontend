import { Avatar, Box, Button, Image, Menu, MenuButton, MenuItem, MenuList, Text, Tooltip, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { BellIcon, ChevronDownIcon, SearchIcon } from '@chakra-ui/icons'
import SideDrawer from './SideDrawer';
import BrandLogo from '../../utils/BrandLogo';
import CreateGroupChat from './CreateGroupChat';

function ChatsTopBar() {
    
    const { user, setProfile, profile } = ChatState();
    
    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/'
    }

    return (
        <>
            <Box zIndex={10} pos={"relative"} height={"5rem"} width="100%" background={"#27aea4"} boxShadow="0 0 3px rgba(0,0,0,.5)"
                display={"flex"} justifyContent="space-between" alignItems={"center"} padding="0 .3rem">
                <Box>
                    <Menu>
                        <MenuButton onClick={() => profile?._id === user?._id && setProfile(null)} className='userAvatarBtn' height="fit-content" as={Button} rightIcon={<ChevronDownIcon />} background="transperent'">
                            <Avatar className='userAvatar' transition=".3s" size={"md"} name={user?.name} src={user?.avatar} />{' '}
                        </MenuButton>
                        <MenuList boxShadow={"0 0 3px rgba(0,0,0,.4)"}>
                            <MenuItem display={"flex"} gap=".5rem" alignItems={"center"} onClick={() => setProfile(user)} >
                                <Avatar size={"xs"} name={user?.name} src={user?.avatar} />{' '}
                                <span>My profile</span>
                            </MenuItem>
                            <div></div>
                            <MenuItem onClick={handleLogout} display={"flex"} gap=".5rem" alignItems={"center"}>
                                <Image src='https://cdn-icons-png.flaticon.com/512/4980/4980424.png'
                                    boxSize='1.5rem'
                                    borderRadius='full' />
                                <span>Logout</span>
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Box>
                <Box zIndex={1}>
                    <BrandLogo color="white" />
                </Box>
                <Box display={"flex"} justifyContent="space-evenly">
                    <Menu>
                        <Tooltip label="Search Users" placement='bottom-end' borderRadius={".2rem"}>
                            <MenuButton _active={{ boxShadow: "inset 0 0 0 22px #a2f1ec54" }}
                                _hover={{ boxShadow: "inset 0 0 0 22px #a2f1ec54" }}
                                width="fit-content"
                                transition=".5s" borderRadius='full'
                                onClick={onOpen}
                                padding={".3rem .6rem"}>
                                <SearchIcon fontSize={"2lg"} m={1} />
                            </MenuButton>
                        </Tooltip>
                        <SideDrawer isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
                    </Menu>
                    <Menu>
                        <Tooltip label="Notifications" placement='bottom-end' borderRadius={".2rem"}>
                            <MenuButton p={1}
                                _active={{ boxShadow: "inset 0 0 0 15px #a2f1ec54" }}
                                _hover={{ boxShadow: "inset 0 0 0 15px #a2f1ec54" }}
                                transition=".5s" borderRadius='full'
                                padding={".3rem"}>
                                <BellIcon fontSize={"2xl"} m={1} />
                            </MenuButton>
                        </Tooltip>
                        <MenuList boxShadow={"0 0 3px rgba(0,0,0,.4)"} position={"left"} zIndex="10">
                            <MenuItem>No messages</MenuItem>
                        </MenuList>
                    </Menu>
                </Box>

                {/* Create Group Chat Button Component */}
                <CreateGroupChat/> 
                
            </Box>
            <Box padding={".3rem"} borderBottom="2px solid darkcyan" background={"aliceblue"}>
                <Text textAlign={"center"} textTransform="uppercase" fontStyle={"italic"} fontWeight="hairline">My chats</Text>
            </Box>
        </>
    )
}

export default ChatsTopBar
