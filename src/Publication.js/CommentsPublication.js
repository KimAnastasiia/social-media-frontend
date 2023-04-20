
import React,{useState, useEffect, useRef} from "react"
import { Box, Flex, Text, Button, Textarea, Img, HStack,Avatar,Hide,Show ,Input,InputGroup,InputLeftElement,Alert,
    Image,
    AlertTitle,
    AlertDescription,
 } from "@chakra-ui/react";
import { Link, Navigate } from "react-router-dom";
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
    PopoverAnchor,Portal,useDisclosure
  } from '@chakra-ui/react'
  import Icon, { HomeOutlined } from '@ant-design/icons';

export default function CommentsPublication (props){

    const [cookieObjectApiKey, setObjectApiKey, removeCookiObjectApiKey] = useCookies(['apiKey', "id", "email"]);
    const [modifiedComment, setModifiedComment]=useState("")
    let selectedCommentId = useRef(-1)
    const [listOfCountLikes, setListOfCountLikes]=useState([])
    const [allCommentsAndUsers, setAllCommentsAndUsers]=useState([])
    const navigate  = useNavigate();
    useEffect (()=>{ 
        props.getComments()
        coutLikes()
        getCommentsAndUsers()
    },[])

    let changeComment=(e)=>{
        setModifiedComment(e.target.value)
    }
   
    let coutLikes=async()=>{
        let response = await fetch(Commons.baseUrl+"/public/comments/")
        if(response.ok){
            let data = await response.json()
            if(!data.error){
                setListOfCountLikes(data)
            }
        }
    }
    let deleteComment=async(comment)=>{
        let response = await fetch (Commons.baseUrl+"/comments/"+comment.postId+"/"+comment.id+"/"+props.userIdOfPublication+"?apiKey="+cookieObjectApiKey.apiKey,{
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
        selectedCommentId.current =-1
        props.getComments()
    }
    let editComment=(data)=>{
        selectedCommentId.current = data.id
        setModifiedComment(data.comment) 
    }
    const HeartSvg = () => (
        <svg width="1em" height="1em" fill="white" viewBox="0 0 1024 1024" >
          <path  stroke="black" stroke-width="40"  d="M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9z" />
        </svg>
    );
    const HeartSvgRed = () => (
        <svg width="1em" height="1em" fill="red" viewBox="0 0 1024 1024" >
          <path  stroke="black" d="M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9z" />
        </svg>
    );

    let addLike=async(commentId)=>{
        let response = await fetch (Commons.baseUrl+"/likes?apiKey="+cookieObjectApiKey.apiKey,{

            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body:
                JSON.stringify({ 
                    postId:props.postId,
                    commentId:commentId
                })
        })
        props.getComments()
        coutLikes()
    }
    let getCommentsAndUsers=async()=>{
        let response = await fetch(Commons.baseUrl+"/public/comments/"+props.postId)
        if(response.ok){
            let data = await response.json()
            if(!data.error){
                setAllCommentsAndUsers(data)
            }
        }
    }
return(
    <Box>
        {cookieObjectApiKey.apiKey &&
        props.commentsUsers.sort((a,b)=>b.date-a.date)
        .map((commentUser)=>
        <Box >
            <Box mb={"10px"} minH={["7vh"]} display={"flex"} justifyContent={"space-between"} >
                <Box  m={"10px"} w={"100%"} flexDirection={"column"} display={"flex"} justifyContent={"space-around"}>
                    <Box display={"flex"}   >
                        <Avatar size={"xs"} onClick={()=>{navigate("/users/"+commentUser.uniqueName)}} name={commentUser.uniqueName}></Avatar>
                        <Button variant='link' color={"black"} onClick={()=>{navigate("/users/"+commentUser.uniqueName)}}  mr={"20px"} fontWeight={"bold"} ml={"10px"} >{commentUser.uniqueName}</Button>
                        {(selectedCommentId.current != commentUser.id ) && <Text>{commentUser.comment}</Text>}
                        {( selectedCommentId.current == commentUser.id) &&
                        <Box display={"flex"} w={"100%"}>
                            <Textarea
                            value={modifiedComment}
                            onChange={changeComment}
                            />
                            <Button colorScheme='blue' variant='outline' onClick={()=>{updateComment(commentUser.id)}} ><CheckIcon/></Button>
                        </Box>
                        }

                    </Box>
                    <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} >
                        <Box display={"flex"} alignItems={"center"}>
                        <Text mr={"20px"} fontSize={"14px"} >{FormatDate(commentUser.date)}</Text>
                        {(cookieObjectApiKey.id == commentUser.userId ) &&  
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
                                    <Button colorScheme='red' variant='link'  onClick={()=>{deleteComment(commentUser)}} >
                                        Delete
                                    </Button>
                                </PopoverBody>
                                </PopoverContent>
                            </Portal>
                        </Popover>
                        }

                        {(cookieObjectApiKey.id == props.userIdOfPublication && cookieObjectApiKey.id != commentUser.userId) &&  
                        <Popover>
                            <PopoverTrigger>
                            <EllipsisOutlined style={{ fontSize: '20px' }}/>
                            </PopoverTrigger>
                            <Portal>
                                <PopoverContent>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverBody>
                                    <Button colorScheme='red' variant='link'  onClick={()=>{deleteComment(commentUser)}} >
                                        Delete
                                    </Button>
                                </PopoverBody>
                                </PopoverContent>
                            </Portal>
                        </Popover>
                        }
                        </Box>
                        <Box display={"flex"} alignItems={"center"}>
                            {listOfCountLikes.map((d)=>{
                                if(d.id==commentUser.id){
                                    return <Text>{d.totalLikes}</Text>
                                }
                            })}
                                <Box display={"flex"} alignItems={"center"} onClick={()=>{addLike(commentUser.id)}} >

                                    { commentUser.likeOfMyUser == true && 
                                        <Icon component={HeartSvgRed} style={{
                                            fontSize: "20px",
                                        }} />                         
                                    }
                                    { commentUser.likeOfMyUser == false && 
                                        <Icon component={HeartSvg} style={{
                                            fontSize: "20px",
                                        }} />                         
                                    }
                              </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
        )}
        {!cookieObjectApiKey.apiKey && 
        allCommentsAndUsers.map((commentUser)=>
        <Box >
        <Box mb={"10px"} minH={["7vh"]} display={"flex"} justifyContent={"space-between"} >
            <Box  m={"10px"} w={"100%"} flexDirection={"column"} display={"flex"} justifyContent={"space-around"}>
                <Box display={"flex"}   >
                    <Avatar onClick={()=>{navigate("/users/"+commentUser.uniqueName)}}  size={"xs"} name={commentUser.uniqueName}></Avatar>
                    <Button variant={"link"} color={"black"} onClick={()=>{navigate("/users/"+commentUser.uniqueName)}}   mr={"20px"} fontWeight={"bold"} ml={"10px"} >{commentUser.uniqueName}</Button>
                    {(selectedCommentId.current != commentUser.id ) && <Text>{commentUser.comment}</Text>}

                </Box>
                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} >
                    <Box display={"flex"} alignItems={"center"}>
                    <Text mr={"20px"} fontSize={"14px"} >{FormatDate(commentUser.date)}</Text>
                    </Box>
                    <Box display={"flex"} alignItems={"center"}>
                        {listOfCountLikes.map((d)=>{
                            if(d.id==commentUser.id){
                                return <Text>{d.totalLikes}</Text>
                            }
                        })}
                        <Icon component={HeartSvg} style={{
                                fontSize: "20px"
                        }} />
                    </Box>
                </Box>
            </Box>
        </Box>
    </Box>
        )}
    </Box>
)

}