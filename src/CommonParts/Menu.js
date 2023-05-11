
import React,{useState, useEffect, useRef} from "react"
import { Box, Flex, Text, Button, Stack, Img,Avatar,Hide,Show ,Input,InputGroup,InputLeftElement} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { ChatIcon } from '@chakra-ui/icons'
import {QqOutlined, WechatOutlined, BellFilled } from '@ant-design/icons';
import Commons from "../Utility/Commons";
import { Select } from 'antd';
import { useNavigate   } from "react-router-dom";
import { useCookies } from 'react-cookie'; 
import { Badge } from 'antd';

export default function Menu(props){

    const [users, setUsers]=useState([])
    const [numberOfAlerts, setNumberOfAlerts]=useState(0)
    const navigate  = useNavigate();
    const [cookieObjectApiKey, setCookieObjectApiKey, removeCookiObjectApiKey] = useCookies(['apiKey', "id", "email","uniqueName"]);
    
    useEffect(()=>{
        getListSubscriptionRequestsUser()
    },[])

    let colorLightBlue = "#B4DCFF"
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
   
            <Box  w={["50%","50%","50%","40%","30%"]} mt={"10px"} mb={"10px"} display="flex" alignItems={"center"} justifyContent="space-between" >
                    <QqOutlined onClick={navigateTo} style={{fontSize: '30px', color: colorLightBlue } } />
                    { cookieObjectApiKey.apiKey && 
                    <WechatOutlined onClick={()=>{navigate("/users/yourDialogues")}} style={{fontSize: '30px', color: colorLightBlue} }  />}
                    <Badge mr="20px" count={numberOfAlerts}>
                        <BellFilled style={{ fontSize: '27px', color: colorLightBlue }} onClick={()=>{navigate("/users/subscriptionRequests")}}/>
                    </Badge>
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
            </Box>  
            
           
        </Stack>
   </Flex> 
   
);
}