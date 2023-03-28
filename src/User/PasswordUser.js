import React,{useState, useEffect} from "react"
import { Box, Checkbox, Text, Button, Stack, Img, Badge,Avatar,Hide,Show ,Input,InputGroup,InputLeftElement} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {QqOutlined ,UserOutlined,LoginOutlined,LockOutlined} from '@ant-design/icons';

export default function PasswordUser(props){
    const [password, setPassword]=useState("")
    const [saveUser , setSaveUser]=useState(false)
    const [disabledButton , setDisabledButton]=useState(true)
    
    useEffect(()=>{
        if(password.length > 3){
            setDisabledButton(false)
        }
        if(password.length <= 3){
            setDisabledButton(true)
        }
    },[password])

    let putPassword=(e)=>{
        setPassword(e.target.value)
       
    }
    return (
        <Box color={"#99A2AD"} pt="16%" pl={"25%"} pr="25%">
        <Box  border={"1px"} borderColor="lightgray" borderRadius={"lg"} display={"flex"}>
            <Box p={"50px"} w={"50%"} bg={"#F9F9F9"} >
                <Box m="10px" display={"flex"}>
                    <QqOutlined style={{fontSize: '30px', color: "#0077FF"} } />
                    <Text ml={"5px"} fontWeight={"bold"} fontSize="20px" color={"black"} >ID</Text>
                    
                </Box>
                <Text mb={"20px"} mt="20px" fontSize="19px"  color={"black"}>Sign in to Penguin with Penguin ID</Text>
                    <Box display={"flex"} alignItems={"center"} > 
                        <UserOutlined style={{fontSize: '20px'}}  /> 
                        <Text m={"10px"} >Single account for VK and partner services</Text>
                        </Box>
                    <Box display={"flex"} alignItems={"center"}> 
                        <LoginOutlined style={{fontSize: '20px'}}/>
                        <Text m={"10px"}>Quick login with the press of a button</Text>
                    </Box>
                    <Box display={"flex"} alignItems={"center"}>
                        <LockOutlined style={{fontSize: '20px'}}/> 
                        <Text m={"10px"}>A secure account linked to your phone number</Text>
                    </Box>
            </Box>
            <Box p={"50px"} w={"50%"} display="flex" flexDirection={"column"} justifyContent="center" alignItems={"center"}>
                <QqOutlined style={{fontSize: '50px', color: "#0077FF"} } />
                <Text  mt={"20px"} mb={"20px"} fontSize="20px" color={"black"}>Enter your password</Text>
                <Text  mb={"20px"}>Enter the current password linked to {props.login}</Text>
                <Input color={"black"} onChange={putPassword} value={password} mb={"20px"} w={"80%"}  placeholder="Enter password"></Input>
                <Box  mb={"20px"} w={"80%"} display={"flex"} justifyContent={"flex-start"} alignItems="flex-start" >
                    <Checkbox defaultChecked onChange={()=>setSaveUser(!saveUser)} >Save user</Checkbox>
                </Box>
                <Button w={"80%"} color="white" colorScheme={"none"} isDisabled={disabledButton} _disabled={{ bg: "#79AEEB", colorScheme: "none"}} bg={"#0077FF"}>Continue</Button>
               
            </Box> 
        </Box>
    </Box>
    )
}