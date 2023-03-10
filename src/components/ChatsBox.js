import { Avatar, AvatarBadge, Box, Image, Text, Tooltip } from '@chakra-ui/react'
import { getFormmatedDate, getFormmatedTime, weekDays } from '../configs/dateConfigs'
import React, { useEffect } from 'react'
import { getSender, isUserOnline } from '../configs/userConfigs'
import ChatsTopBar from './Materials/ChatsTopBar'
import ProfileDrawer from './Materials/ProfileDrawer'
import { ChatState } from '../Context/ChatProvider'
import { useNavigate } from 'react-router-dom'
import ChatMenuBox from './Materials/ChatMenuBox'
import ChatFooter from './ChatFooter'
import { ChatsSkeleton } from './Materials/Loading'


function ChatsBox() {

  const { chats, archivedChats, viewArchivedChats, chatsLoading, user, selectedChat, setProfile, profile, seenlstMessage, notifications, setNotifications } = ChatState()

  const navigate = useNavigate();

  const Trimlastestmsg = (msg) => {
    let trimInd = window.innerWidth > 1300 ? 50 : 30

    if (window.innerWidth > 500 && window.innerWidth < 770) {
      trimInd = 40
    } else if (window.innerWidth > 770 && window.innerWidth < 1000) {
      trimInd = 25
    } else if (window.innerWidth > 1000 && window.innerWidth < 1300) {
      trimInd = 35
    } else if (window.innerWidth <= 500 && window.innerWidth > 390) trimInd = 29
    else if (window.innerWidth <= 390) trimInd = 23

    return msg.length <= trimInd ? msg : msg.slice(0, trimInd).concat("...")
  }

  const getDateTime = (timeStamps) => {
    let date = new Date(timeStamps)
    let DateTime;

    let FormattedTime = getFormmatedTime(date)

    let currdate = new Date();

    let FormattedDate = getFormmatedDate(date);

    let dayDiff = currdate.getDate() - date.getDate()

    if (date.getYear() === currdate.getYear() && date.getMonth() === currdate.getMonth()) {
      if (dayDiff === 0) {
        DateTime = FormattedTime
      } else if (dayDiff === 1) DateTime = "Yesterday"
      else if (dayDiff < 7) return weekDays[date.getDay()]
      else DateTime = FormattedDate
    }
    else {
      DateTime = FormattedDate
    }

    return DateTime
  }

  const handleChatClick = (chat) => {
    navigate(`/chats/chat/${chat._id}`);
    setProfile(null);
  }

  useEffect(() => {

    let elem = document.getElementById(`DateTime${selectedChat?._id}`)
    if (elem?.classList.contains('unSeen')) {
      elem.classList.remove('unSeen');
      selectedChat?.latestMessage && seenlstMessage(selectedChat.latestMessage._id)
    }

    notifications.length && setNotifications(notifications.filter(noti => noti.chat._id !== selectedChat?._id))

    // eslint-disable-next-line
  }, [selectedChat?._id]);

  return (
    <Box pos={"relative"} display={{ base: selectedChat ? "none" : "block", md: "block" }} className='chatsBox' height={"100%"} width={{ base: "100%", md: "40%", lg: "36%" }} boxShadow="0 0 0 2px rgba(0,0,0,.3)">
      <ChatsTopBar />
      <Box overflowY={"auto"} pos={"relative"} height={"calc(100vh - 7.3rem)"} className="allchatsBox">
        {
          profile && profile._id === user._id &&
          <ProfileDrawer width="full" align="left" />
        }
        {
          (!chatsLoading && !viewArchivedChats && (archivedChats.length > 0 && chats.length < 1)) &&
          <Box textAlign={"center"} marginTop="7rem">
            <Text fontSize={'1.4rem'}>
              {"You have " + archivedChats.length + " Archived chat"}
            </Text>
            <br />
            <Text padding={"0 .3rem"}>
              Click  on  the  <b>Archived</b>  button  to the top left  corner  to  view  them
            </Text>
          </Box>
        }
        {
          (!chatsLoading && chats?.length === 0 && archivedChats.length === 0)
            ?
            <Box height={"100%"} display="flex" flexDir={"column"} justifyContent="center" alignItems={"center"} className='allchats hidetop' transition={".6s"}>
              <Image marginBottom={"4rem"} opacity=".3" width={{ base: "6rem", md: "10rem" }} src="https://cdn-icons-png.flaticon.com/512/3073/3073428.png" />
              <Text fontWeight={"medium"} >Haven't Created your first Chat Yet?</Text>
              <Text>No Problem!</Text>
              <br />
              <Text textAlign={"center"} fontWeight={"hairline"} >Let's go ahead and Search Users to Start your First Chat with them</Text>
            </Box>
            :
            (
              !chatsLoading && ((chats?.length > 0) || (archivedChats.length > 0))
            )
            &&
            <Box display="flex" flexDir={"column"} gap=".2rem" margin=".2rem" paddingBottom={window.innerWidth > 770 ? "4.3rem" : "4.8rem"} className='allchats ' transition={".6s"}>
              {
                (archivedChats.length && viewArchivedChats ? archivedChats : chats)?.map((chat, i) => {
                  return (
                    <Box
                      key={i}
                      onClick={() => { handleChatClick(chat, i) }}
                      display={"flex"}
                      width="100%"
                      bg={selectedChat?._id === chat?._id ? "#2da89f61" : "rgb(241,243,244)"}
                      boxShadow={selectedChat?._id === chat?._id && "inset 0 0 0 1.1px #2baca1;"}
                      padding={"0.7rem 0.5rem"}
                      gap="1rem"
                      alignItems={"center"}
                      className="singleChatBox"
                      cursor="pointer"
                      pos={"relative"}
                      _hover={{ base: { bg: "transperent" }, md: { bg: "#2da89f61" } }}
                    >
                      <Box maxWidth={"67px"} >
                        <Avatar boxShadow={"0 0 0 3px #27aea4"} src={getSender(chat, user)?.avatar || "https://res.cloudinary.com/dvzjzf36i/image/upload/v1674153497/cudidy3gsv1e5zztsq38.png"} >
                          {
                            !(chat.isGroupchat)
                            &&
                            <Tooltip fontSize={".75rem"} label={isUserOnline(getSender(chat, user)) ? "online" : "offline"} placement="bottom-start">
                              <AvatarBadge
                                borderWidth="2px"
                                borderColor='#ffffff'
                                bg={isUserOnline(getSender(chat, user)) ? '#00c200' : "darkgrey"}
                                boxSize='.8em' />
                            </Tooltip>
                          }

                        </Avatar>
                      </Box>

                      <Box width={{ base: "calc(100% - 15%)", md: "calc(100% - 12%)" }}>
                        <Box display={"flex"} justifyContent="space-between" width={"100%"}>
                          <Box fontSize={"1rem"} fontWeight="semibold">
                            <Box className='flex' gap={".7rem"}>
                              <Text>{getSender(chat, user)?.name}</Text>
                              {chat?.mutedNotificationBy?.includes(user?._id)
                                &&
                                <Tooltip label="Notification muted" placement='top' fontSize={".8rem"}>
                                  <Image width={"1rem"} src='https://cdn-icons-png.flaticon.com/512/4175/4175297.png' />
                                </Tooltip>
                              }
                            </Box>
                          </Box>
                          {chat.latestMessage &&
                            <>
                              <Text
                                fontSize={".75rem"}
                                fontWeight="normal"
                                id={`DateTime${chat._id}`}
                                padding={".0 .3rem"}
                                className={`latestMessageDateTime flex ${!(chat.latestMessage?.seenBy.includes(user?._id)) && "unSeen"}`}>
                                <>{getDateTime(chat.latestMessage.createdAt)}</>
                              </Text>

                            </>

                          }
                        </Box>

                        {/* latestmessage */}
                        <Box marginTop=".18rem" fontSize={".8rem"} fontWeight="black" display={"inline-block"}>
                          <span>
                            {chat.latestMessage
                              &&
                              (chat.latestMessage.sender._id === user?._id ? "You" : chat.latestMessage.sender.name.split(" ")[0]) + ": "}
                          </span>

                          <Text display={"inline-block"} fontWeight="normal" fontSize={".87rem"}>
                            {chat.latestMessage ? (chat.latestMessage.content.img ? <><i className="fa-regular fa-image" />&nbsp;{chat.latestMessage.content.img.substring(chat.latestMessage.content.img.lastIndexOf('.') + 1) === "gif" ? "gif" : "image"}</> : Trimlastestmsg(chat.latestMessage?.content.message)) : "No message yet!"}
                          </Text>
                        </Box>
                      </Box>

                      {
                        chat.pinnedBy?.includes(user?._id)
                        &&
                        <Tooltip label="pinned" fontSize={".7rem"} placement="top">
                          <Box pos={"absolute"} right="2rem" bottom={"6px"}>
                            <Image width=".8rem" src="https://cdn-icons-png.flaticon.com/512/1274/1274749.png" />
                          </Box>
                        </Tooltip>
                      }

                      <ChatMenuBox chat={chat} i={i} />

                    </Box>
                  )
                })
              }
            </Box>
        }
        {
          chatsLoading &&
          <Box height={"100%"} marginTop=".4em" >
            <ChatsSkeleton />
          </Box>
        }
      </Box>

      <ChatFooter />
    </Box>
  )
}

export default ChatsBox
