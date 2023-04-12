
import React,{useState, useEffect, useRef} from "react"
import { Box, Flex, Text, Button, Stack, Img, HStack,Avatar,Hide,Show ,Input,InputGroup,InputLeftElement,Alert,
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
import { DeleteIcon, EditIcon, WarningIcon } from '@chakra-ui/icons'

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
    <Box pt={"100px"} >
        {props.commentsUsers.sort((a,b)=>b.date-a.date)
        .map((commentUser)=>
        <Box borderWidth={"1px"} mb={"10px"} minH={["7vh"]} borderRadius={"lg"} display={"flex"} justifyContent={"space-between"} >
            <Box m={"10px"} w={"50%"} flexDirection={"column"} display={"flex"} justifyContent={"space-around"}>
                <Box display={"flex"} >
                    <Avatar size={"xs"} name={commentUser.uniqueName}></Avatar>
                    <Text ml={"10px"} >{commentUser.uniqueName}</Text>
                </Box>
                <Text>{commentUser.comment}</Text>
            </Box>
            <Box m={"10px"} w={"30%"} justifyContent={"space-around"} display={"flex"} alignItems={"end"} flexDirection={"column"}>
                    <Text>{FormatDate(commentUser.date)}</Text>
                {(cookieObjectApiKey.id == commentUser.userId) &&
                <Box w={"30%"} justifyContent={"space-around"} display={"flex"}  >
                    <EditIcon/>
                    <DeleteIcon onClick={()=>{deleteComment(commentUser)}} />
                </Box>
                }
            </Box>
        </Box>
        )}
    </Box>
)

}