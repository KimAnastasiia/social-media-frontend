
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
    PopoverAnchor,Portal,useDisclosure,InputRightElement
  } from '@chakra-ui/react'
import Commons from "../Utility/Commons";
import {MessageOutlined ,SmileOutlined,SendOutlined,HeartOutlined,EllipsisOutlined,BookOutlined} from '@ant-design/icons';
import { useCookies } from 'react-cookie'; 
import { useNavigate   } from "react-router-dom";
import { useParams } from "react-router-dom";
import FormatDate from "../Utility/FormatDate";
import CommentsPublication from "./CommentsPublication";
import { ChevronLeftIcon} from '@chakra-ui/icons'
import Icon, { HomeOutlined } from '@ant-design/icons';

export default function PublicationDetails (props){
  
    const {id} = useParams()
    const [name, setName]=useState("")
    const navigate  = useNavigate();
    const [cookieObjectApiKey, setCookieObjectApiKey, removeCookiObjectApiKey] = useCookies(['apiKey', "id", "email", "uniqueName"]);
    const [publication, setPublication]=useState({})
    const [comment, setComment]=useState("")
    const [commentsUsers, setCommentsUsers]=useState([])
    const [showComments, setShowComments]=useState(false)
    const [postLikes, setPostLikes]=useState(0)
    let userIdOfPublication=useRef(0)
    const [myLike, setMyLike]=useState([])

    let colorDarkBlue = "#142C8E"
    let colorLightBlue = "#B4DCFF"
    useEffect (()=>{ 
        dataOfpublication()
        numberOfLikes()
        myLikeOnPost()
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

        let response = await fetch(Commons.baseUrl+"/public/users?id="+p)
        if(response.ok){
            let data = await response.json()
            if(!data.error){
                setName(data[0].uniqueName)
            }
        }
    }
    let addComment=async()=>{
       if(comment.length>0)     {        
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
        }}
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
        myLikeOnPost()
    }
    let numberOfLikes=async()=>{
        let response = await fetch(Commons.baseUrl+"/public/postLikes/"+id)
        if(response.ok){
            let data = await response.json()
            if(!data.error){
                setPostLikes(data.rowsCount[0].totalLikes)
            }
        }
    }
    let myLikeOnPost=async()=>{
        let response = await fetch(Commons.baseUrl+"/postLikes/"+id+"?apiKey="+cookieObjectApiKey.apiKey)
        if(response.ok){
            let data = await response.json()
            if(!data.error){
                setMyLike(data)
            }
        }
    }
    const HeartSvg = () => (
        <svg width="1em" height="1em" fill="white" viewBox="0 0 1024 1024" >
          <path  stroke="black" stroke-width="40"  d="M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9z" />
        </svg>
    );
    const HeartSvgRed = () => (
        <svg width="1em" height="1em" fill="red" viewBox="0 0 1024 1024" >
          <path  stroke="black"  d="M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9z" />
        </svg>
    );

    return(
        <div>

        <Box display={["none","none","flex","flex","flex",]} justifyContent={"center"} >
            <Box w={["none","none","60%","48%","40%","30%"]} bg={"black"} justifyContent={"center"} display={"flex"}> 
                <Image src={Commons.baseUrl+"/images/"+ publication.userId+id+"big.png"} />
            </Box>
            <Box display={"flex"} flexDirection={"column"} justifyContent={"space-between"} borderWidth={"2px"} w={["none","none","40%","52%","60%","30%"]} >
                    <Box w={"100%"} h={"85%"} >
                        <Box borderBottomWidth={"2px"} h={"12%"} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                            <Box  pl={"2%"} w={"100%"} display={"flex"} justifyContent={"start"} alignItems={"center"} >
                                <Avatar src={Commons.baseUrl+"/images/"+publication.userId+"avatar.png"} onClick={()=>{navigate("/users/"+name)}}  size={"md"}></Avatar>
                                <Box ml={"5px"}>
                                    <Button  variant='link' color={"black"} onClick={()=>{navigate("/users/"+name)}}>{name}</Button>
                                    <Text fontSize={"xs"} fontWeight={"bold"} >{publication.comment} </Text>
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
                    
                        <Box pr={"2%"} pl={"2%"} h={"88%"} overflowY="scroll">
                            <CommentsPublication 
                                getComments={getComments} 
                                commentsUsers={commentsUsers} 
                                setCommentsUsers={setCommentsUsers} 
                                postId={id}
                                userIdOfPublication={userIdOfPublication.current}
                            />
                        </Box>
                    </Box>
               
                    <Box  borderTopWidth={"2px"} display={"flex"} h={"15%"}  flexDirection={"column"} >
                        <Box zIndex={"sticky"} pl={"2%"} pr={"2%"} h={"70%"} >
                            <Box h={"60%"} display={"flex"} alignItems={"center"} justifyContent={"start"}>
                                
                                    <Text fontSize={"21px"}fontWeight={"bold"} >{postLikes}</Text>
                                    { !cookieObjectApiKey.apiKey &&
                                        <Icon component={HeartSvg} style={{
                                            fontSize: "30px",
                                        }} />
                                    }

                                    {( myLike.length>0 && cookieObjectApiKey.apiKey) &&  
                                        <Box onClick={likePost} >
                                            <Icon component={HeartSvgRed} style={{
                                                    fontSize: "30px",
                                                }} /> 
                                        </Box>
                                    }

                                    { (myLike.length==0 && cookieObjectApiKey.apiKey) &&    
                                        <Box onClick={likePost} >
                                            <Icon component={HeartSvg} style={{
                                                        fontSize: "30px",
                                                    }} />
                                        </Box>
                                    }
                            </Box>
                            <Box  h={"10%"} alignItems={"center"}  display={"flex"}>
                                <Text fontSize={"12px"}>{FormatDate (publication.date)}</Text>
                            </Box>
                        </Box>

                      
                        <Box display={"flex"} alignItems={"end"} h={"30%"} >
                           {cookieObjectApiKey.apiKey &&     
                           <Box  display={"flex"} alignItems={"end"} w={"100%"}  borderTopWidth={"2px"} >
                                <InputGroup size='md'> 
                                    <Input border={"none"} onChange={(e)=>{setComment(e.target.value)}}  value={comment} pr='4.5rem'w="100%" placeholder="Add a comment"/>
                                    <InputRightElement width='4.5rem'>
                                        <Button display={["block"]}  bg={colorDarkBlue }  color={"white"} onClick={addComment} h='1.75rem' size='sm' >
                                            sent
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </Box>}
                            {!cookieObjectApiKey.apiKey && 
                                <Box  display={"flex"} alignItems={"center"} justifyContent={"center"} w={"100%"}  borderTopWidth={"2px"} >
                                    <Button bg={colorDarkBlue} size={"xs"}  onClick={()=>{navigate("/")}} color="white" fontWeight={"bold"}>Log in to write a comment</Button>
                                </Box>
                            }
                        </Box>
                        
                        
                </Box>
            </Box>
        </Box>

  
        {!showComments &&
            <Box  minH={["89vh"]}  display={["block","block","none","none","none",]} w={"100%"} >
                    <Box borderTopWidth={"2px"}pt={"10px"} pb={"10px"} h={"10%"} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                        <Box  pl={"2%"} w={"100%"} display={"flex"} justifyContent={"start"} alignItems={"center"} >
                            <Avatar src={Commons.baseUrl+"/images/"+publication.userId+"avatar.png"} size={"md"}  onClick={()=>{navigate("/users/"+name)}}></Avatar>
                            <Button  variant='link' color={"black"} onClick={()=>{navigate("/users/"+name)}} ml={"4%"}>{name}</Button>
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
                    <Box h={"73%"} >
                        <Image src={Commons.baseUrl+"/images/"+ publication.userId+id+"big.png"} />
                    </Box>
                    <Box  pb={"10px"} pl={"2%"} pr={"2%"}  justifyContent={"flex-start"} h={"8%"} >
                        <Box w={"20%"} mb={"10px"}  h={"75%"} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                            <Box display={"flex"} alignItems={"center"} >
                                <Text fontSize={"21px"}fontWeight={"bold"} >{postLikes}</Text>
                                { !cookieObjectApiKey.apiKey &&
                                      <Icon component={HeartSvg} style={{
                                        fontSize: "30px",
                                    }} />
                                }

                                {( myLike.length>0 && cookieObjectApiKey.apiKey) &&
                                    <Box onClick={likePost} >
                                        <Icon component={HeartSvgRed} style={{
                                                fontSize: "30px",
                                            }} /> 
                                    </Box>
                                }

                                {(cookieObjectApiKey.apiKey && myLike.length==0) &&    
                                    <Box onClick={likePost} >
                                        <Icon component={HeartSvg} style={{
                                                    fontSize: "30px",
                                                }} />
                                    </Box>
                                }
                            </Box>
                            <MessageOutlined onClick={onClickCommentsButton} style={{ fontSize: '25px' }}/>
                        </Box>
                       
                        <Box h={"25%"}>
                            <Text fontSize={"12px"}>{FormatDate (publication.date)}</Text>
                        </Box >
                    </Box>
            </Box>}
            {showComments && 
            <Box borderBottomWidth={"2px"}  >
                <Box pb={"20px"}  borderBottomWidth={"2px"} flexDirection={"column"} display={"flex"} alignItems={"center"}  pr={"20px"}  pl={"20px"} >
                    <Box w={"100%"}  display={"flex"} justifyContent={"flex-start"}>
                        <Button  variant='link'>
                            <ChevronLeftIcon onClick={onClickCommentsButton}  fontSize={"25px"}/>
                        </Button>
                    </Box>
                    <Text fontSize={"20px"} fontWeight={"bold"} >COMMENTS</Text>
                </Box>
                <Box pr={"2%"} pl={"2%"} borderBottomWidth={"2px"}  minH={["78vh"]} overflowY="scroll">
                    <CommentsPublication 
                        getComments={getComments} 
                        commentsUsers={commentsUsers} 
                        setCommentsUsers={setCommentsUsers} 
                        postId={id}
                        userIdOfPublication={userIdOfPublication.current}
                        />
                </Box>
                <Box display={"flex"} alignItems={"center"} h={"50px"} >
                    <Input ml={"10px"} variant='unstyled' value={comment} onChange={(e)=>{setComment(e.target.value)}} border={"none"} placeholder="Add a comment"></Input>
                    <Button bg={colorDarkBlue }  color={"white"} onClick={addComment} >sent</Button>
                </Box>
            </Box >
            }
        </div>
    )
}