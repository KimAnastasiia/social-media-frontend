
import { Box, Flex, Text, Button, AlertIcon, Textarea, Img, HStack,Avatar,Hide,Show ,Input,InputGroup,InputLeftElement,Alert,
    Image,
    AlertTitle,
    AlertDescription,
 } from "@chakra-ui/react";
import Commons from "../Utility/Commons";
import React,{useState, useEffect,useRef} from "react"
import { useCookies } from 'react-cookie'; 
import { Upload, Form } from 'antd';
export default function EditInformationUser(props){
    const [uniqueNameError, setUniqueNameError]=useState(false)
    const [user, setUser]=useState({})
    const [cookieObjectApiKey, setCookieObjectApiKey, removeCookiObjectApiKey] = useCookies(['apiKey', "id", "email", "uniqueName"]);
    const [myFile, setMyFile]=useState()
    const [alertDonePhoto, setAlertDonePhoto]=useState(false)
    const [numberError, setNumberError]=useState(false)
    let colorLightBlue = "#B4DCFF"
    const [emailAlreadyInUse, setEmailAlreadyInUse]=useState(false)
    const [emailError, setEmailError]=useState(false)
    useEffect (()=>{ 
        getUser()
    },[])

    let addName =(e)=>{
        setUser({...user,name:e.target.value})
    }
    let addSurname =(e)=>{
        setUser({...user,surname:e.target.value})
    }
    let addEmail =async(e)=>{
        setUser({...user,email:e.target.value})
        const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if(!re.test(String(e.target.value).toLowerCase())){
            setEmailError("Email is invalid")
        }else{
            setEmailError(false)
        }
        if(cookieObjectApiKey.email != e.target.value){

            let response = await fetch(Commons.baseUrl+"/public/users/email?email="+e.target.value)
            if(response.ok){
                let data = await response.json()
                if(data.errorEmail){
                    setEmailAlreadyInUse(true)
                }
                if(!data.error && !data.errorEmail){
                    setEmailAlreadyInUse(false)
                }
            }
        }
    }
    let addNumber =(e)=>{
        setUser({...user,phoneNumber:e.target.value})
    
        if( user.phoneNumber.match(/^[0-9]+$/) == null &&  user.phoneNumber.length>0){
            setNumberError("Phone number can have onle numbers")
            
        } else if( user.phoneNumber.length<12){
            setNumberError("Too short for phone number")
        }
        else if(  user.phoneNumber.match(/^[0-9]+$/) !== null &&  user.phoneNumber.length>12){
            setNumberError(false)
        }

    }

    let addUniqueName =(e)=>{
        setUser({...user,uniqueName:e.target.value})
    }
    let addPresentation =(e)=>{
        setUser({...user,presentation:e.target.value})
    }


    let getUser=async()=>{
        let response = await fetch(Commons.baseUrl+"/users?apiKey="+cookieObjectApiKey.apiKey)
        if(response.ok){
            let data = await response.json()
            if(!data.error){
               setUser(data[0])
            }
        }
    }
    let updateData = async()=>{
        if(!emailError && !emailAlreadyInUse && !numberError && !uniqueNameError){

            let response = await fetch (Commons.baseUrl+"/users?apiKey="+cookieObjectApiKey.apiKey,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    name: user.name,
                    surname: user.surname,
                    phoneNumber: user.phoneNumber,
                    email: user.email,
                    presentation: user.presentation,
                    uniqueName:user.uniqueName
                })
            })
            if(response.ok){
                setCookieObjectApiKey("uniqueName",user.uniqueName, { path: '/' } )
            }
        }

    }
    let chageValueImage =(file)=>{
        setMyFile(file)
    }

    let changePhoto=async()=>{
        const formData = new FormData();
        formData.append('myImage', myFile);
        let response = await fetch (Commons.baseUrl+"/users/photo?apiKey="+cookieObjectApiKey.apiKey,{
            method: 'PUT',
            body: formData
        })
        if(response.ok){
            let data = await response.json()
            if(data.message=="done"){
                setAlertDonePhoto(true)
            }
        }
    }
    let onBlurUniqueName=async(e)=>{

        if(cookieObjectApiKey.uniqueName!=e){
                let response = await fetch(Commons.baseUrl+"/public/users/uniqueName?uniqueName="+e)
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
        }
return(
    <Box  minH={["90vh"]} display={"flex"} justifyContent={"center"} alignItems={"center"}>
        <Box borderRadius={"2xl"} p={"50px"}w={["90%","90%","70%","60%","30%"]} minH={["70vh"]}  borderWidth={"1px"} >
            {alertDonePhoto&&
                <Alert w={"100%"} justifyContent={"center"} alignItems={"center"} display={"flex"} status="success"  borderRadius="3xl" >
                    <AlertIcon />
                    <AlertTitle>Photo updated successfully</AlertTitle>
                </Alert>
            }
            <Box mb={"30px"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <Box w={"50%"}>
                <Form.Item  name="image">
                    <Upload action={ (file) => {chageValueImage(file)} }  listType="picture">
                        <Avatar src={Commons.baseUrl+"/images/"+user.id+"avatar.png"} />
                    </Upload>
                </Form.Item>
                </Box>
                <Box  w={["70%","70%","50%","50%","50%"]}>
                    <Text >{user.uniqueName}</Text>
                    <Form.Item name="image">
                        <Upload  action={ (file) => {chageValueImage(file)} }  listType="picture">
                            <Button variant='outline' color={"#0077FF"}>change photo profile</Button>
                        </Upload>
                    </Form.Item>
                    <Button  onClick={changePhoto} color={"#0077FF"} variant='outline'>Update photo</Button>
                </Box>
            </Box>
            <Box  mb={"30px"} display={["block","block","flex","flex","flex"]} justifyContent={"center"} alignItems={"center"}>
                <Text  w={"50%"}>Name</Text>
                <Input onChange={addName} value={user.name} w={["100%","100%","50%","50%","50%"]}></Input>
            </Box>
            <Box  mb={"30px"} display={["block","block","flex","flex","flex"]}  justifyContent={"center"} alignItems={"center"}>
                <Text  w={"50%"}>Surname</Text>
                <Input onChange={addSurname} value={user.surname} w={["100%","100%","50%","50%","50%"]}></Input>
            </Box>
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <Text color={"lightgray"} >To help people discover your account, use the name people know you by, whether it's your full name, nickname, or business name.
You can only change the group name twice within a 14-day period.</Text>
            </Box>
            {uniqueNameError && 
                <Alert status='error' w={["100%","100%","80%","80%","80%"]} borderRadius="3xl" >
                    <AlertIcon />
                    <AlertTitle>Such a unique username already exists</AlertTitle>
                </Alert>}
            <Box  mb={"30px"} display={["block","block","flex","flex","flex"]} justifyContent={"center"} alignItems={"center"}>
                <Text w={"50%"}>Username</Text>
                <Input onBlur={(e)=>{onBlurUniqueName(e.target.value)}}  onChange={addUniqueName}  value={user.uniqueName}  w={["100%","100%","50%","50%","50%"]}></Input>
            </Box>
           
            <Box  mb={"30px"} display={["block","block","flex","flex","flex"]}  justifyContent={"center"} alignItems={"center"}>
                <Text w={"50%"}>Presentation</Text>
                <Textarea onChange={addPresentation} value={user.presentation} w={["100%","100%","50%","50%","50%"]}></Textarea>
            </Box>
            {numberError &&
            <Alert status='error'  w={["100%","100%","80%","80%","80%"]} borderRadius="3xl" >
                    <AlertIcon />
                    <AlertTitle>{numberError}</AlertTitle>
                </Alert>}
            <Box   mb={"30px"} display={["block","block","flex","flex","flex"]}  justifyContent={"center"} alignItems={"center"}>
                <Text w={"50%"}>Number</Text>
                <Input  onChange={addNumber}  value={user.phoneNumber}  w={["100%","100%","50%","50%","50%"]}></Input>
            </Box>
            {emailError && <Alert status='error'  w={["100%","100%","80%","80%","80%"]} borderRadius="3xl" >
                    <AlertIcon />
                    <AlertTitle>Wrong email</AlertTitle>
                </Alert>}
                {emailAlreadyInUse && <Alert status='error'  w={["100%","100%","80%","80%","80%"]} borderRadius="3xl" >
                    <AlertIcon />
                    <AlertTitle>Email already in use</AlertTitle>
                </Alert>}
            <Box  mb={"30px"} display={["block","block","flex","flex","flex"]}  justifyContent={"center"} alignItems={"center"}>
                <Text w={"50%"}>Email</Text>
                <Input onChange={addEmail}  value={user.email}  w={["100%","100%","50%","50%","50%"]}></Input>
            </Box>
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <Button w={["100%","90%","80%","70%","60%"]} onClick={updateData} color="black" bg={colorLightBlue} >Save</Button>
            </Box>

        </Box>
    </Box>
)
}