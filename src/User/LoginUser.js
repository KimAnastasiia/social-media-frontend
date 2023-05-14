
import React,{useState, useEffect,useRef} from "react"
import { Box, Checkbox, Text, Button, Stack, Img, Badge,Avatar,Hide,Show ,Input,InputGroup,InputLeftElement,Alert,
AlertIcon, AlertTitle} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { SearchIcon } from '@chakra-ui/icons'
import {QqOutlined } from '@ant-design/icons';
import { useNavigate   } from "react-router-dom";
import Commons from "../Utility/Commons";


export default function LoginUser(props){


    const [email , setEmail]=useState("")
    const navigate  = useNavigate();
    const [emailError, setEmailError]=useState(false)

    useEffect(()=>{
        if(email.length==0){
            setEmailError(false)
        }
    },[email])

    const putEmail=(e)=>{
        setEmail(e.target.value)
        props.setEmail(e.target.value)
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

return (
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

        <Box w={["80%", "80%",  "100%", "100%","100%"]} borderRadius={"lg"}  p={"20px"} borderWidth={"1px"} display="flex" flexDirection={"column"} justifyContent="center" alignItems={"center"} >
            <Link w="100%" to={"/registration"}>
                <Button id="registration" color={"white"}  mb={"20px"} w={"80%"}  bg={"#4A8F06"}>Registration</Button>
            </Link>    
            <Text textAlign={"center"} w={"80%"} color="#555657">After signing up, you'll get access to all of Penguin ID's features</Text>
        </Box>

    </Box>
 </Box>   
)

}