import React,{useState, useEffect,useRef} from "react"
import { useNavigate   } from "react-router-dom";
import { Box, Flex, Text, Button, Stack, Img, HStack,Avatar,Hide,Show ,Input,InputGroup,InputLeftElement,Alert,
    Image,
    AlertTitle,
    AlertDescription,
 } from "@chakra-ui/react";
import Commons from "../Utility/Commons";
import { useCookies } from 'react-cookie'; 
export default function ListPublicationsUser(props){
    
    const navigate  = useNavigate();
    const [posts, setPosts]=useState([])
    const [listOfButtons,setListOfButtons]=useState([])
    let userIdRef = useRef()
    const [i, setI]=useState(0)
    const [postsInCloseAccount, setPostsInCloseAccount]=useState([])
    const [cookieObjectApiKey, setCookieObjectApiKey, removeCookiObjectApiKey] = useCookies(['apiKey', "id", "email", "uniqueName"]);
    const [message, setMessage]=useState(false)
    useEffect(()=>{
        setPosts([])
        getUser()
    },[props.uniqueName])

    useEffect(()=>{
        setPosts([])
        getUser()
    },[props.follow])

    let getUser=async()=>{
        let response = await fetch(Commons.baseUrl+"/public/users/"+props.uniqueName)
        if(response.ok){
            let data = await response.json()
            getPostsInitial(data[0].id,1)
            createListOfButtons(data[0].id)
            userIdRef.current=data[0].id
            getPostsInitialPrivet(data[0].id,1)
        }
    } 
    let getPostsInitial=async(uId, p)=>{
        let response = await fetch(Commons.baseUrl+"/public/mediaPost/postes?userId="+uId+"&p="+p)
        if(response.ok){
            let data = await response.json()
            if(!data.close){
                setPosts(data) //data.close:true
            }
            
        }
    }
    let getPostsInitialPrivet=async(uId, p)=>{
        let response = await fetch(Commons.baseUrl+"/mediaPost?userId="+uId+"&p="+p+"&apiKey="+cookieObjectApiKey.apiKey)
        if(response.ok){
            let data = await response.json()
            if(data.message){
                setMessage(data.message)
                setPostsInCloseAccount([])
            }else{
            setPostsInCloseAccount(data)
            setMessage(false)}
        }
    }
    let getPostsPrivet=async(uId, p)=>{
        let response = await fetch(Commons.baseUrl+"/mediaPost?userId="+uId+"&p="+p+"&apiKey="+cookieObjectApiKey.apiKey)
        if(response.ok){
            let data = await response.json()
            if(data.message){
                setMessage(data.message)
                setPostsInCloseAccount([])
            }else{
            let newList = [...postsInCloseAccount, ...data]
            setPostsInCloseAccount(newList)
            setMessage(false)}
        }
        setI(i+1)
    }
    let getPosts=async(uId, p)=>{
        let response = await fetch(Commons.baseUrl+"/public/mediaPost/postes?userId="+uId+"&p="+p)
        if(response.ok){
            let data = await response.json()
            let newList = [...posts, ...data]
            setPosts(newList)
        }
        setI(i+1)
    }
    let createListOfButtons=async(id)=>{
        let listOfButtons=[]
        let numberOfRows=0
        let response = await fetch(Commons.baseUrl+"/public/mediaPost/count?id="+id)
        if(response.ok){
            let data = await response.json()
            if(!data.error){
                numberOfRows = data[0].number 
            }
        }
        let numberOfPages = numberOfRows/6 
        numberOfPages = Math.ceil(numberOfPages) 

        for(let i=0; i<numberOfPages; i++){
            listOfButtons.push(<Button bg="lightblue"  w={"1%"} m={"5px"} onClick={e=>getPosts( userIdRef.current,(i+1))} key={i} >{i+1}</Button>)
        }
        console.log(listOfButtons)
        setListOfButtons(listOfButtons) 
    }
    return(
        <Box mt={"60px"} w={["90%","90%","100%","90%","60%"]} flexDirection={"column"} display={"flex"} justifyContent={"center"} >
                <Box  display={"flex"} justifyContent={["center"]} flexWrap={"wrap"}>
                {!cookieObjectApiKey.apiKey &&
                 posts
                    .map((post)=>
                        <Box m={"0.3%"} >
                            <Image  onClick={()=>{navigate("/mediaPost/"+post.id)}} src={Commons.baseUrl+"/images/"+ userIdRef.current+post.id+"mini.png"} />
                        </Box>
                    )}

                  {cookieObjectApiKey.apiKey && postsInCloseAccount
                    .map((post)=>
                        <Box m={"0.3%"} >
                            <Image  onClick={()=>{navigate("/mediaPost/"+post.id)}} src={Commons.baseUrl+"/images/"+ userIdRef.current+post.id+"mini.png"} />
                        </Box>
                    )}
                </Box>
                {posts.length>0 && 
                <Box mt={"20px"} w="100%" display={"flex"} justifyContent={"center"}>
                    {(listOfButtons.length>1 && i<=(listOfButtons.length-1)) && 
                    <Button bg="lightblue"  w={"10%"} m={"5px"} onClick={e=>{getPosts( userIdRef.current,(i+1))}} >Show more</Button>}
                </Box>}
                {postsInCloseAccount.length>0 && 
                <Box mt={"20px"} w="100%" display={"flex"} justifyContent={"center"}>
                    {(listOfButtons.length>1 && i<=(listOfButtons.length-1)) && 
                    <Button bg="lightblue"  w={"10%"} m={"5px"} onClick={e=>{getPostsPrivet( userIdRef.current,(i+1))}} >Show more</Button>}
                </Box>}
                {(posts.length==0 && postsInCloseAccount.length==0) &&
                <Box minH={["50vh"]}  mt={"20px"} w="100%" display={"flex"} alignItems={"center"} justifyContent={"center"}>
                 {(cookieObjectApiKey.apiKey && cookieObjectApiKey.uniqueName!=props.uniqueName && message )&& 
                <Text textAlign={"center"} fontSize={"20px"}>{message}</Text>}

                 {!cookieObjectApiKey.apiKey && 
                <Box display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"}>
                    <Text textAlign={"center"} fontSize={"20px"}>This is a privae account, login and subscribe to see publication</Text>
                    <Button mt={"20px"} color={"white"}  bg={"#0077FF"}  onClick={()=>navigate("/")}>Login</Button>
                </Box>
                }
                </Box>}
        </Box>
    )
}