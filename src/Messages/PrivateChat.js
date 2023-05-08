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
export default function PrivateChat(props){
    const navigate  = useNavigate();
    const [messages, setMessages]=useState([])
    const {uniqueName} = useParams()
    const [cookieObjectApiKey, setCookieObjectApiKey, removeCookiObjectApiKey] = useCookies(['apiKey', "id", "email", "uniqueName", "name"])
    const [user, setUser]=useState("")
    const [yourMessage, setYourMessage]=useState("")
    useEffect(()=>{
        getUser()
    },[])

    let getUser=async()=>{
        let response = await fetch(Commons.baseUrl+"/public/users/"+uniqueName)
        if(response.ok){
            let data = await response.json()
            getChat(data[0].id)
            setUser(data[0])
        }

    }
    let getChat=async(id)=>{
        let response = await fetch(Commons.baseUrl+"/messages/"+id+"?apiKey="+cookieObjectApiKey.apiKey)
        if(response.ok){
            let data = await response.json()
            setMessages(data)
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
            }
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
                       <Text color="grey" fontSize={"13px"}>was online 32 minutes ago</Text>
                   </Box>
                   <Box w={"17%"} color={"grey"} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                        <PhoneOutlined style={{ fontSize: '20px' }}/>
                        <EllipsisOutlined style={{ fontSize: '20px' }}/>
                        <Avatar   onClick={()=>{navigate('/users/'+user.uniqueName)}}  src={Commons.baseUrl+"/images/"+user.id +"avatar.png"}   size={"sm"}></Avatar>
                   </Box>
                </Box>
                <Box overflowY="scroll" p={"10px"} borderBottomWidth={"2px"} h={"85%"} >
                {messages.sort((a,b)=>b.messageId-a.messageId)
                .map((message)=>
                 <Box mb={"10px"} w={"100%"} display={"flex"}>
                    <Avatar onClick={()=>{navigate('/users/'+message.uniqueName)}} src={Commons.baseUrl+"/images/"+message.userId +"avatar.png"}  ></Avatar>
                    <Box  ml={"10px"} w={"20%"} >
                        <Box alignItems={"center"} display={"flex"} justifyContent={"space-between"}>
                            <Text>{message.uniqueName}</Text>
                            <Text fontSize={"13px"} color="grey">{FormatDate(message.date)}</Text>
                        </Box> 
                        <Text fontSize={"13px"}  color="grey" >{message.message}</Text>
                    </Box> 
                </Box>      
                )}
                </Box>
                <Box  color={"gray"}  alignItems={"center"} display={"flex"} pl={"20px"} pr={"20px"} h={"10%"} >

                    <AttachmentIcon fontSize={"20px"}/>
                    <InputGroup  ml={"10px"} mr={"10px"} size="md" >
                        <Input value={yourMessage} onChange={(e)=>{setYourMessage(e.target.value)}} onKeyPress={(e)=>sendMessage(e)} w="100%" placeholder="Write your message..."/>
                        <InputRightElement
                            w="13%"
                            h={"100%"}
                            pointerEvents='none'
                            children={
                                <Box w={"100%"} justifyContent={"space-around"}  display={"flex"}>
                                    <CameraOutlined style={{ fontSize: '20px' }}  />
                                    <SmileOutlined style={{ fontSize: '20px' }}  />
                                 </Box>
                        }
                        />
                    </InputGroup>
                    <AudioOutlined style={{ fontSize: '20px' }} />
                </Box>
            </Box>
        </Box>
    )
}