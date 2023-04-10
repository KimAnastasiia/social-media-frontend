
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
import { DeleteIcon, AddIcon, WarningIcon } from '@chakra-ui/icons'

export default function CommentsPublication (props){

    const {postId} = useParams()
    const [commentsUsers, setCommentsUsers]=useState([])
    const [cookieObjectApiKey, setObjectApiKey, removeCookiObjectApiKey] = useCookies(['apiKey', "id", "email"]);

    useEffect (()=>{ 
        getComments()
    },[])


    let getComments=async()=>{
        if(props.postId){

            let response = await fetch(Commons.baseUrl+"/comments/"+props.postId)
            if(response.ok){
                let data = await response.json()
                if(!data.error){
                    setCommentsUsers(data)
                }
            }
        }
        if(!props.postId){
            
            let response = await fetch(Commons.baseUrl+"/comments/"+postId)
            if(response.ok){
                let data = await response.json()
                if(!data.error){
                    setCommentsUsers(data)
                }
            }
        }
    }
return(
    <Box pt={"10px"} >
        {commentsUsers.map((commentUser)=>
        <Box borderWidth={"1px"} mb={"10px"}  borderRadius={"lg"} display={"flex"} justifyContent={"space-between"} >
            <Box>
                <Box display={"flex"}>
                    <Avatar size={"xs"} name={commentUser.uniqueName}></Avatar>
                    <Text ml={"10px"} >{commentUser.uniqueName}</Text>
                </Box>
                <Text>{commentUser.comment}</Text>
            </Box>
            <Box alignItems={"center"} display={"flex"} >
                {(cookieObjectApiKey.id == commentUser.userId) &&
                    <DeleteIcon/>
                }
            </Box>
        </Box>
        )}
    </Box>
)

}