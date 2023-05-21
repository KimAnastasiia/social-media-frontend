import React,{useState, useEffect,useRef} from "react"
import { Box, Image, Text, Button, Stack, Img, Badge,Avatar,Hide,Show ,Input,InputGroup,InputLeftElement,Alert,
AlertIcon, AlertTitle} from "@chakra-ui/react";
import { useNavigate   } from "react-router-dom";
import Commons from "../Utility/Commons";
import { useSelector, useDispatch } from "react-redux";
import { useCookies } from 'react-cookie'; 
import { Result } from 'antd'
import { FrownOutlined} from '@ant-design/icons';
import FormatDate from "../Utility/FormatDate";

export default function LoginUser(props){

    const dispatch = useDispatch();

    const [cookieObjectApiKey, setCookieObjectApiKey, removeCookiObjectApiKey] = useCookies(['apiKey', "id", "email", "uniqueName"])
    const [email , setEmail]=useState("")
    const navigate  = useNavigate();
    const [emailError, setEmailError]=useState(false)
    const [listOfPublication, setListOfPublication]=useState([])

    let publications=useRef([])
    useEffect(()=>{
        if(email.length==0){
            setEmailError(false)
        }
    },[email])

    useEffect(()=>{
        if(cookieObjectApiKey.apiKey){
            getFolloving()
        }
    },[])

    const putEmail=(e)=>{
        setEmail(e.target.value)
        dispatch({type:"modifyEmail", payload: e.target.value})
    }

    let signInOnClick=async()=>{

        let response = await fetch(Commons.baseUrl+"/public/users?email="+email)
        if(response.ok){
            let data = await response.json()
            if(!data.error && data.length > 0){
                setEmailError(false)
                navigate("/verification/password")
            }else{
                setEmailError("There is no account with this email")
            }
        }

    }

    let getFolloving=async()=>{
        let response = await fetch(Commons.baseUrl+"/public/friends/following?id="+cookieObjectApiKey.id)
        if(response.ok){
            let data = await response.json()
            if(data.following.length>0){
                await getPosts(data.following)
                
            }
        }
    } 
    let getPosts= async (listFollowing)=>{

        let informationPost=[]

        await listFollowing.forEach( async(user, i)=>{

            let response = await fetch(Commons.baseUrl+"/mediaPost/lastPost?userId="+user.id+"&apiKey="+cookieObjectApiKey.apiKey)
            if(response.ok){
                let data = await response.json()
                if(data.length>0){
                    informationPost=informationPost.concat(data)
                    setListOfPublication(informationPost)
                    publications.current=informationPost
                }
            }
   
        })
   

    }

return (
    <Box>
    {!cookieObjectApiKey.apiKey && 
        <Box pt="200px" display={"flex"} justifyContent="center"  >
            <Box mr={"20px"} display={["none","none","none","block","block"]}>
                <Text textAlign={"center"} fontSize="2xl" fontWeight={"bold"} >Penguin for mobile devices</Text>
                <Text textAlign={"center"} color="#555657" >Install our official mobile app and stay in touch with your friends anytime and anywhere.</Text>

                <Box m={"20px"} display={"flex"} justifyContent="center" >
                    <img  src="/images/pYORDwKmdDI.png" ></img>
                    <img src="/images/VD3VpchXcC8.png" ></img>
                </Box>
            </Box>
            <Box ml={["20px","20px",0,0,"20px"]} mr={["20px","20px",0,"10px",0]} display="flex" alignItems={"center"} flexDirection={"column"} justifyContent={"center"} >
                <Box w={["80%", "80%", "100%", "100%","100%"]} mb={"30px"} borderRadius={"lg"} borderWidth={"1px"} h="300px" display="flex" flexDirection={"column"} justifyContent="center" alignItems={"center"}>
                    <Text m={"30px"} fontWeight="bold" fontSize="2xl" textAlign={"center"}>Sign in to Penguin</Text>
                    { emailError &&  <Alert status='error' w={"80%"} borderRadius="3xl" >
                            <AlertIcon />
                            <AlertTitle>{emailError}</AlertTitle>
                        </Alert>}
                    <Input
                    id="email"
                    onChange={putEmail}
                    errorBorderColor='crimson'
                    bg={"white"}
                    w={"80%"}
                    placeholder="Email">
                    </Input>
                    <Button  id="login" mt={"20px"} onClick={signInOnClick} color={"white"} bg={"#142C8E"} w={"70%"} >Sign in</Button>
                </Box>

                <Box  w={["80%", "80%", "100%", "100%","100%"]}  borderRadius={"lg"}  p={"20px"} borderWidth={"1px"} display="flex" flexDirection={"column"} justifyContent="center" alignItems={"center"} >
                    <Button onClick={()=>{navigate("/registration")}} id="registration" color={"white"}  mb={"20px"}  w={"70%"}  bg={"#4A8F06"}>Registration</Button>
                    <Text textAlign={"center"} w={"80%"} color="#555657">After signing up, you'll get access to all of Penguin ID's features</Text>
                </Box>

            </Box>
        </Box>}
        {cookieObjectApiKey.apiKey &&
        <Box>  
            {listOfPublication.length>0 &&
            <Box>
                { listOfPublication.sort((a,b)=>b.postId-a.postId)
                .map((following)=>
                    <Box w={"100%"} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
                        <Box w={"30%"} p={"20px"}  borderRadius={"lg"} mb={"20px"} borderWidth={"1px"} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
                            <Box w={"90%"} >
                                <Box mb={"20px"} display={"flex"} justifyContent={"flex-start"}>
                                    <Avatar src={Commons.baseUrl+"/images/"+following.userId+"avatar.png"} ></Avatar>
                                    <Box w={"100%"} ml={"10px"}>
                                        <Button variant='link'>{following.uniqueName}</Button>
                                        <Box justifyContent={"space-between"} display={"flex"} w={"100%"}>
                                            <Text >{following.comment}</Text>
                                            <Text >{ FormatDate(following.date)}</Text>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                            <Image borderRadius={"lg"}  w={"90%"} src={Commons.baseUrl+"/images/"+following.userId+following.postId+"big.png"} />
                        </Box>
                    </Box>)}
            </Box>}
            {listOfPublication.length==0 &&
               <Result
               icon={<FrownOutlined />}
               title="You dont have any friends yet"
             />
            }
        </Box>
        }
 </Box>


)}