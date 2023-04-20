import { Box, Checkbox, Text, Button, Stack, Img, Badge,Avatar,Hide,Show ,Input,InputGroup,InputLeftElement,Alert,
    AlertIcon, AlertTitle} from "@chakra-ui/react";
import Commons from "../Utility/Commons";
import React,{useState, useEffect,useRef} from "react"
import { useCookies } from 'react-cookie'; 
import { Upload, Form } from 'antd';

export default function EditPasswordUser(props){

    const [previousPassword, setPreviousPassword]=useState("")
    const [newPassword, setNewPassword]=useState("")
    const [newPasswordRepit, setNewPasswordRepit]=useState("")
    const [errorNewPassword, setErrorNewPassword]=useState(false)
    const [errorPassword, setErrorPassword]=useState(false)

    useEffect (()=>{ 
       if(newPasswordRepit.length==0){
        setErrorNewPassword(false)
       }
    },[newPasswordRepit])

    let repitNewPasswordCheck=(e)=>{
        setNewPasswordRepit(e.target.value)
        if(e.target.value!=newPassword){
            setErrorNewPassword("Password mismatch")
        }else{
            setErrorNewPassword(false)
        }
    }
    return(
        <Box  minH={["80vh"]} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
            <Box w={"100%"} mb={"30px"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <Alert w={"15%"}  status="success"  borderRadius="3xl" >
                    <AlertIcon />
                    <AlertTitle>Password changed successfully</AlertTitle>
                </Alert>
            </Box>
            <Box borderRadius={"2xl"} p={"50px"}w={["90%","90%","70%","60%","30%"]} minH={["30vh"]}  borderWidth={"1px"} >
                {errorPassword && <Box display={"flex"} justifyContent={"end"} alignItems={"center"}>
                    <Alert w={"50%"}  status='error'  borderRadius="3xl" >
                        <AlertIcon />
                        <AlertTitle>{errorPassword}</AlertTitle>
                    </Alert>
                </Box>}
                <Box  mb={"30px"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                    <Text  w={"50%"}>Previous password</Text>
                    <Input type="password" onChange={(e)=>{setPreviousPassword(e.target.value)}} w={"50%"}></Input>
                </Box>
                <Box  mb={"30px"}  display={"flex"} justifyContent={"center"} alignItems={"center"}>
                    <Text  w={"50%"}>New password</Text>
                    <Input type="password" onChange={(e)=>{setNewPassword(e.target.value)}}  w={"50%"}></Input>
                </Box>
                {errorNewPassword && <Box  display={"flex"} justifyContent={"end"} alignItems={"center"}>
                    <Alert w={"50%"}  status='error'  borderRadius="3xl" >
                        <AlertIcon />
                        <AlertTitle>{errorNewPassword}</AlertTitle>
                    </Alert>
                </Box>}
                <Box  mb={"30px"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                    <Text w={"50%"}>Repit new password</Text>
                    <Input type="password"  onChange={repitNewPasswordCheck} w={"50%"}></Input>
                </Box>
                
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                    <Button  bg={"#0077FF"} color="white">Save</Button>
                </Box>
    
            </Box>
        </Box>
    )
}