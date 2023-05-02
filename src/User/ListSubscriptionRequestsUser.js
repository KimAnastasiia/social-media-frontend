
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
export default function ListSubscriptionRequestsUser(props){

    const [cookieObjectApiKey, setCookieObjectApiKey, removeCookiObjectApiKey] = useCookies(['apiKey', "id", "email", "uniqueName"])
    const [listSubscriptionRequests, setListSubscriptionRequests]=useState([])
    useEffect(()=>{
        getListSubscriptionRequestsUser()
    },[])
    let getListSubscriptionRequestsUser=async()=>{
        let response = await fetch(Commons.baseUrl+"/friends/subscriptionRequests?apiKey="+cookieObjectApiKey.apiKey)
        if(response.ok){
            let data = await response.json()
            if(!data.error){
                setListSubscriptionRequests(data)
            }
        }
    }
    return(
        <Box borderRadius={"lg"} borderWidth={"1px"} ml={"700px"} mr={"700px"} mt={"200px"} display={"flex"} justifyContent={"center"} flexDirection={"column"}>
        <Text mt="30px" mb="30px" fontSize={"30px"} textAlign={"center"}>Yours subscription requests</Text>
        {listSubscriptionRequests.map((follower)=>
       
            <Box w={"80%"} m={"20px"} alignItems={"center"} display={"flex"} justifyContent={"space-between"}>
                <Box alignItems={"center"}  w={"20%"} display={"flex"} justifyContent={"space-around"} >
                    <Avatar src={Commons.baseUrl+"/images/"+follower.id+"avatar.png"} ></Avatar>
                    <Text>{follower.name}</Text>
                </Box>
                <Box display={"flex"}  w={"40%"} justifyContent={"space-around"}>
                    <Button>Approve</Button>
                    <Button>Cancel</Button>
                </Box>
            </Box>
        )}
        </Box>
    )
}