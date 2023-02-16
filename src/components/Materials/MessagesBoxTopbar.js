import { Avatar, Box, Image, Text, Tooltip } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { getSender, GroupMembers } from '../../configs/userConfigs';
import { ChatState } from '../../Context/ChatProvider'

function MessagesBoxTopbar() {

    const { selectedChat, user, setSelectedChat, setProfile, isTyping, typingUser } = ChatState();

    let navigate = useNavigate()
    const handleBack = () => {
        setSelectedChat(null);
        navigate('/chats')
    }

    return (
        <>

            <Box
                pos={"relative"}
                height={"5rem"}
                maxWidth="100%"
                background={"#27aea4"}
                marginLeft=".1rem"
                boxShadow="0 0 3px rgba(0,0,0,.9)"
                display={"flex"}
                zIndex="3"
                justifyContent="space-between"
                alignItems={"center"}
                padding="0 .9rem">

                <Box display={"flex"} color="white" gap="1rem" className='msgleftTop' alignItems={"center"}>
                    <Avatar cursor={"pointer"} onClick={() => setProfile(getSender(selectedChat, user))} boxShadow={"0 0 0 2px #fff"} src={getSender(selectedChat, user)?.avatar || "https://res.cloudinary.com/dvzjzf36i/image/upload/v1674153497/cudidy3gsv1e5zztsq38.png"} />
                    <Text fontSize={{ base: "1.3rem", md: "1.5rem" }} fontWeight="normal">
                        {
                            getSender(selectedChat, user)?.name
                        }
                    </Text>
                    {selectedChat?.pinnedBy.includes(user?._id)
                        &&
                        <Tooltip label="pinned" placement='top' fontSize={".7rem"}>
                            <Box background={"white"} padding=".3rem" borderRadius={"50%"} boxShadow="inset 0 0 1.5px rgba(0,0,0,1)" >
                                <Image width={".8rem"} src="https://cdn-icons-png.flaticon.com/512/1274/1274749.png" />
                            </Box>
                        </Tooltip>}

                    {isTyping
                        &&
                        <Text pos={"absolute"} bottom=".3rem" fontSize={".85rem"} color="floralwhite" letterSpacing=".01rem" left={"5rem"}>
                            {selectedChat.isGroupchat && typingUser.split(" ")[0] + " is "}
                            typing.....
                        </Text>}
                </Box>
                <Box className='msgrightTop'>
                    {
                        window.innerWidth > 770 && selectedChat?.isGroupchat &&
                        GroupMembers(selectedChat)
                    }
                    {
                        window.innerWidth < 770 && !(selectedChat?.isGroupchat) &&
                        <Tooltip label="Back" isOpen placement='bottom'>
                            <Box onClick={handleBack} padding={".3rem"} borderRadius=".3rem" background={"white"}>
                                <Image maxWidth="1.5rem" src="https://cdn-icons-png.flaticon.com/512/7792/7792362.png"></Image>
                            </Box>
                        </Tooltip>
                    }
                </Box>
            </Box>
            {
                window.innerWidth < 770 && selectedChat?.isGroupchat &&
                <Box
                    zIndex={1}
                    pos={"relative"}
                    height={"2.5rem"}
                    maxWidth="100%"
                    background={"#27aea4"}
                    boxShadow="0 0 3px rgba(0,0,0,.5)"
                    display={"flex"}
                    justifyContent="space-between"
                    alignItems={"center"}
                    marginLeft=".08rem"
                    padding="0 .2rem"
                >
                    {
                        window.innerWidth < 770 &&
                        <Box
                            borderRadius={".3rem"}
                            display="flex"
                            justifyContent={"space-between"}
                            width="100%"
                            className='backTochatsBtn'>

                            <Box onClick={handleBack}
                                className='flex'
                                gap={".5rem"}
                                width={"fit-content"}
                                padding={"0 .3rem"}
                                borderRadius=".3rem "
                                background="white">
                                <Image maxWidth="1rem" src="https://cdn-icons-png.flaticon.com/512/7792/7792362.png"></Image>
                                <Text color={"black"} fontWeight="medium">Back</Text>
                            </Box>
                            <Box>
                                {GroupMembers(selectedChat)}
                            </Box>
                        </Box>
                    }

                </Box>
            }
        </>

    )
}

export default MessagesBoxTopbar
