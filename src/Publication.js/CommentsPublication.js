
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


export default function CommentsPublication (props){

    const {postId} = useParams()
    const [comments, setComments]=useState([])


    useEffect (()=>{ 
        getComments()
    },[])


    let getComments=async()=>{

        let response = await fetch(Commons.baseUrl+"/comments/"+postId)
        if(response.ok){
            let data = await response.json()
            if(!data.error){
                setComments(data)
            }
        }
    }
return(
    <Box pt={"200px"}>
        {comments.map((comment)=><Text>{comment.comment}</Text>)}
    </Box>
)

}