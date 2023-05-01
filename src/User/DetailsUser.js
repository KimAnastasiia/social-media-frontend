
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
import { Switch } from '@chakra-ui/react'
import ListPublicationsUser from "./ListPublicationsUser";
import ListFollowersUser from "./ListFollowersUser";
import ListFollowingUser from "./ListFollowingUser";
export default function DetailsUser(props){
    const STATE_PRIVATE_ACCOUNT = 1
    const STATE_WAITING_FOR_RESPONSE = 2
    const STATE_YOU_ARE_FRIEND = 3

    const [publications, setPublications]=useState(0)
    const [followers, setFollowers]=useState(0)
    const [following, setFollowing]=useState(0)
    const [follow, setFollow]=useState()
    const [user, setUser]=useState({})
    const [avatarExist, setAvatarExist]=useState(false)
    const [cookieObjectApiKey, setCookieObjectApiKey, removeCookiObjectApiKey] = useCookies(['apiKey', "id", "email", "uniqueName"])
    const {uniqueName} = useParams()
    const navigate  = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()
    const id = React.useRef()
    const [publicationShow, setPublicationShow]=useState(true)
    const [followersShow, setFollowersShow]=useState(false)
    const [followingShow, setFollowingShow]=useState(false)
    const [privateStatus, setPrivateStatus]=useState(false)
    const [stateOfUser, setStateOfUser]=useState(0)

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
            friends(data[0].id)
            getPosts(data[0].id)
            subscriptionCheck(data[0].id,1)
            id.current=data[0].id
            if(data[0].close==0){
                setPrivateStatus(false)
            }
            if(data[0].close==1){
                setPrivateStatus(true)
            }
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
                    followingId:user.id
                })
        })
        if(response.ok){
            let data = await response.json()
            if(data.message=="done"){
                setFollow(true)
            }
            getUser()
        }
        friends(id.current)
    }
    let checkIfYouFollow=async(frId)=>{

        let response = await fetch(Commons.baseUrl+"/friends?apiKey="+cookieObjectApiKey.apiKey+"&followingId="+frId)
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
        let response = await fetch (Commons.baseUrl+"/friends?followingId="+id.current+"&apiKey="+cookieObjectApiKey.apiKey,{
            method: 'DELETE' 
        })
        if(response.ok){
            setFollow(false)
            getUser()
        }
       
    }
    let componentShow=(c)=>{
        switch(c){
            case "following":
                setFollowingShow(true)
                setFollowersShow(false)
                setPublicationShow(false)
            break
            case "followers":
                setFollowersShow(true)
                setFollowingShow(false)
                setPublicationShow(false)
            break
            case "publication":
                setPublicationShow(true)
                setFollowersShow(false)
                setFollowingShow(false)
                
            break
            default:
                setPublicationShow(true)
                setFollowersShow(false)
                setFollowingShow(false)
        }
    }
    let getPosts=async(uid)=>{

        let response = await fetch(Commons.baseUrl+"/public/mediaPost?userId="+uid)
        if(response.ok){
            let data = await response.json()
            setPublications(data.length)
        }

    }
    let updateAccount=async(value)=>{

        let response = await fetch (Commons.baseUrl+"/users/private?apiKey="+cookieObjectApiKey.apiKey,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                private:value
            })
        })
        getUser()
    }
    let subscriptionCheck=async(uId, p)=>{
        let response = await fetch(Commons.baseUrl+"/mediaPost?userId="+uId+"&p="+p+"&apiKey="+cookieObjectApiKey.apiKey)
        if(response.ok){
            let data = await response.json()
            switch(data.code){
                case STATE_PRIVATE_ACCOUNT:
                    setStateOfUser(STATE_PRIVATE_ACCOUNT)
                break
                case STATE_WAITING_FOR_RESPONSE:
                    setStateOfUser(STATE_WAITING_FOR_RESPONSE)
                break
                default:
                    setStateOfUser(STATE_YOU_ARE_FRIEND)
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
                                            <Box alignItems={"center"} mt={"3"} mb={"3"} w={"100%"} display={"flex"} justifyContent={"space-between"}>
                                             
                                                <Box alignItems={"center"} mt={"3"} mb={"3"} w={"100%"} display={"flex"} justifyContent={"space-between"}>
                                                    <Text fontSize={"20px"} w={"80%"}>Private account</Text>
                                                    {!privateStatus && <Switch onChange={()=>{updateAccount(true)}}  w="20%" size='md'/> }
                                                    {privateStatus && <Switch isChecked onChange={()=>{updateAccount(false)}}   w="20%" size='md'/> }
                                                </Box>                                                
                                            </Box>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </Box>}
                        </Box>

                        <Box mb={"2%"} mt={"2%"} w={["100%"]} display={"flex"} justifyContent={"space-between"} >

                            <Button color={"black"} variant='link'  onClick={()=>{componentShow("publication")}}>
                                <Text fontWeight={"bold"}>{publications}</Text>  
                                <Text  ml={"2px"} >publications</Text>
                            </Button>
                            <Button variant='link' color={"black"} onClick={()=>{componentShow("followers")}}>
                                <Text fontWeight={"bold"}>{followers}</Text>
                                <Text ml={"2px"}>followers</Text>
                            </Button>
                            <Button  variant='link'  color={"black"} onClick={()=>{componentShow("following")}}>
                                <Text fontWeight={"bold"}>{following}</Text>
                                <Text ml={"2px"}>following</Text>
                            </Button>
                        </Box>
                        <Text fontWeight={"bold"} >{user.name}</Text>
                        {cookieObjectApiKey.id==user.id &&
                        <Box  display={"flex"} justifyContent={"center"}>
                           <Button  onClick={()=>navigate("/users/publication")}  >Add new publication</Button>
                        </Box>}
                        {(cookieObjectApiKey.apiKey && cookieObjectApiKey.id!=user.id && user.close==0) &&
                            <Box  display={"flex"} justifyContent={"center"}>
                            {!follow && <Button onClick={addFriend} bg={"#0077FF"} color="white" >Follow</Button>}
                            {follow &&<Button onClick={unfollow}>Unfollow</Button>}
                            </Box>
                        }
                        {(cookieObjectApiKey.apiKey && cookieObjectApiKey.id!=user.id && user.close==1) &&
                            <Box  display={"flex"} justifyContent={"center"}>
                            {(stateOfUser==STATE_PRIVATE_ACCOUNT) &&  <Button bg={"#0077FF"} onClick={addFriend} color="white" >Send a subscription request</Button>}
                            {(stateOfUser==STATE_WAITING_FOR_RESPONSE) && <Button onClick={unfollow} bg={"#0077FF"} color="white" >Cancel the subscription request</Button>}
                            {(stateOfUser==STATE_YOU_ARE_FRIEND) && <Button  onClick={unfollow}>Unfollow</Button>}
                            </Box>
                        }
                    </Box>
            </Box>
            {publicationShow &&  <ListPublicationsUser follow={follow}  uniqueName={uniqueName} />}
            {followersShow && <ListFollowersUser  componentShow={componentShow} id={id.current} countFollowers={friends} uniqueName={uniqueName} />}
            {followingShow && <ListFollowingUser  componentShow={componentShow} id={id.current} countFollowers={friends} uniqueName={uniqueName}/>}
        </Box>
    )
}