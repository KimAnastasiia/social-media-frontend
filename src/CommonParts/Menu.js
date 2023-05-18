
import React,{useState, useEffect, useRef} from "react"
import { Box, Flex, Text, Button, Stack, Img,Avatar,Hide,Show ,Input,InputGroup,InputLeftElement} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { ChatIcon } from '@chakra-ui/icons'
import {QqOutlined, WechatOutlined, BellFilled, LogoutOutlined  } from '@ant-design/icons';
import Commons from "../Utility/Commons";
import { Select } from 'antd';
import { useNavigate   } from "react-router-dom";
import { useCookies } from 'react-cookie'; 
import { Badge } from 'antd';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,AlertDialogCloseButton,useDisclosure
  } from '@chakra-ui/react'
import { useSelector, useDispatch } from "react-redux";
export default function Menu(props){
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [users, setUsers]=useState([])
    const [numberOfAlerts, setNumberOfAlerts]=useState(0)
    const navigate  = useNavigate();
    const [cookieObjectApiKey, setCookieObjectApiKey, removeCookiObjectApiKey] = useCookies(['apiKey', "id", "email","uniqueName"]);
    const alertsInterval = useRef()
    const cancelRef = React.useRef()
    let colorGreen = "#4A8F06"
    const login = useSelector(state => state.reducerLogin);
    const dispatch = useDispatch();
    let colorLightBlue = "#B4DCFF"
    useEffect(()=>{
        alertsInterval.current=setInterval( getSubscriptionInterval , 1000)
        getListSubscriptionRequestsUser()
    },[login])

    let getSubscriptionInterval = () => {
        getListSubscriptionRequestsUser()
    }


    let searchUser=async(e)=>{
        if( e.length < 1){
            setUsers([])
        }else{
            let response = await fetch(Commons.baseUrl+"/public/users?name="+e)
            if(response.ok){
                let data = await response.json()
                setUsers(data)
            }
        }
    }

    let moveToThisAccont=async(uniqueName)=>{
        navigate("/users/"+uniqueName)
    }
    let navigateTo=()=>{
        if(cookieObjectApiKey.apiKey){
            navigate("/users/"+cookieObjectApiKey.uniqueName)
        }else{
            navigate("/")
        }
    }
    let getListSubscriptionRequestsUser=async()=>{
        let response = await fetch(Commons.baseUrl+"/friends/subscriptionRequests?apiKey="+cookieObjectApiKey.apiKey)
        if(response.ok){
            let data = await response.json()
            if(!data.error){
                setNumberOfAlerts(data.length)
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
return (

   <Flex  w="100%" bg="#142C8E"  zIndex="sticky" as="nav" align="center" justify={["space-between" ,"space-between" ,"space-between" ,"space-around" , "space-around"]} position={"fixed"}>
 
        <Stack
            h={"60px"}
            spacing={8}
            align="center"
            justify={"space-around"}
            direction={"row"}
            w={'100%'}
        >
   
            <Box  w={["90%","90%","70%","80%","35%"]} mt={"10px"} mb={"10px"} display="flex" alignItems={"center"} justifyContent="space-between" >
                    <Box display="flex" alignItems={"center"} justifyContent="space-between" onClick={navigateTo} >
                        <Text fontSize={["10px","10px","16px","19px","21px"]} color={colorLightBlue} >{cookieObjectApiKey.uniqueName}</Text>
                        <QqOutlined style={{fontSize: '30px', color: colorLightBlue } } />
                    </Box>
                    { cookieObjectApiKey.apiKey && 
                    <WechatOutlined id="messages" onClick={()=>{navigate("/users/yourDialogues")}} style={{fontSize: '30px', color: colorLightBlue} }  />}
                      { cookieObjectApiKey.apiKey && 
                    <Badge mr="20px" count={numberOfAlerts}>
                        <BellFilled style={{ fontSize: '27px', color: colorLightBlue }} onClick={()=>{navigate("/users/subscriptionRequests")}}/>
                    </Badge>}
                    <Select
                        showSearch
                        style={{
                        width: 160,
                        }}
                        placeholder="Search"
                        onChange={moveToThisAccont}
                        onSearch={searchUser}
                        filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options = {users.map((user) => {
                            return {
                            value: user.uniqueName,
                            label: user.uniqueName
                            };
                        })
                        }
                    />
                        { cookieObjectApiKey.apiKey &&  
                        <Box>
                        <Box onClick={onOpen}>
                            <LogoutOutlined style={{fontSize: '29px', color: colorLightBlue } }/>
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
                                    <Text fontSize={"20px"}>Do you really want to leave the page?</Text>
                                </AlertDialogBody>
                                <AlertDialogFooter display={"flex"} justifyContent={"space-around"} >
                                            <Button bg={colorGreen} color={"white"} onClick={()=>{goOut(); onClose()} }  mt={"3"} mb={"3"} w={"30%"} >
                                               yes
                                            </Button>
                                            <Button bg={colorLightBlue} onClick={onClose} w={"30%"}>
                                                no
                                            </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        </Box>
                        }
            </Box>  
            
           
        </Stack>
   </Flex> 
   
);
}