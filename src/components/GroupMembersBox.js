import { Box, Image, Text, useDisclosure } from '@chakra-ui/react'
import React, { useState } from 'react'
import GroupUser from '../utils/GroupUser'
import { ChatState } from '../Context/ChatProvider'
import PopupModal from './Materials/PopupModal'
import { HandleLogout, isAdmin } from '../configs/userConfigs'
import { server } from '../configs/serverURl'


function GroupMembersBox() {

    const { selectedChat, showToast, setChats, setSelectedChat } = ChatState()

    const { isOpen, onOpen, onClose } = useDisclosure()

    const [lastInd, setLastInd] = useState(5)
    const [groupUsers, setGroupUsers] = useState(selectedChat?.users.slice(0, lastInd))

    const hanldeShowMore = () => {
        setGroupUsers(groupUsers.concat(selectedChat?.users.slice(lastInd)))
        setLastInd(lastInd + 5)
    }
    const hanldeShowLess = () => {
        setGroupUsers(groupUsers.slice(0, lastInd - 5))
        setLastInd(lastInd - 5)
    }
    const [loading, setLoading] = useState(false)
    const hanldeAddmember = async (users) => {
        console.log(users)
        users = users.map(u => u._id)
        setLoading(true)
        try {
            let config = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    token: localStorage.getItem('token')
                },
                body: JSON.stringify({ chatId: selectedChat._id, users })
            }
            let res = await fetch(`${server.URL.production}/api/chat/groupadd`, config)

            if (res.status === 401) HandleLogout()

            let json = await res.json();

            setLoading(false)
            if (!json.status) return showToast("Error", json.message, "error", 3000)

            showToast("Great!", json.message, "success", 3000)
            setSelectedChat(json.chat)
            setChats(json.chats)
            onClose()
        } catch (error) {
            showToast("Error",error.message,"error",3000)
            setLoading(false)
        }
    }

    return (
        <Box width={"90%"} marginLeft=".8rem">
            <Box className='flex' justifyContent={"space-between"} marginBottom=".5rem">
                <Text fontSize={{ base: "1.2rem", md: "1.4rem" }} fontWeight="hairline" color="slategrey">Group members</Text>
                {
                    isAdmin() && <PopupModal isOpen={isOpen} onClose={onClose} addMember="add members" handleFunc={hanldeAddmember} addmemberLoading={loading}>
                        <Box
                            padding={".2rem .4rem"}
                            onClick={onOpen}
                            background="gray.200"
                            color={"black"}
                            fontWeight="hairline"
                            fontSize={{ base: ".75rem", md: ".85rem" }}
                            width="fit-content"
                            cursor="pointer"
                            className='flex'
                            justifyContent={"space-between"}
                            gap=".3rem"
                            transition={".3s"}
                            _hover={{ bg: "gray.300" }}
                            marginRight=".9rem">

                            <span> Add members </span>
                            <Image width={{ base: ".8rem", md: ".9rem" }} src={"https://cdn-icons-png.flaticon.com/512/9293/9293648.png"} />

                        </Box>
                    </PopupModal>}
            </Box>
            <Box className='GroupUsersBox' height={{ base: 'calc(100vh - 30.5rem)', md: 'calc(100vh - 29rem)' }} width="100%" overflowY="auto" >
                {
                    groupUsers.map(u => {
                        return <GroupUser key={u._id} u={u} />
                    })
                }
                {
                    selectedChat?.users.length > 5 && (
                        groupUsers.length !== selectedChat?.users.length ? <Text width={"fit-content"} onClick={hanldeShowMore} cursor={"pointer"} color={"blue.400"} fontSize=".8rem" fontWeight={"medium"}>Show more +</Text>
                            :
                            <Text onClick={hanldeShowLess} width={"fit-content"} cursor={"pointer"} color={"blue.400"} fontSize=".8rem" fontWeight={"medium"}>Show less -</Text>
                    )
                }
            </Box>
        </Box>
    )
}

export default GroupMembersBox
