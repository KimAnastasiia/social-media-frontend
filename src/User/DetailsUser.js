
import React,{useState, useEffect,useRef} from "react"
import { Box, Flex, Text, Button, Stack, Img, HStack,Avatar,Hide,Show ,Input,InputGroup,InputLeftElement,Alert,
    Image,
    AlertTitle,
    AlertDescription,
 } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import Commons from "../Utility/Commons";
import {SettingOutlined ,SmileOutlined,SendOutlined,HeartOutlined,EllipsisOutlined,BookOutlined} from '@ant-design/icons';
import { useCookies } from 'react-cookie'; 
import { useNavigate   } from "react-router-dom";
import { useParams } from "react-router-dom";
import FormatDate from "../Utility/FormatDate";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,AlertDialogCloseButton,useDisclosure
  } from '@chakra-ui/react'
export default function DetailsUser(props){

    const [publications, setPublications]=useState(0)
    const [followers, setFollowers]=useState(0)
    const [following, setFollowing]=useState(0)
    const [follow, setFollow]=useState()

    const [posts, setPosts]=useState([])
    const [user, setUser]=useState({})
    const [avatarExist, setAvatarExist]=useState(false)
    const {uniqueName} = useParams()
    const navigate  = useNavigate();

    const img = useRef(null)
    const [selectedFile, setSelectedFile] = useState(null);
    const [cookieObjectApiKey, setCookieObjectApiKey, removeCookiObjectApiKey] = useCookies(['apiKey', "id", "email", "uniqueName"]);
    const [comment, setComment]=useState("")
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()

    useEffect(()=>{
        getUser()
    },[uniqueName])

 

    let checkImage=async(id)=>{
        let response = await fetch(Commons.baseUrl+"/public/users/avatar?id="+id)
        if(response.ok){
            let data = await response.json()
            if(data.message){
                setAvatarExist(true)
            }else{
                setAvatarExist(false)
            }
        }else{
            setAvatarExist(false)
        }
    }

    let getUser=async()=>{
        let response = await fetch(Commons.baseUrl+"/public/users/"+uniqueName)
        if(response.ok){
            let data = await response.json()
            setUser(data[0])
            getPosts(data[0].id)
            checkImage(data[0].id)
            checkIfYouFollow(data[0].id)
        }

    }

   
    let getPosts=async(uid)=>{

        let response = await fetch(Commons.baseUrl+"/public/mediaPost?userId="+uid)
        if(response.ok){
            let data = await response.json()
            setPosts(data)
            setPublications(data.length)
        }

    }
    
    const onChangeFile = (event) => {
        setSelectedFile(event.target.files[0]);
    };


    let publishPublication=async()=>{
        const formData = new FormData();
        formData.append('myImage', selectedFile);
        formData.append('comment', comment);
        if(selectedFile!==null){
            let response = await fetch (Commons.baseUrl+"/mediaPost?apiKey="+cookieObjectApiKey.apiKey,{
                method: 'POST',
                body:formData
            })
        }
        img.current.value=""
        setComment("")
        console.log(cookieObjectApiKey.apiKey)
        console.log(cookieObjectApiKey.id)
        getUser()
       
    }

    let goOut=()=>{
        navigate("/")
        removeCookiObjectApiKey("id",  { path: '/' })
        removeCookiObjectApiKey("email",  { path: '/' })
        removeCookiObjectApiKey("apiKey",  { path: '/' })
        removeCookiObjectApiKey("uniqueName",  { path: '/' })
    }

    let checkIfYouFollow=async(friendId)=>{

        let response = await fetch(Commons.baseUrl+"/friends?apiKey="+cookieObjectApiKey.apiKey+"&friendId="+friendId)
        if(response.ok){
            let data = await response.json()
            if(data.message==true){
                setFollow(true)
            } 
            if(data.message==false){
                setFollow(false)
            }
        }

    }
    return(
        <Box  display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}  >
            <Box  alignItems={"center"} w={["90%","90%","60%","50%","37%"]}  justifyContent={"center"}   display={"flex"}>
                
                    <Box w={["20%","20%","30%","30%","30%"]} display={"flex"} alignItems={"flex-start"}>
                        <Stack direction='row' >
                           {avatarExist && <Avatar size={["xl","xl","2xl","2xl","2xl"]}  src={Commons.baseUrl+"/images/"+user.id+"avatar.png"} />}
                           {!avatarExist && <Avatar size={["xl","xl","2xl","2xl","2xl"]}   />}
                        </Stack>
                    </Box>

                    <Box w={["80%","80%","70%","70%","70%"]}  ml={"6%"}  >

                        <Box display={"flex"} alignItems={"center"} justifyContent={"space-around"}>
                            <Text w={"50%"} fontSize={"24px"}>{user.uniqueName}</Text>
                            {cookieObjectApiKey.id==user.id &&
                            <Box w={"50%"}  display={"flex"} alignItems={"center"} justifyContent={"space-around"} >
                                <Button onClick={()=>{navigate('/users/edit')}} >Edit profile</Button>
                                <Box  onClick={onOpen}>
                                    <SettingOutlined style={{ fontSize: '23px' }} />
                                </Box>
                                <AlertDialog
                                    motionPreset='slideInBottom'
                                    leastDestructiveRef={cancelRef}
                                    onClose={onClose}
                                    isOpen={isOpen}
                                    isCentered
                                >
                                    <AlertDialogOverlay />
                                    <AlertDialogContent>
                                        <AlertDialogCloseButton/>
                                        <AlertDialogBody>
                                        </AlertDialogBody>
                                        <AlertDialogFooter display={"block"} >
                                            <Button mt={"3"} mb={"3"} w={"100%"} onClick={()=>{navigate("/users/editPassword")}} >
                                                change password
                                            </Button>
                                            <Button onClick={goOut} w={"100%"}>
                                                go out
                                            </Button>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </Box>}
                        </Box>

                        <Box  mb={"2%"} mt={"2%"} w={["100%"]} display={"flex"} justifyContent={"space-between"} >

                            <HStack>
                                <Text fontWeight={"bold"}>{publications}</Text>  
                                <Text>publications</Text>
                            </HStack>
                            <HStack>
                                <Text fontWeight={"bold"}>{followers}</Text>
                                <Text>followers</Text>
                            </HStack>
                            <HStack>
                                <Text fontWeight={"bold"}>{ following}</Text>
                                <Text>following</Text>
                            </HStack>
                        </Box>
                        <Text fontWeight={"bold"} >{user.name}</Text>
                        {cookieObjectApiKey.id==user.id &&
                        <Box  display={"flex"} justifyContent={"center"}>
                           <Button  onClick={()=>navigate("/users/publication")}  >Add new publication</Button>
                        </Box>}
                        {(cookieObjectApiKey.apiKey && cookieObjectApiKey.id!=user.id) &&
                            <Box  display={"flex"} justifyContent={"center"}>
                            {!follow && <Button  bg={"#0077FF"} color="white" >Follow</Button>}
                            {follow &&<Button  >Unfollow</Button>}
                            </Box>
                        }
                    </Box>
            </Box>
            <Box mt={"60px"} h={"309px"} w={["90%","90%","100%","90%","60%"]} display={"flex"} justifyContent={["center"]} flexWrap={"wrap"}>
                {posts.sort((a,b)=>b.id-a.id)
                .map((post)=>
                    <Box h={"100%"}  display={"flex"} alignItems={"center"}  flexDirection={"column"} m={"0.3%"} justifyContent={"center"}>
                        <Image h="100%" onClick={()=>{navigate("/mediaPost/"+post.id)}} w={["100%"]} src={Commons.baseUrl+"/images/"+user.id+post.id+"mini.png"} />
                    </Box>
                )}
            </Box>
        </Box>
    )
}