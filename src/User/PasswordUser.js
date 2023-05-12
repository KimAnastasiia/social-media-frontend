import React,{useState, useEffect} from "react"
import { Box, Checkbox, Text, Button, Alert, AlertIcon, AlertTitle,Avatar,Hide,Show ,Input,InputGroup,InputLeftElement} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {QqOutlined ,UserOutlined,LoginOutlined,LockOutlined} from '@ant-design/icons';
import Commons from "../Utility/Commons";
import { useCookies } from 'react-cookie'; 
import { useNavigate   } from "react-router-dom";

export default function PasswordUser(props){

    const [password, setPassword]=useState("")
    const [alert, setAlert] = useState(false)
    const [cookieObjectApiKey, setCookieObjectApiKey, removeCookiObjectApiKey] = useCookies(['apiKey', "id", "email","uniqueName"]);
    const navigate  = useNavigate();

    useEffect(()=>{
        if(password.length==0){
            setAlert(false)
        }
    },[password])

    let putPassword=(e)=>{
        setPassword(e.target.value)
       
    }

    let onClicklogin=async()=>{

        let response = await fetch (Commons.baseUrl+"/public/users/verification",{
        
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email : props.email,
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
                setCookieObjectApiKey("apiKey", data.apiKey, { path: '/' } )
                setCookieObjectApiKey("id",  data.userId, { path: '/' } )
                setCookieObjectApiKey("email", data.email, { path: '/' } )
                setCookieObjectApiKey("uniqueName", data.uniqueName, { path: '/' } )
                console.log("id: "+cookieObjectApiKey.id)
                navigate("/users/"+data.uniqueName)
            }
        }
  

    }

    return (
        <Box display={"flex"} alignItems={"center"} minH={["89vh"]} justifyContent={"center"}>
        <Box  border={"1px"} borderColor="lightgray" borderRadius={"lg"} display={"flex"} flexDirection={["column","column","row","row","row"]} >
            <Box p={"50px"}w={["100%","100%","50%","50%", "50%"]}  bg={"#F9F9F9"}>
                <Box m="10px" display={"flex"}>
                    <QqOutlined style={{fontSize: '30px', color: "#142C8E"} } />
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
                <QqOutlined style={{fontSize: '50px', color: "#142C8E"} } />
                <Text  mt={"20px"} mb={"20px"} fontSize="20px" color={"black"}>Enter your password</Text>
                <Text color={"#99A2AD"} mb={"20px"}>Enter the current password linked to {props.email}</Text>
                { alert &&  <Alert status='error' w={"80%"} borderRadius="3xl" >
                    <AlertIcon />
                    <AlertTitle>{alert}</AlertTitle>
                </Alert>}
                <Input id="password" color={"black"} onChange={putPassword} value={password} mb={"20px"} w={"80%"} type={"password"} placeholder="Enter password"></Input>
                <Button id="continue" w={"80%"} color="white" colorScheme={"none"} onClick={onClicklogin} bg={"#142C8E"}>Continue</Button>
            </Box> 
        </Box>
    </Box>
    )
}