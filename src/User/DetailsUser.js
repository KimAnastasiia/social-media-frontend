import React,{useState, useEffect,useRef} from "react"
import { Box, Flex, Text, Button, Stack, Img, HStack,Avatar,Hide,Show ,Input,InputGroup,InputLeftElement,Alert,
    useToast ,
    AlertTitle,
    AlertDescription,
    Textarea,
 } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Commons from "../Utility/Commons";
import {SettingOutlined ,SmileOutlined,SendOutlined,HeartOutlined,BellOutlined,CameraOutlined} from '@ant-design/icons';
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
import { AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import { useSelector, useDispatch } from "react-redux";

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
    let colorLightBlue = "#B4DCFF"
    let colorDarkBlue = "#142C8E"
    let colorGreen = "#4A8F06"
    const [message, setMessage]=useState("")
    const toast = useToast()
    const toastIdRef = React.useRef()
    const [online, setOnline ]=useState(false)
    const onlineInterval = useRef()
    const [lastTimeOnlime, setLastTimeOnlime]=useState()
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch({type:"loginTrue"})
        getUser()
        getTime()
        return () => {
            clearInterval( onlineInterval.current);
        };
    },[uniqueName])

    useEffect(()=>{
        onlineInterval.current=setInterval( getTime , 8000)

        return () => {
            clearInterval( onlineInterval.current);
        };
    },[])

    let getTime=async()=>{
        let response = await fetch(Commons.baseUrl+"/public/users/"+uniqueName)
        if(response.ok){
            let data = await response.json()
            const d = Date.now();
            if(data[0].lastTimeConnected+20000 >= d){
                setOnline(true)
            }else{
                setOnline(false)
                setLastTimeOnlime(data[0].lastTimeConnected)
            }
        }

    }

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
    let getFollowers=async(user)=>{
        let response = await fetch(Commons.baseUrl+"/public/friends/followers?id="+user.id)
        if(response.ok){
            let data = await response.json()
            setFollowers(data.followers.length)
          
        }

    } 
    let getFolloving=async(user)=>{
        let response = await fetch(Commons.baseUrl+"/public/friends/following?id="+user.id)
        if(response.ok){
            let data = await response.json()
            setFollowing(data.following.length)
        }

    } 
    let getUser=async()=>{
        let response = await fetch(Commons.baseUrl+"/public/users/"+uniqueName)
        if(response.ok){
            let data = await response.json()
            setUser(data[0])
            checkImage(data[0].id)
            checkIfYouFollow(data[0].id)
            getFollowers(data[0])
            getFolloving(data[0])
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
        dispatch({type:"loginFalse"})
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
    let sendMessage=async()=>{
        if(message.length!=0){
            let response = await fetch (Commons.baseUrl+"/messages?apiKey="+cookieObjectApiKey.apiKey,{

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },

                body:
                    JSON.stringify({ 
                        idReceiver:user.id,
                        message:message
                    })
            })
            if(response.ok){
                let data = await response.json()
                if(data.message=="done"){
                    success()
                }else{
                    error()
                }
            }
        }
    }
    function success() {
        toastIdRef.current = toast({ description: 'Message sent successfully',  status:'success'  })
    }
    function error() {
        toastIdRef.current = toast({ description: 'An error occurred while sending the message',  status:'error' })
    }
    let FormatDateStatus = (timestamp) => {
        let myDate = new Date(Number(timestamp))
        let mm = myDate.getMonth() + 1; // getMonth() is zero-based
        let dd = myDate.getDate();
        let hours = myDate.getHours()
        let minute = myDate.getMinutes()
        return `${mm}/${dd}  ${hours}:${minute}`
    }

    return(
        <Box  display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}  >
            <Box  alignItems={"center"} w={["90%","90%","60%","50%","37%"]}  justifyContent={"center"}   display={"flex"}>
                
                    <Box w={["20%","20%","30%","30%","30%"]} display={"flex"} alignItems={"flex-start"}>
                        <Stack direction='row' >
                           {avatarExist && 
                           <Box>
                            <Avatar size={["xl","xl","2xl","2xl","2xl"]}  src={Commons.baseUrl+"/images/"+user.id+"avatar.png"}>
                                {online && <AvatarBadge boxSize='0.9em' bg='green.500'/> }
                            </Avatar>
                            {!online && <Text color={"black"} fontSize={"15px"}>Was online {FormatDateStatus( lastTimeOnlime)}</Text>}
                            </Box>
                           }
                           {!avatarExist && 
                            <Box>
                                <Avatar size={["xl","xl","2xl","2xl","2xl"]} >
                                        { online && <AvatarBadge boxSize='0.9em' bg='green.500' />}
                                </Avatar>
                                {!online && <Text color={"black"} fontSize={"15px"}>Was online {FormatDateStatus( lastTimeOnlime)}</Text>}
                            </Box>
                           }
                        </Stack>
                    </Box>

                    <Box w={["80%","80%","70%","70%","70%"]}  ml={"6%"}  >

                        <Box display={"flex"} alignItems={"center"} justifyContent={"space-around"}>
                            <Text  fontSize={"24px"}>{user.uniqueName}</Text>
                            {cookieObjectApiKey.id==user.id &&
                            <Box w={"100%"}  display={"flex"} alignItems={"center"} justifyContent={"space-around"} >
                               
                                <Button bg={colorLightBlue} onClick={()=>{navigate('/users/edit')}} >Edit profile</Button>
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
                                            <Button  mt={"3"} mb={"3"} w={"100%"} onClick={()=>{navigate("/users/editPassword")}} >
                                                change password
                                            </Button>
                                            <Button onClick={goOut} w={"100%"}>
                                                go out
                                            </Button>
                                            <Box alignItems={"center"} mt={"3"} mb={"3"} w={"100%"} display={"flex"} justifyContent={"space-between"}>
                                             
                                                <Box alignItems={"center"} mt={"3"} mb={"3"} w={"100%"} display={"flex"} justifyContent={"space-between"}>
                                                    <Text fontSize={"20px"} w={"80%"}>Private account</Text>
                                                    {!privateStatus && <Switch onChange={()=>{updateAccount(true)}}  w="20%" size='md'/> }
                                                    {privateStatus && <Switch isChecked onChange={()=>{updateAccount(false)}} w="20%" size='md'/> }
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
                           <Button bg={colorLightBlue} onClick={()=>navigate("/users/publication")}  >Add new publication</Button>
                        </Box>}
                        {!cookieObjectApiKey.apiKey &&
                        <Box display={"flex"} justifyContent={"center"}>
                           <Button onClick={()=>navigate("/")}   bg={colorLightBlue}>Sign in to send a friend request</Button>
                        </Box>}
                        {(cookieObjectApiKey.apiKey && (cookieObjectApiKey.id!=user.id) && user.close==0) &&
                            <Box  display={"flex"} justifyContent={"center"}>
                                {!follow && <Button onClick={addFriend} bg={colorDarkBlue} color="white" >Follow</Button>}
                                {follow &&<Button bg={colorLightBlue} onClick={unfollow}>Unfollow</Button>}
                            </Box>
                        }
                        {(cookieObjectApiKey.apiKey && cookieObjectApiKey.id!=user.id && user.close==1) &&
                            <Box  display={"flex"} justifyContent={"center"}>
                            {(stateOfUser==STATE_PRIVATE_ACCOUNT) &&  <Button bg={colorDarkBlue} onClick={addFriend} color="white" >Send a subscription request</Button>}
                            {(stateOfUser==STATE_WAITING_FOR_RESPONSE) && <Button onClick={unfollow} bg={colorLightBlue} color="black" >Cancel the subscription request</Button>}
                            {(stateOfUser==STATE_YOU_ARE_FRIEND) && <Button  onClick={unfollow}>Unfollow</Button>}
                            </Box>
                        }
                        
                        {(cookieObjectApiKey.apiKey && cookieObjectApiKey.id!=user.id) &&
                        <Box mt={"10px"}  display={"flex"} justifyContent={"center"}>
                            <Button bg={colorGreen} color={"white"} onClick={onOpen}>Message</Button>
                                <AlertDialog
                                    motionPreset='slideInBottom'
                                
                                    onClose={onClose}
                                    isOpen={isOpen}
                                    isCentered
                                >
                                    <AlertDialogOverlay />

                                    <AlertDialogContent>
                                    <AlertDialogHeader alignItems={"center"} justifyContent={"space-around"} borderBottomWidth={"2px"} display={"flex"}>
                                        <Text color={"black"}  fontSize={"15px"} >New message</Text>
                                        <Button  colorScheme='blue' onClick={()=>{navigate("/users/chat/"+user.uniqueName)}} variant='link' fontSize={"15px"}>Go to dialogue with {user.uniqueName}</Button>
                                        <AlertDialogCloseButton />
                                    </AlertDialogHeader>
                                    <AlertDialogBody>
                                      <Box mb={"10px"} display={"flex"}>
                                        <Avatar mr={"10px"}  src={Commons.baseUrl+"/images/"+user.id+"avatar.png"} ></Avatar>
                                        <Text>{user.name}</Text>
                                      </Box>
                                      <Box>
                                        <Textarea
                                        onChange={(e)=>{setMessage(e.target.value)}}
                                        ></Textarea>
                                      </Box>
                                    </AlertDialogBody>
                                    <AlertDialogFooter>
                                        <CameraOutlined style={{ fontSize: '20px', color:"gray" }}  />
                                        <Button bg={colorLightBlue} color={"black"} onClick={() => {sendMessage(); onClose();}}  colorScheme='blue' ml={3}>
                                            send
                                        </Button>
                                    </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </Box>
                                }
                        
                    </Box>
            </Box>
            {publicationShow &&  <ListPublicationsUser follow={follow}  uniqueName={uniqueName} />}
            {followersShow && <ListFollowersUser  componentShow={componentShow} id={id.current} uniqueName={uniqueName} />}
            {followingShow && <ListFollowingUser  componentShow={componentShow} id={id.current} uniqueName={uniqueName}/>}
        </Box>
    )
}