
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
    const [showInputModify, setShowInputModify]=useState(false)
    const [modifiedComment, setModifiedComment]=useState("")
    let selectedCommentId = useRef(-1)

    useEffect (()=>{ 
        props.getComments()
    },[])

    let changeComment=(e)=>{
        setModifiedComment(e.target.value)
    }

    let deleteComment=async(comment)=>{
        let response = await fetch (Commons.baseUrl+"/comments/"+comment.postId+"/"+comment.id+"?apiKey="+cookieObjectApiKey.apiKey,{
            method: 'DELETE' 
        })
        props.getComments()
    }
    let updateComment=async(id)=>{

        let response = await fetch (Commons.baseUrl+"/comments/"+id+"?apiKey="+cookieObjectApiKey.apiKey,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                comment:modifiedComment,
                postId:props.postId
            })
        })
        setModifiedComment("")
        setShowInputModify(false)
        selectedCommentId.current =-1
        props.getComments()
    }
    let editComment=(data)=>{
        setShowInputModify(true)
        selectedCommentId.current = data.id
        setModifiedComment(data.comment) 
    }
return(
    <Box>
        {props.commentsUsers.sort((a,b)=>b.date-a.date)
        .map((commentUser)=>
        <Box >
            <Box mb={"10px"} minH={["7vh"]} display={"flex"} justifyContent={"space-between"} >
                <Box  m={"10px"} w={"100%"} flexDirection={"column"} display={"flex"} justifyContent={"space-around"}>
                    <Box display={"flex"}   >
                        <Avatar size={"xs"} name={commentUser.uniqueName}></Avatar>
                        <Text mr={"20px"} fontWeight={"bold"} ml={"10px"} >{commentUser.uniqueName}</Text>
                        {!showInputModify && <Text>{commentUser.comment}</Text>}
                        {(showInputModify && selectedCommentId.current == commentUser.id) &&
                        <Box display={"flex"} w={"100%"}>
                            <Textarea
                            value={modifiedComment}
                            onChange={changeComment}
                            />
                            <Button colorScheme='blue' variant='outline' onClick={()=>{updateComment(commentUser.id)}} ><CheckIcon/></Button>
                        </Box>
                        }

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
                                    <Button onClick={()=>{editComment(commentUser)}} colorScheme='blue' variant='link' >
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