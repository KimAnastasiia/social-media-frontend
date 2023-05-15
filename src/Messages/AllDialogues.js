import React,{useState, useEffect,useRef} from "react"
import { Box, Flex, Text, Button, Stack, Img, HStack,Avatar,Hide,Show ,Input,InputGroup,InputLeftElement,Alert,
    Image,
    AlertTitle,
    AlertDescription,
 } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Commons from "../Utility/Commons";
import { useCookies } from 'react-cookie'; 
import { useNavigate   } from "react-router-dom";
import { useParams } from "react-router-dom";
import {Search2Icon } from '@chakra-ui/icons'
import FormatDate from "../Utility/FormatDate";

export default function AllDialogues(props){

    const [cookieObjectApiKey, setCookieObjectApiKey, removeCookiObjectApiKey] = useCookies(['apiKey', "id", "email", "uniqueName", "name"])
    const [dialogues, setDialogues]=useState([])
    const navigate  = useNavigate();
    const [search, setSearch]=useState("")
    const dialoguesInterval = useRef()
    useEffect(()=>{
        dialoguesInterval.current=setInterval( getDialogues , 1000)
        getDialogues()
        return () => {
            clearInterval( dialoguesInterval.current);
        };
    },[])

    let getDialogues=async()=>{
        console.log("A")
        let response = await fetch(Commons.baseUrl+"/messages/dialogues?apiKey="+cookieObjectApiKey.apiKey)
        if(response.ok){
            let data = await response.json()
            setDialogues(data)
        }
    
    } 
    return(
        <Box display={"flex"} justifyContent={"center"}>
            <Box borderRadius={"lg"}  minH={["85vh"]}   w={["90%", "90%", "50%", "40%", "30%"]} borderWidth={"2px"}>
                <Box  justifyContent={"space-between"} pl={"20px"} pr={"20px"} alignItems={"center"} display={"flex"} borderBottomWidth={"1px"} h={"5%"} >
                    <Search2Icon color={"gray"}/>
                    <Input id="inputChats" onChange={(e)=>{setSearch(e.target.value)}} ml={"20px"}  variant='unstyled' border={"none"} placeholder="Search"></Input>
                </Box>
               {dialogues.length>0 &&
                <Box  h={"95%"}  overflowY="scroll">
                    {dialogues.filter((message)=>{
                        if(message.receiver_uniqueName.includes(search)){
                            return message
                        }
                        if(message.sender_uniqueName.includes(search)){
                            return message
                        }
                    })
                    .map((message)=>

                    <Box display={"flex"} m={"20px"}>
                        {message.idSender!= cookieObjectApiKey.id && 
                        <Box w={"100%"} display={"flex"} onClick={()=>{navigate('/users/chat/'+message.sender_uniqueName)}} >
                            <Avatar src={Commons.baseUrl+"/images/"+message.idSender +"avatar.png"} ></Avatar>
                            <Box ml={"10px"} w={"80%"} borderBottomWidth={"2px"}>
                                <Box display={"flex"} justifyContent={"space-between"}>
                                    {message.sender_uniqueName!=cookieObjectApiKey.uniqueName && <Text>{message.sender_uniqueName}</Text>}
                                    
                                </Box> 
                                <Text fontSize={"13px"}  color="grey" >{message.message}</Text>
                            </Box> 
                    </Box>}
                    {message.idReceiver != cookieObjectApiKey.id  && 
                        <Box w={"100%"} display={"flex"} onClick={()=>{navigate('/users/chat/'+message.receiver_uniqueName)}}>
                            <Avatar src={Commons.baseUrl+"/images/"+message.idReceiver+"avatar.png"} ></Avatar>
                            <Box  ml={"10px"} w={"80%"} borderBottomWidth={"2px"}>
                                <Box display={"flex"} justifyContent={"space-between"}>
                                    {message.receiver_uniqueName!=cookieObjectApiKey.uniqueName && <Text>{message.receiver_uniqueName}</Text>}
                                   
                                </Box> 
                                <Text fontSize={"13px"}  color="grey" >{message.message}</Text>
                            </Box> 
                        </Box>
                    }
                    </Box>  
                    )}
                </Box>}
               {dialogues.length==0 && <Box  h="90%" display={"flex"} justifyContent={"center"} alignItems={"center"}>
                    <Text color={"gray"} fontSize={"30px"}>You dont have any chat yet</Text>
                </Box>}
            </Box>
        </Box>
    )
}