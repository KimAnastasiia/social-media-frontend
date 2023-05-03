import React,{useState, useEffect,useRef} from "react"
import { useNavigate   } from "react-router-dom";
import { Box, Flex, Text, Button, Stack, Img, HStack,Avatar,Hide,Show ,InputGroup,InputLeftElement,Alert,
    Image,
    AlertTitle,
    AlertDescription,
 } from "@chakra-ui/react";
import Commons from "../Utility/Commons";
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

  import { useCookies } from 'react-cookie'; 
  import {MessageOutlined ,SmileOutlined,SendOutlined,HeartOutlined,EllipsisOutlined,BookOutlined} from '@ant-design/icons';
  import { Input, Space } from 'antd';


  export default function ListFollowingUser(props){

    const [listOfFollowing, setListOfFollowing]=useState([])
    const [cookieObjectApiKey, setCookieObjectApiKey, removeCookiObjectApiKey] = useCookies(['apiKey', "id", "email", "uniqueName"]);
    const [searchFollowing, setSearchFollowing]=useState("")
    const { Search } = Input;
    const navigate  = useNavigate();
    useEffect(()=>{
        getUser()
    },[props.uniqueName])


    let getUser=async()=>{
        let response = await fetch(Commons.baseUrl+"/public/users/"+props.uniqueName)
        if(response.ok){
            let data = await response.json()
            getFolloving(data[0])
        }

    } 

    let getFolloving=async(user)=>{
        let response = await fetch(Commons.baseUrl+"/public/friends/following?id="+user.id)
        if(response.ok){
            let data = await response.json()
            setListOfFollowing(data.following)
          
        }

    } 
    let deleteFollowing=async(id)=>{
        let response = await fetch (Commons.baseUrl+"/friends/following?followingId="+id+"&apiKey="+cookieObjectApiKey.apiKey,{
            method: 'DELETE' 
        })
        getUser()
    }
    let moveTo=(uniqueName)=>{
        props.componentShow("publication")
        navigate("/users/"+uniqueName)
    }
    return(
        <Box p={"20px"} borderRadius={"lg"} borderWidth={"1px"} mt={"100px"} w={["90%", "90%","60%","50%","30%"]} >
            <Text mb={"20px"} textAlign={"center"} fontWeight={"bold"} >Following</Text>
            <Box mb={"20px"}>
                <Search
                    placeholder="search following"
                    onChange={(e)=>{setSearchFollowing(e.target.value)}}
                    style={{
                        width: "100%"
                    }}    
                />
            </Box>
            {listOfFollowing.filter((follower)=>{
                return follower.uniqueName.includes(searchFollowing)
            }).map((follower)=>
                <Box borderBottomWidth={"1px"} display={"flex"} justifyContent={"space-between"}>
                    
                    <Box onClick={()=>{moveTo(follower.uniqueName)}} mb={"20px"} w={"80%"} display={"flex"}> 
                        <Avatar size={"lg"} src={Commons.baseUrl+"/images/"+follower.following+"avatar.png"} ></Avatar>
                        <Text fontWeight={"bold"} ml={"20px"}>{follower.uniqueName}</Text>
                    </Box>
                    { ( cookieObjectApiKey.uniqueName==props.uniqueName) && <Box display={"flex"}  justifyContent={"end"} w={"20%"}>
                        <Popover>
                                <PopoverTrigger>
                                <EllipsisOutlined style={{ fontSize: '20px' }}/>
                                </PopoverTrigger>
                                <Portal>
                                    <PopoverContent>
                                    <PopoverArrow />
                                    <PopoverCloseButton />
                                    <PopoverBody>
                                        <Button onClick={()=>{deleteFollowing(follower.following)}}>Delete</Button>
                                    </PopoverBody>
                                    </PopoverContent>
                                </Portal>
                            </Popover>
                    </Box>}
                </Box>
            )}
        </Box>
    )
}