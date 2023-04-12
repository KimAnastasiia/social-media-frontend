
import React,{useState, useEffect, useRef} from "react"
import { Box, Flex, Text, Button, Textarea, Img, HStack,Avatar,Hide,Show ,Input,InputGroup,InputLeftElement,Alert,
    Image,
    AlertTitle,
    AlertDescription,
 } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import Commons from "../Utility/Commons";
import {MessageOutlined ,SmileOutlined,SendOutlined,HeartOutlined,EllipsisOutlined,BookOutlined} from '@ant-design/icons';
import { useCookies } from 'react-cookie'; 
import { useNavigate   } from "react-router-dom";
import { useParams } from "react-router-dom";
import FormatDate from "../Utility/FormatDate";
import { DeleteIcon, EditIcon, CheckIcon } from '@chakra-ui/icons'
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,Portal
  } from '@chakra-ui/react'
export default function CommentsPublication (props){
    const [cookieObjectApiKey, setObjectApiKey, removeCookiObjectApiKey] = useCookies(['apiKey', "id", "email"]);

    useEffect (()=>{ 
        props.getComments()
    },[])


    let deleteComment=async(comment)=>{
        let response = await fetch (Commons.baseUrl+"/comments/"+comment.postId+"/"+comment.id+"?apiKey="+cookieObjectApiKey.apiKey,{
            method: 'DELETE' 
        })
        props.getComments()
    }
    
return(
    <Box pt={"100px"}   >
        {props.commentsUsers.sort((a,b)=>b.date-a.date)
        .map((commentUser)=>
        <Box >
            <Box mb={"10px"} minH={["7vh"]} display={"flex"} justifyContent={"space-between"} >
                <Box m={"10px"} w={"50%"} flexDirection={"column"} display={"flex"} justifyContent={"space-around"}>
                    <Box display={"flex"} >
                        <Avatar size={"xs"} name={commentUser.uniqueName}></Avatar>
                        <Text mr={"20px"} fontWeight={"bold"} ml={"10px"} >{commentUser.uniqueName}</Text>
                        <Text>{commentUser.comment}</Text>
                    </Box>
                    <Box display={"flex"} alignItems={"center"} >
                        <Text mr={"20px"} fontSize={"14px"} >{FormatDate(commentUser.date)}</Text>
                        {(cookieObjectApiKey.id == commentUser.userId) &&  
                        <Popover>
                            <PopoverTrigger>
                            <EllipsisOutlined style={{ fontSize: '20px' }}/>
                            </PopoverTrigger>
                            <Portal>
                                <PopoverContent>
                                <PopoverArrow />
                                <PopoverHeader>
                                    <Button colorScheme='blue' variant='link' >
                                        Edit
                                    </Button>  
                                </PopoverHeader>
                                <PopoverCloseButton />
                                <PopoverBody>
                                    <Button  colorScheme='red' variant='link'  onClick={()=>{deleteComment(commentUser)}} >
                                        Delete
                                    </Button>
                                </PopoverBody>
                                </PopoverContent>
                            </Portal>
                        </Popover>}
                    </Box>
                </Box>
            </Box>
           
        </Box>
        )}
    </Box>
)

}