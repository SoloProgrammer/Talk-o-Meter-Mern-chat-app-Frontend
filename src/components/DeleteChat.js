import { Box, Image, Spinner, Text } from '@chakra-ui/react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { server } from '../configs/serverURl';
import { getSender, HandleLogout } from '../configs/userConfigs';
import { ChatState } from '../Context/ChatProvider';

function DeleteChat() {

    const navigate = useNavigate()

    const { user, selectedChat, setChats, chats, showToast,archivedChats,setArchivedChats,setViewArchivedChats } = ChatState()

    const [delConfirm, setDelConfirm] = useState(false);

    const [delLoading, setDelLoading] = useState(false);

    const handleDeleteChat = async () => {
        try {
            setDelLoading(true)
            let config = {
                method: "PUT",
                headers: {
                    token: localStorage.getItem('token'),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ chatId: selectedChat?._id })
            }

            const res = await fetch(`${server.URL.local}/api/chat/deletechat`, config);

            if (res.status === 401) HandleLogout();
            
            const json = await res.json();
            
            setDelLoading(false);
            setDelConfirm(false);

            if (!json.status) return showToast("Error", json.message, "error", 3000);

            if (archivedChats.map(c => c._id).includes(selectedChat._id)) {
                setArchivedChats(archivedChats.filter(c => c._id !== selectedChat._id))
            }
            else setChats(chats.filter(c => c._id !== selectedChat._id));

            if(archivedChats.filter(c => c._id !== selectedChat._id).length < 1) setViewArchivedChats(false)

            navigate('/chats');

            showToast(json.message, '', "success", 3000)

        } catch (error) {
            showToast("Error", error.message, "error", 3000)
            setDelLoading(false);
            setDelConfirm(false);
        }
    }

    return (
        <>
            {(delConfirm && !delLoading) 
            && 
            <Text marginBottom={".4rem"} fontSize=".85rem">Are you sure you want to delete chat with <b>{getSender(selectedChat, user).name.split(" ")[0]} !</b> </Text>}
            <Box
                _hover={{ bg: "gray.200", boxShadow: "0 0 2px rgba(0,0,0,.2)" }}
                transition=".4s all"
                border={"1px solid rgba(0,0,0,.1)"}
                cursor={!delLoading && "pointer"}
                // border={"1px solid gray.500"}
                fontWeight={"medium"}
                className="flex"
                alignItems={"start"}
                boxShadow={(delLoading || delConfirm) && "0 0 2px rgba(0,0,0,.4)"}
                gap=".3rem"
                background={(delConfirm || delLoading) && "gray.200"}
                padding=".4rem"
                onClick={() => setDelConfirm(true)}
                color={"red.400"}>
                {
                    !delLoading
                        ?
                        delConfirm
                            ?
                            <>
                                <Box className='flex' color={"white"} gap="1rem" fontSize={".85rem"} margin=".1rem 0">
                                    <Text onClick={(e) => {
                                        e.stopPropagation();
                                        setDelConfirm(false)
                                    }} bg={"green.500"} padding=".25rem .4rem" borderRadius={".2rem"}>
                                        No! Cancel
                                    </Text >
                                    <Text onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteChat()
                                    }} bg={"red.500"} padding=".25rem .4rem" borderRadius={".2rem"}>
                                        Yes! Delete
                                    </Text>
                                </Box>
                            </>
                            :
                            <>
                                <Image width={"1.2rem"} src='https://cdn-icons-png.flaticon.com/512/5165/5165608.png' />
                                <Text>Delete Chat</Text>
                            </>
                        :
                        <>
                            <Spinner padding={".7rem"} size={"md"} color="red" />
                        </>
                }

            </Box>
        </>
    )
}

export default DeleteChat
