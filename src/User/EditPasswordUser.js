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
    const [user, setUser]=useState({})
    const [cookieObjectApiKey, setCookieObjectApiKey, removeCookiObjectApiKey] = useCookies(['apiKey', "id", "email"]);
    const [done, setDone]=useState(false)
    useEffect (()=>{ 
       if(newPasswordRepit.length==0){
        setErrorNewPassword(false)
       }
    },[newPasswordRepit])

    useEffect (()=>{ 

       setErrorPassword(false)
     
    },[previousPassword])


    let updatePassword=async()=>{
        let response = await fetch(Commons.baseUrl+"/users/checkPassword?apiKey="+cookieObjectApiKey.apiKey,{

            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body:
                JSON.stringify({ 
                    password:previousPassword
                })
        })
        if(response.ok){
            let data = await response.json()
            if(!data.error){
                if(data.message=="right"){
                    if(errorNewPassword==false && errorPassword==false){
                        let response = await fetch (Commons.baseUrl+"/users/password?apiKey="+cookieObjectApiKey.apiKey,{
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ 
                                password:newPassword
                            })
                        })
                        if(response.ok){
                            let data = await response.json()
                            if(data.message=="done"){
                                setDone(true)
                                setNewPassword("")
                                setNewPasswordRepit("")
                                setPreviousPassword("")
                            }
                        }
                    }
                }
            } else{
                setErrorPassword(true)
                setDone(false)
            }
        }


    }
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
            {done && <Box w={"100%"} mb={"30px"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <Alert w={"15%"}  status="success"  borderRadius="3xl" >
                    <AlertIcon />
                    <AlertTitle>Password changed successfully</AlertTitle>
                </Alert>
            </Box>}
            <Box borderRadius={"2xl"} p={"50px"}w={["90%","90%","70%","60%","30%"]} minH={["30vh"]}  borderWidth={"1px"} >
                {errorPassword && <Box display={"flex"} justifyContent={"end"} alignItems={"center"}>
                    <Alert w={"55%"}  status='error'  borderRadius="3xl" >
                        <AlertIcon />
                        <AlertTitle>Previous password is wrong</AlertTitle>
                    </Alert>
                </Box>}
                <Box  mb={"30px"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                    <Text  w={"50%"}>Previous password</Text>
                    <Input value={previousPassword} type="password" onChange={(e)=>{setPreviousPassword(e.target.value)}} w={"50%"}></Input>
                </Box>
                <Box  mb={"30px"}  display={"flex"} justifyContent={"center"} alignItems={"center"}>
                    <Text  w={"50%"}>New password</Text>
                    <Input value={newPassword} type="password" onChange={(e)=>{setNewPassword(e.target.value)}}  w={"50%"}></Input>
                </Box>
                {errorNewPassword && <Box  display={"flex"} justifyContent={"end"} alignItems={"center"}>
                    <Alert w={"50%"}  status='error'  borderRadius="3xl" >
                        <AlertIcon />
                        <AlertTitle>{errorNewPassword}</AlertTitle>
                    </Alert>
                </Box>}
                <Box  mb={"30px"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                    <Text w={"50%"}>Repit new password</Text>
                    <Input value={newPasswordRepit} type="password"  onChange={repitNewPasswordCheck} w={"50%"}></Input>
                </Box>
                
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                    <Button onClick={updatePassword}  bg={"#0077FF"} color="white">Save</Button>
                </Box>
    
            </Box>
        </Box>
    )
}