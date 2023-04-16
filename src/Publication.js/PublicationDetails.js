
import React,{useState, useEffect,useRef} from "react"
import { Box, Flex, Text, Button, Stack, Img, HStack,Avatar,Hide,Show ,Input,InputGroup,InputLeftElement,Alert,
    Image,
    AlertTitle,
    AlertDescription,
 } from "@chakra-ui/react";
import { Link } from "react-router-dom";
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
import Commons from "../Utility/Commons";
import {MessageOutlined ,SmileOutlined,SendOutlined,HeartOutlined,EllipsisOutlined,BookOutlined} from '@ant-design/icons';
import { useCookies } from 'react-cookie'; 
import { useNavigate   } from "react-router-dom";
import { useParams } from "react-router-dom";
import FormatDate from "../Utility/FormatDate";
import CommentsPublication from "./CommentsPublication";
import { ChevronLeftIcon} from '@chakra-ui/icons'

export default function PublicationDetails (props){
  
    const {id} = useParams()
    const [name, setName]=useState("")
    const [userEmail, setUserEmail]=useState("")
    const navigate  = useNavigate();
    const [cookieObjectApiKey, setObjectApiKey, removeCookiObjectApiKey] = useCookies(['apiKey', "id", "email", "uniqueName"]);
    const [publication, setPublication]=useState({})
    const [comment, setComment]=useState("")
    const [commentsUsers, setCommentsUsers]=useState([])
    const [showComments, setShowComments]=useState(false)
    const [postLikes, setPostLikes]=useState(0)
    let userIdOfPublication=useRef(0)

    useEffect (()=>{ 
        dataOfpublication()
        numberOfLikes()
    },[])


    let getComments=async()=>{
        let response = await fetch(Commons.baseUrl+"/likes?apiKey="+cookieObjectApiKey.apiKey)
        if(response.ok){
            let listOfMyLikes = await response.json()
            if(!listOfMyLikes.error){
                // listOfMyLikes  all the likes of my User  like.commentID

                response = await fetch(Commons.baseUrl+"/public/comments/"+id)
                if(response.ok){
                    let allComments = await response.json()
                    if(!allComments.error){
                       
                        let modifyCommentsUsers = allComments.map((comment)=>{
                            
                            let myLikeInThisComment= listOfMyLikes.filter((myLike)=>comment.id==myLike.commentId)
                           
                            if (myLikeInThisComment.length == 0){
                                comment.likeOfMyUser = false
                            } else {
                                comment.likeOfMyUser = true
                            }
                            return comment
                        })
                        setCommentsUsers(modifyCommentsUsers)

                    }
                }
            }
        }
    }

    let dataOfpublication=async()=>{

        let response = await fetch(Commons.baseUrl+"/public/mediaPost/"+id)
        if(response.ok){
            let data = await response.json()
            if(!data.error){
                setPublication(data[0])
                getUser(data[0].userId)
                userIdOfPublication.current=data[0].userId
            }
        }
    }
    let getUser=async(p)=>{

        let response = await fetch(Commons.baseUrl+"/users?id="+p)
        if(response.ok){
            let data = await response.json()
            if(!data.error){
                setUserEmail(data[0].email)
                setName(data[0].uniqueName)
            }
        }
    }
    let addComment=async()=>{
        let response = await fetch (Commons.baseUrl+"/comments?apiKey="+cookieObjectApiKey.apiKey,{

            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body:
                JSON.stringify({ 
                    postId:id,
                    comment:comment
                })
        })
        if(response.ok){
            setComment("")
        }
        getComments();
    }
    let onClickCommentsButton=()=>{
        setShowComments(!showComments)
    }
    let deletePost=async()=>{
        let response = await fetch (Commons.baseUrl+"/mediaPost/"+id+"?apiKey="+cookieObjectApiKey.apiKey,{
            method: 'DELETE' 
        })
        if(response.ok){
            navigate("/users/"+cookieObjectApiKey.uniqueName)
        }
    }
    let likePost=async()=>{
        let response = await fetch (Commons.baseUrl+"/postLikes?apiKey="+cookieObjectApiKey.apiKey,{

            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body:
                JSON.stringify({ 
                    postId:id
                })
        })
        numberOfLikes()
    }
    let numberOfLikes=async()=>{
        let response = await fetch(Commons.baseUrl+"/public/postLikes/"+id)
        if(response.ok){
            let data = await response.json()
            if(!data.error){
                setPostLikes(data[0].totalLikes)
            }
        }
    }
    return(
        <div>
        <Hide below="md" >
        <Box  justifyContent={"center"} display={["flex"]}  >
            <Box w={"30%"} bg={"black"} justifyContent={"center"} display={"flex"}> 
                <Image src={Commons.baseUrl+"/images/"+ publication.userId+userEmail+id+"big.png"} />
            </Box>
            <Box borderWidth={"3px"} borderColor={"black"} w={"30%"} >
                    <Box borderBottomWidth={"2px"} h={"10%"} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                        <Box  pl={"2%"} w={"100%"} display={"flex"} justifyContent={"start"} alignItems={"center"} >
                            <Avatar size={"md"}></Avatar>
                        <Box ml={"4%"}>
                            <Text>{name}</Text>
                            <Text fontSize={"xs"} fontWeight={"bold"} >{publication.comment} b</Text>
                        </Box>
                        </Box>

                    {(cookieObjectApiKey.id == userIdOfPublication.current) && <Box  pr={"2%"}  >
                    <Popover>
                            <PopoverTrigger>
                            <EllipsisOutlined style={{ fontSize: '20px' }}/>
                            </PopoverTrigger>
                            <Portal>
                                <PopoverContent>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverBody>
                                    <Button colorScheme='red' variant='link' onClick={deletePost}  >
                                        Delete
                                    </Button>
                                </PopoverBody>
                                </PopoverContent>
                            </Portal>
                        </Popover>
                        </Box>}
                    </Box>
                    <Box pr={"2%"} pl={"2%"} borderBottomWidth={"2px"} h={"530px"} overflowY="scroll">
                        <CommentsPublication 
                            getComments={getComments} 
                            commentsUsers={commentsUsers} 
                            setCommentsUsers={setCommentsUsers} 
                            postId={id}
                            userIdOfPublication={userIdOfPublication.current}
                           />
                    </Box>
                    <Box zIndex={"sticky"} pl={"2%"} pr={"2%"}  justifyContent={"flex-start"} h={"15%"} >
                        <Box  h={"40%"} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                            <Box w={"18%"} justifyContent={"space-around"} display={"flex"} alignItems={"center"}>
                                <Text fontSize={"21px"}fontWeight={"bold"} >{postLikes}</Text>
                                <HeartOutlined  onClick={likePost} style={{ fontSize: '25px' }} />
                                <SendOutlined style={{ fontSize: '25px' }}/>
                            </Box>
                            <Box   w={"70%"} display={"flex"} justifyContent={"end"}>
                                <BookOutlined style={{ fontSize: '25px' }}/>
                            </Box>
                        </Box>
                        <Box h={"35%"} display={"flex"} justifyContent={"flex-start"}>
                            <Avatar mr={"1%"} size={"sm"}></Avatar>
                            <Text fontSize={"20px"}>names of users which liked this publication</Text>
                        </Box>
                        <Box h={"25%"}>
                            <Text fontSize={"12px"}>{FormatDate (publication.date)}</Text>
                        </Box>
                    </Box>
                    <Box borderTopWidth={"2px"} display={"flex"} alignItems={"center"} h={"5%"} >
                        <Box w={"10%"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                            <SmileOutlined style={{ fontSize: '25px' }}/>
                        </Box>
                        
                        <Input  variant='unstyled'  value={comment} onChange={(e)=>{setComment(e.target.value)}} border={"none"} placeholder="Add a comment"></Input>
                        <Button onClick={addComment} colorScheme='teal' variant='link' >sent</Button>
                    </Box>
             
            </Box>
        </Box>
        </Hide>
        <Show below='md'>
        {!showComments &&
            <Box w={"100%"} >
                    <Box borderTopWidth={"2px"}pt={"10px"} pb={"10px"} borderBottomWidth={"2px"} h={"10%"} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                        <Box  pl={"2%"} w={"100%"} display={"flex"} justifyContent={"start"} alignItems={"center"} >
                            <Avatar size={"md"}></Avatar>
                            <Text ml={"4%"}>{name}</Text>
                        </Box>
                        <Box  pr={"2%"}  >
                            <EllipsisOutlined style={{ fontSize: '25px' }}/>
                        </Box>
                    </Box>
                    <Box h={"70%"} mb={"10px"}>
                        <Image src={Commons.baseUrl+"/images/"+ publication.userId+userEmail+id+"big.png"} />
                    </Box>
                    <Box pb={"10px"} borderBottomWidth={"2px"} pl={"2%"} pr={"2%"}  justifyContent={"flex-start"} h={"15%"} >
                        <Box mb={"10px"}  h={"40%"} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                            <Box alignItems={"center"}  w={"18%"} justifyContent={"space-between"} display={"flex"}>
                                <Text fontSize={"21px"}fontWeight={"bold"} >{postLikes}</Text>
                                <HeartOutlined style={{ fontSize: '25px' }} />
                                <MessageOutlined onClick={onClickCommentsButton} style={{ fontSize: '25px' }}/>
                                <SendOutlined style={{ fontSize: '25px' }}/>
                            </Box>
                            <Box   w={"70%"} display={"flex"} justifyContent={"end"}>
                                <BookOutlined style={{ fontSize: '25px' }}/>
                            </Box>
                        </Box>
                        <Box h={"35%"} display={"flex"} justifyContent={"flex-start"}>
                            <Avatar mr={"1%"} size={"sm"}></Avatar>
                            <Text fontSize={"20px"}>names of users which liked this publication</Text>
                        </Box>
                        <Box h={"25%"}>
                            <Text fontSize={"12px"}>{FormatDate (publication.date)}</Text>
                        </Box >
                    </Box>
            
             
            </Box>}
            {showComments && 
            <Box >
                <Box pb={"20px"}  borderBottomWidth={"2px"} display={"flex"} alignItems={"center"} justifyContent={"space-between"} pr={"20px"}  pl={"20px"} >
                    <Button  variant='link'>
                        <ChevronLeftIcon onClick={onClickCommentsButton}  fontSize={"25px"}/>
                    </Button>
                    <Text fontSize={"20px"} fontWeight={"bold"} >COMMENTS</Text>
                    <EllipsisOutlined style={{ fontSize: '25px' }}/>
                </Box>
                <Box pr={"2%"} pl={"2%"} borderBottomWidth={"2px"} h={"763px"} overflowY="scroll">
                    <CommentsPublication 
                        getComments={getComments} 
                        commentsUsers={commentsUsers} 
                        setCommentsUsers={setCommentsUsers} 
                        postId={id}
                        userIdOfPublication={userIdOfPublication.current}
                        />
                </Box>
                <Box   display={"flex"} alignItems={"center"} h={"50px"} >
                    <Box w={"10%"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                        <SmileOutlined style={{ fontSize: '25px' }}/>
                    </Box>
                    <Input  variant='unstyled' value={comment} onChange={(e)=>{setComment(e.target.value)}} border={"none"} placeholder="Add a comment"></Input>
                    <Button colorScheme='teal' variant='link' onClick={addComment}>sent</Button>
                </Box>
            </Box>
            }
        
        </Show>
        </div>
    )
}