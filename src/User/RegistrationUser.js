
import React,{useState, useEffect} from "react"
import { Box, Checkbox, Text, Button, Stack, Img, Badge,Avatar,Hide,Show ,Input,InputGroup,InputLeftElement,Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
 } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Commons from "../Utility/Commons";
import {QqOutlined ,UserOutlined,LoginOutlined,LockOutlined} from '@ant-design/icons';
import { useCookies } from 'react-cookie'; 
import { useNavigate   } from "react-router-dom";
export default function RegistrationUser(props){

    const [disabledButton , setDisabledButton]=useState(true)
    const [saveUser , setSaveUser]=useState(false)
    const [email , setEmail]=useState("")
    const [phoneNumber , setPhoneNumber]=useState("")
    const [password , setPassword]=useState("")
    const [passwordCheck, setPasswordCheck ]=useState("")
    const [name , setName]=useState("")
    const [surname , setSurname]=useState("")
    const [uniqueName , setUniqueName]=useState("")
    const [emailAlreadyInUse, setEmailAlreadyInUse]=useState(false)
    const [emailError, setEmailError]=useState(false)
    const [passwordError, setPasswordError]=useState(false)
    const [passwordCheckError, setPasswordCheckError]=useState(false)
    const [numberError, setNumberError]=useState(false)
    const [uniqueNameError, setUniqueNameError]=useState(false)
    const [cookieObjectApiKey, setCookieObjectApiKey, removeCookiObjectApiKey] = useCookies(['apiKey', "id", "email","uniqueName"]);
    const navigate  = useNavigate();

    useEffect(()=>{

        if(!emailError && email.length!==0 && phoneNumber.length!==0 && password.length!==0  && surname.length!=0 && passwordCheck.length!==0  && name.length!==0 && !passwordError && !passwordCheckError && !numberError){
            setDisabledButton(false)
        }else{
            setDisabledButton(true)
        }
        if(password.length==0){
            setPasswordError(false)
        }


        if(phoneNumber.length==0){
            setNumberError(false)
        }

        if(email.length==0){
            setEmailError(false)
            setEmailAlreadyInUse(false)
        }
        setEmailAlreadyInUse(false)
    },[email,phoneNumber, name, surname,passwordCheck,password])

    useEffect(()=>{

        if(passwordCheck.length===0){
            setPasswordCheckError(false)
        }else if(password===passwordCheck){
            setPasswordCheckError(false)
        }else if(password!==passwordCheck){
            setPasswordCheckError(true)
        }

    },[passwordCheck])

    useEffect(()=>{
        setUniqueNameError(false)

    },[uniqueName])
    let putPhoneNumber=(e)=>{

        let myNumber = e.target.value;
        setPhoneNumber(myNumber) 
    
        if( myNumber.match(/^[0-9]+$/) == null && myNumber.length>0){
            setNumberError("Phone number can have onle numbers")
            
        } else if(myNumber.length<12){
            setNumberError("Too short for phone number")
        }
        else if( myNumber.match(/^[0-9]+$/) !== null && myNumber.length>12){
            setNumberError(false)
        }
    }


    let onChangePassword=(e)=>{

        setPassword(e.target.value)

        if(password.length<= 5){
            setPasswordError(true)
        }else{
            setPasswordError(false)
        }

    }

    let onChangePasswordCheck=(e)=>{
        setPasswordCheck(e.target.value)
    }

    let putEmail =(e)=>{
        setEmail(e.target.value)
        const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if(!re.test(String(e.target.value).toLowerCase())){
            setEmailError("Email is invalid")
        }else{
            setEmailError(false)
        }
    }

    let makeAccount=async()=>{

        let response = await fetch (Commons.baseUrl+"/public/users",{

            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body:
                JSON.stringify({ 
                    email:email,
                    password:passwordCheck,
                    name: name,
                    surname:surname,
                    phoneNumber:phoneNumber,
                    uniqueName:uniqueName
                })
        })
        if(response.ok){
            let data = await response.json()
            if(data.apiKey){
                setCookieObjectApiKey("apiKey", data.apiKey, { path: '/' } )
                setCookieObjectApiKey("id", data.userId, { path: '/' } )
                setCookieObjectApiKey("email", data.email, { path: '/' } )
                setCookieObjectApiKey("uniqueName", data.uniqueName, { path: '/' } )
                console.log(cookieObjectApiKey)
                navigate("/users/"+data.uniqueName)
            }
            if(data.error=="error in email"){
                setEmailAlreadyInUse(data.messege)
            }
            else if(data.error=="error in unique name"){
                setUniqueNameError(true)
            }
            else{
                setEmailAlreadyInUse(false)
                setUniqueNameError(false)
            }
        }
      
    }
    let onBlurUniqueName=async()=>{
        let response = await fetch(Commons.baseUrl+"/public/users/uniqueName?uniqueName="+uniqueName)
        if(response.ok){
            let data = await response.json()
            if(data.errorUniqueName){
                setUniqueNameError(true)
            }
            if(!data.error && !data.errorUniqueName){
                setUniqueNameError(false)
            }
        }
    }
return(
    <Box display={"flex"} alignItems={"center"} minH={["89vh"]} justifyContent={"center"}>
        <Box display={"flex"} flexDirection={["column","column","row","row","row"]}  border={"1px"} borderColor="lightgray" borderRadius={"lg"} >
            <Box p={"50px"}  bg={"#F9F9F9"}  w={["100%","100%","50%","50%", "50%"]}>
                <Box m="10px" display={"flex"}>
                    <QqOutlined style={{fontSize: '30px', color: "#0077FF"} } />
                    <Text ml={"5px"} fontWeight={"bold"} fontSize="20px" color={"black"} >ID</Text>  
                </Box>
                <Text  mb={"20px"} mt="20px" fontSize="19px"  color={"black"}>Sign in to Penguin with Penguin ID</Text>
                    <Box color={"#99A2AD"} display={"flex"} alignItems={"center"} > 
                        <UserOutlined style={{fontSize: '20px'}}  /> 
                        <Text m={"10px"} >Single account for Penguin  and partner services</Text>
                        </Box>
                    <Box color={"#99A2AD"} display={"flex"} alignItems={"center"}> 
                        <LoginOutlined style={{fontSize: '20px'}}/>
                        <Text m={"10px"}>Quick login with the press of a button</Text>
                    </Box>
                    <Box color={"#99A2AD"}display={"flex"} alignItems={"center"}>
                        <LockOutlined style={{fontSize: '20px'}}/> 
                        <Text m={"10px"}>A secure account linked to your phone number</Text>
                    </Box>
            </Box>
            <Box p={"50px"} w={["100%","100%","50%","50%", "50%"]} display="flex" flexDirection={"column"} justifyContent="center" alignItems={"center"}>
                <QqOutlined style={{fontSize: '50px', color: "#0077FF"} } />
                <Text  mt={"20px"} mb={"20px"} fontSize="20px" color={"black"}>Enter phone number</Text>
                <Text  color={"#99A2AD"} mb={"20px"}>You'll use your phone number to sign in to your account</Text>
                <Input color={"black"} onChange={(e)=>setName(e.target.value)} value={name} mb={"20px"} w={"80%"}  placeholder="Name"></Input>
                {uniqueNameError && <Alert status='error' w={"80%"} borderRadius="3xl" >
                    <AlertIcon />
                    <AlertTitle>Such a unique username already exists</AlertTitle>
                </Alert>}
                <Input color={"black"} onChange={(e)=>setUniqueName(e.target.value)} onBlur={onBlurUniqueName}  value={uniqueName} mb={"20px"} w={"80%"}  placeholder="Unique name"></Input>
                <Input color={"black"} onChange={(e)=>setSurname(e.target.value)} value={surname} mb={"20px"} w={"80%"}  placeholder="Surname"></Input>
                {passwordError && <Alert status='error' w={"80%"} borderRadius="3xl" >
                    <AlertIcon />
                    <AlertTitle>Too short password</AlertTitle>
                </Alert>}
                <Input color={"black"} onChange={onChangePassword} value={password} mb={"20px"} w={"80%"}  placeholder="Password"></Input>
                {passwordCheckError && <Alert status='error' w={"80%"} borderRadius="3xl" >
                    <AlertIcon />
                    <AlertTitle>Password mismatch</AlertTitle>
                </Alert>}
                <Input color={"black"} onChange={onChangePasswordCheck} value={passwordCheck} mb={"20px"} w={"80%"}  placeholder="Password check"></Input>
                {numberError && <Alert status='error' w={"80%"} borderRadius="3xl" >
                    <AlertIcon />
                    <AlertTitle>{numberError}</AlertTitle>
                </Alert>}
                <Input color={"black"}  onChange={putPhoneNumber} value={phoneNumber} mb={"20px"} w={"80%"}  placeholder="Phone number"></Input>
                {emailError && <Alert status='error' w={"80%"} borderRadius="3xl" >
                    <AlertIcon />
                    <AlertTitle>Wrong email</AlertTitle>
                </Alert>}
                {emailAlreadyInUse && <Alert status='error' w={"80%"} borderRadius="3xl" >
                    <AlertIcon />
                    <AlertTitle>Email already in use</AlertTitle>
                </Alert>}
                <Input color={"black"} onChange={putEmail} value={email} mb={"20px"} w={"80%"}  placeholder="Email"></Input>

                <Box  mb={"20px"} w={"80%"} display={"flex"} justifyContent={"flex-start"} alignItems="flex-start" >
                    <Checkbox color={"#99A2AD"} defaultChecked onChange={()=>setSaveUser(!saveUser)} >Save user</Checkbox>
                </Box>

                <Button onClick={makeAccount} w={"81%"} color="white" colorScheme={"none"} isDisabled={disabledButton}  _disabled={{ bg: "#79AEEB", colorScheme: "none"}} bg={"#0077FF"}>Continue</Button>
                
            </Box> 
        </Box>
    </Box>
)
}