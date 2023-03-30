import React,{useState, useEffect} from "react"
import { Box, Checkbox, Text, Button, Alert, AlertIcon, AlertTitle,Avatar,Hide,Show ,Input,InputGroup,InputLeftElement} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {QqOutlined ,UserOutlined,LoginOutlined,LockOutlined} from '@ant-design/icons';
import Commons from "../Utility/Commons";
import { useCookies } from 'react-cookie'; 


export default function PasswordUser(props){

    const [password, setPassword]=useState("")
    const [saveUser , setSaveUser]=useState(false)
    const [alert, setAlert] = useState(false)
    const [cookieObjectApiKey, setObjectApiKey, removeCookiObjectApiKey] = useCookies(['apiKey']);

    useEffect(()=>{
        if(password.length==0){
            setAlert(false)
        }
    },[password])

    let putPassword=(e)=>{
        setPassword(e.target.value)
       
    }

    let onClicklogin=async()=>{

        let response = await fetch (Commons.baseUrl+"/users/verification",{
        
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email : props.login,
                password: password
            })
        })

        if(response.ok){
            let data = await response.json()
            
            if(!data.apiKey){
                if(data.messege === "Incorrect password"){
                    setAlert(data.messege)
                }
            }
            if(data.apiKey){
                setObjectApiKey("apiKey", data.apiKey, { path: '/' } )
                console.log(cookieObjectApiKey)
            }
        }
  

    }

    return (
        <Box  pt={["20%","20%","16%","16%","16%"]} pl={["5%","5%","10%","15%","25%"]} pr={["5%","5%","10%","15%","25%"]}>
        <Box  border={"1px"} borderColor="lightgray" borderRadius={"lg"} display={"flex"} flexDirection={["column","column","row","row","row"]} >
            <Box p={"50px"}w={["100%","100%","50%","50%", "50%"]}  bg={"#F9F9F9"}>
                <Box m="10px" display={"flex"}>
                    <QqOutlined style={{fontSize: '30px', color: "#0077FF"} } />
                    <Text ml={"5px"} fontWeight={"bold"} fontSize="20px" color={"black"} >ID</Text>
                    
                </Box>
                <Text mb={"20px"} mt="20px" fontSize="19px"  color={"black"}>Sign in to Penguin with Penguin ID</Text>
                    <Box display={"flex"} alignItems={"center"} > 
                        <UserOutlined style={{fontSize: '20px'}}  /> 
                        <Text color={"#99A2AD"} m={"10px"} >Single account for VK and partner services</Text>
                        </Box>
                    <Box display={"flex"} alignItems={"center"}> 
                        <LoginOutlined style={{fontSize: '20px'}}/>
                        <Text color={"#99A2AD"} m={"10px"}>Quick login with the press of a button</Text>
                    </Box>
                    <Box display={"flex"} alignItems={"center"}>
                        <LockOutlined style={{fontSize: '20px'}}/> 
                        <Text color={"#99A2AD"} m={"10px"}>A secure account linked to your phone number</Text>
                    </Box>
            </Box>
            <Box p={"50px"} w={["100%","100%","50%","50%", "50%"]} display="flex" flexDirection={"column"} justifyContent="center" alignItems={"center"}>
                <QqOutlined style={{fontSize: '50px', color: "#0077FF"} } />
                <Text  mt={"20px"} mb={"20px"} fontSize="20px" color={"black"}>Enter your password</Text>
                <Text color={"#99A2AD"} mb={"20px"}>Enter the current password linked to {props.login}</Text>
                { alert &&  <Alert status='error' w={"80%"} borderRadius="3xl" >
                    <AlertIcon />
                    <AlertTitle>{alert}</AlertTitle>
                </Alert>}
                <Input color={"black"} onChange={putPassword} value={password} mb={"20px"} w={"80%"}  placeholder="Enter password"></Input>
                <Box  mb={"20px"} w={"80%"} display={"flex"} justifyContent={"flex-start"} alignItems="flex-start" >
                    <Checkbox color={"#99A2AD"} defaultChecked onChange={()=>setSaveUser(!saveUser)} >Save user</Checkbox>
                </Box>
                <Button w={"80%"} color="white" colorScheme={"none"} onClick={onClicklogin} bg={"#0077FF"}>Continue</Button>
               
            </Box> 
        </Box>
    </Box>
    )
}