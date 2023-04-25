import React,{useState, useEffect,useRef} from "react"
import { useNavigate   } from "react-router-dom";
import { Box, Flex, Text, Button, Stack, Img, HStack,Avatar,Hide,Show ,Input,InputGroup,InputLeftElement,Alert,
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
  import {MessageOutlined ,SmileOutlined,SendOutlined,HeartOutlined,EllipsisOutlined,BookOutlined} from '@ant-design/icons';
export default function ListFollowersUser(props){

    const [listOfFollowers, setListOfFollowers]=useState([])


    useEffect(()=>{
        getUser()
    },[props.uniqueName])


    let getUser=async()=>{
        let response = await fetch(Commons.baseUrl+"/public/users/"+props.uniqueName)
        if(response.ok){
            let data = await response.json()
            getFollowers(data[0])
        }

    } 

    let getFollowers=async(user)=>{
        let response = await fetch(Commons.baseUrl+"/public/friends/followers?id="+user.id)
        if(response.ok){
            let data = await response.json()
            setListOfFollowers(data.followers)
          
        }

    } 
    return(
        <Box p={"20px"} borderRadius={"lg"} borderWidth={"1px"} mt={"100px"} w={"30%"} >
            {listOfFollowers.map((follower)=>
                <Box borderBottomWidth={"1px"} display={"flex"} justifyContent={"space-between"}>
                    
                    <Box mb={"20px"} w={"80%"} display={"flex"}> 
                        <Avatar size={"lg"} src={Commons.baseUrl+"/images/"+follower.userId+"avatar.png"} ></Avatar>
                        <Text fontWeight={"bold"} ml={"20px"}>{follower.uniqueName}</Text>
                    </Box>
                    <Box display={"flex"}  justifyContent={"end"} w={"20%"}>
                        <Popover>
                                <PopoverTrigger>
                                <EllipsisOutlined style={{ fontSize: '20px' }}/>
                                </PopoverTrigger>
                                <Portal>
                                    <PopoverContent>
                                    <PopoverArrow />
                                    <PopoverCloseButton />
                                    <PopoverBody>
                                    </PopoverBody>
                                    </PopoverContent>
                                </Portal>
                            </Popover>
                    </Box>
                </Box>
            )}
        </Box>
    )

}