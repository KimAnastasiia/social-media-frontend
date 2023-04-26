
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
import ListPublicationsUser from "./ListPublicationsUser";
import ListFollowersUser from "./ListFollowersUser";
import ListFollowingUser from "./ListFollowingUser";
export default function DetailsUser(props){

    const [publications, setPublications]=useState(0)
    const [followers, setFollowers]=useState(0)
    const [following, setFollowing]=useState(0)
    const [follow, setFollow]=useState()
    const [user, setUser]=useState({})
    const [avatarExist, setAvatarExist]=useState(false)
    const [selectedFile, setSelectedFile] = useState(null);
    const [friendId, setFriendId ]=useState("")
    const [cookieObjectApiKey, setCookieObjectApiKey, removeCookiObjectApiKey] = useCookies(['apiKey', "id", "email", "uniqueName"]);
    const [comment, setComment]=useState("")
    const {uniqueName} = useParams()
    const navigate  = useNavigate();
    const img = useRef(null)
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
    let friends =async(id)=>{
        let response = await fetch(Commons.baseUrl+"/public/friends?id="+id)
        if(response.ok){
            let data = await response.json()
            setFollowing(data.following[0].following)
            setFollowers(data.followers[0].followers)
        }
    }
    let getUser=async()=>{
        let response = await fetch(Commons.baseUrl+"/public/users/"+uniqueName)
        if(response.ok){
            let data = await response.json()
            setUser(data[0])
            checkImage(data[0].id)
            checkIfYouFollow(data[0].id)
            setFriendId(data[0].id)
            friends(data[0].id)
        }

    }

    let goOut=()=>{
        navigate("/")
        removeCookiObjectApiKey("id",  { path: '/' })
        removeCookiObjectApiKey("email",  { path: '/' })
        removeCookiObjectApiKey("apiKey",  { path: '/' })
        removeCookiObjectApiKey("uniqueName",  { path: '/' })
    }
    let addFriend=async()=>{
        let response = await fetch (Commons.baseUrl+"/friends?apiKey="+cookieObjectApiKey.apiKey,{

            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body:
                JSON.stringify({ 
                    friendId:user.id
                })
        })
        if(response.ok){
            let data = await response.json()
            if(data.message=="done"){
                setFollow(true)
            }
        }
    }
    let checkIfYouFollow=async(frId)=>{

        let response = await fetch(Commons.baseUrl+"/friends?apiKey="+cookieObjectApiKey.apiKey+"&friendId="+frId)
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
    let unfollow=async()=>{
        let response = await fetch (Commons.baseUrl+"/friends/"+friendId+"?apiKey="+cookieObjectApiKey.apiKey,{
            method: 'DELETE' 
        })
        if(response.ok){
            setFollow(true)
        }
        getUser()
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
                                <Text fontWeight={"bold"}>{following}</Text>
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
                            {!follow && <Button onClick={addFriend} bg={"#0077FF"} color="white" >Follow</Button>}
                            {follow &&<Button onClick={unfollow}>Unfollow</Button>}
                            </Box>
                        }
                    </Box>
            </Box>
            <ListPublicationsUser  uniqueName={uniqueName} />
            <ListFollowersUser  uniqueName={uniqueName} />
            <ListFollowingUser uniqueName={uniqueName}/>
        </Box>
    )
}