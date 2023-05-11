import React,{useState, useEffect,useRef} from "react"
import { Box, Flex, Text, Button, Stack, Img, HStack,Avatar,Hide,Show ,Input,InputGroup,InputLeftElement,Alert,
    Image,
    AlertTitle,
    AlertDescription,InputRightAddon, InputRightElement
 } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Commons from "../Utility/Commons";
import {AudioOutlined ,SmileOutlined,CameraOutlined,PhoneOutlined,EllipsisOutlined,BookOutlined} from '@ant-design/icons';
import { useCookies } from 'react-cookie'; 
import { useNavigate   } from "react-router-dom";
import { useParams } from "react-router-dom";
import {ChevronLeftIcon,AttachmentIcon } from '@chakra-ui/icons'
import FormatDate from "../Utility/FormatDate";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,Portal,useDisclosure
  } from '@chakra-ui/react'

export default function PrivateChat(props){
    const navigate  = useNavigate();
    const [messages, setMessages]=useState([])
    const messagesList = useRef([]);
    const {uniqueName} = useParams()
    const [cookieObjectApiKey, setCookieObjectApiKey, removeCookiObjectApiKey] = useCookies(['apiKey', "id", "email", "uniqueName", "name"])
    const [user, setUser]=useState("")
    const userChatId = useRef()
    const chatInterval = useRef()
    const [yourMessage, setYourMessage]=useState("")
    const { onOpen, onClose, isOpen } = useDisclosure()
    const firstFieldRef = React.useRef(null)
    const time = React.useRef(0)

    useEffect(()=>{
        getUser()

        return () => {
            clearInterval( chatInterval.current);
        };
        
    },[])


    let getUser=async()=>{
        let response = await fetch(Commons.baseUrl+"/public/users/"+uniqueName)
        if(response.ok){
            let data = await response.json()
            getChat(data[0].id)
            setUser(data[0])
            userChatId.current = data[0].id
            chatInterval.current=setInterval( getChatInterval , 1000)
        }

    }

    let getChatInterval = () => {
        getChat(userChatId.current)
    }

    let getChat=async(id)=>{
        if(id!=undefined){
            let response = await fetch(Commons.baseUrl+"/messages/"+id+"?apiKey="+cookieObjectApiKey.apiKey+"&time="+time.current)
            if(response.ok){
                let data = await response.json()
                if(data.length>0){
                    messagesList.current = [...messagesList.current, ...data]
                    setMessages(messagesList.current)
                    time.current=data[data.length-1].date
                }

               
            }
        }
    
    } 
    let sendMessage=async(e)=>{
        if (e.charCode == 13 && yourMessage!= null){ 
            let response = await fetch (Commons.baseUrl+"/messages?apiKey="+cookieObjectApiKey.apiKey,{

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
    
                body:
                    JSON.stringify({ 
                        idReceiver:user.id,
                        message:yourMessage
                    })
            })
            if(response.ok){
               setYourMessage("")
               getUser()
               setMessages([])
            }
        }
        

    }
    let deleteChat=async()=>{
        let response = await fetch (Commons.baseUrl+"/messages?companionId="+user.id+"&apiKey="+cookieObjectApiKey.apiKey,{
            method: 'DELETE' 
        })
        if(response.ok){
            messagesList.current=[]
            getUser()
            setMessages([])
        }
    }
    return(
        <Box display={"flex"} justifyContent={"center"}>
            <Box borderRadius={"lg"} h={["85vh"]} w={["90%", "90%", "50%", "40%", "30%"]} borderWidth={"2px"}>
                <Box  justifyContent={"space-between"} pl={"20px"} pr={"20px"} alignItems={"center"} display={"flex"} borderBottomWidth={"1px"} h={"6%"} >
                   <Box onClick={()=>{navigate('/users/yourDialogues')}}  w={"20%"} color={"gray"} alignItems={"center"} display={"flex"}>
                        <Button variant='link'>
                            <ChevronLeftIcon/>
                            <Text  fontSize={"15px"}>back</Text>
                        </Button>
                   </Box>
                   <Box display={"flex"} flexDirection={"column"}  alignItems={"center"} w={"60%"}>
                       <Text color="black" fontSize={"15px"}>{user.uniqueName}</Text>
                   </Box>
                   <Box w={"15%"} color={"grey"} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                        <Popover    
                            isOpen={isOpen}
                            initialFocusRef={firstFieldRef}
                            onOpen={onOpen}
                            onClose={onClose}>
                            <PopoverTrigger>
                            <EllipsisOutlined style={{ fontSize: '20px' }}/>
                            </PopoverTrigger>
                            <Portal>
                                <PopoverContent>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverBody>
                                    <Button onClick={() => {deleteChat(); onClose();}} colorScheme='red' variant='link' >
                                        Delete chat 
                                    </Button>
                                </PopoverBody>
                                </PopoverContent>
                            </Portal>
                        </Popover>
                        <Avatar   onClick={()=>{navigate('/users/'+user.uniqueName)}}  src={Commons.baseUrl+"/images/"+user.id +"avatar.png"}   size={"sm"}></Avatar>
                   </Box>
                </Box>
                <Box overflowY="scroll" p={"10px"} borderBottomWidth={"2px"} h={"85%"} >
                {messages.sort((a,b)=>a.messageId-b.messageId)
                .map((message)=>
                 <Box mb={"10px"} w={"100%"} display={"flex"}>
                    <Avatar onClick={()=>{navigate('/users/'+message.uniqueName)}} src={Commons.baseUrl+"/images/"+message.userId +"avatar.png"}  ></Avatar>
                    <Box  ml={"10px"}  >
                        <Box alignItems={"center"} display={"flex"} >
                            <Text>{message.uniqueName}</Text>
                            <Text ml={"5px"} fontSize={"10px"} color="grey">{FormatDate(message.date)}</Text>
                        </Box> 
                        <Text fontSize={"13px"}  color="grey" >{message.message}</Text>
                    </Box> 
                </Box>      
                )}
                </Box>
                <Box  color={"gray"}  alignItems={"center"} display={"flex"} pl={"20px"} pr={"20px"} h={"10%"} >
                    <Input value={yourMessage} onChange={(e)=>{setYourMessage(e.target.value)}} onKeyPress={(e)=>sendMessage(e)} w="100%" placeholder="Write your message..."/>
                </Box>
            </Box>
        </Box>
    )
}