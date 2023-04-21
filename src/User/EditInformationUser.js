
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

    const [user, setUser]=useState({})
    const [cookieObjectApiKey, setCookieObjectApiKey, removeCookiObjectApiKey] = useCookies(['apiKey', "id", "email", "uniqueName"]);
    const [myFile, setMyFile]=useState()
    const [alertDonePhoto, setAlertDonePhoto]=useState(false)
   
    useEffect (()=>{ 
        getUser()
    },[])

    let addName =(e)=>{
        setUser({...user,name:e.target.value})
    }
    let addSurname =(e)=>{
        setUser({...user,surname:e.target.value})
    }
    let addEmail =(e)=>{
        setUser({...user,email:e.target.value})
    }
    let addNumber =(e)=>{
        setUser({...user,phoneNumber:e.target.value})
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
                <Box w={"50%"}>
                    <Text >{user.uniqueName}</Text>
                    <Form.Item name="image">
                        <Upload  action={ (file) => {chageValueImage(file)} }  listType="picture">
                            <Button variant='link' color={"#0077FF"}>change photo profile</Button>
                        </Upload>
                    </Form.Item>
                    <Button  bg={"#0077FF"} color="white" onClick={changePhoto} >Update photo</Button>
                </Box>
            </Box>
            <Box  mb={"30px"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <Text  w={"50%"}>Name</Text>
                <Input onChange={addName} value={user.name} w={"50%"}></Input>
            </Box>
            <Box  mb={"30px"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <Text  w={"50%"}>Surname</Text>
                <Input onChange={addSurname} value={user.surname} w={"50%"}></Input>
            </Box>
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <Text color={"lightgray"} >To help people discover your account, use the name people know you by, whether it's your full name, nickname, or business name.
You can only change the group name twice within a 14-day period.</Text>
            </Box>
            <Box  mb={"30px"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <Text w={"50%"}>Username</Text>
                <Input  onChange={addUniqueName}  value={user.uniqueName}  w={"50%"}></Input>
            </Box>
            <Box  mb={"30px"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <Text w={"50%"}>Presentation</Text>
                <Textarea onChange={addPresentation} value={user.presentation} w={"50%"}></Textarea>
            </Box>
            <Box   mb={"30px"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <Text w={"50%"}>Number</Text>
                <Input  onChange={addNumber}  value={user.phoneNumber}  w={"50%"}></Input>
            </Box>
            <Box  mb={"30px"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <Text w={"50%"}>Email</Text>
                <Input  onChange={addEmail}  value={user.email}  w={"50%"}></Input>
            </Box>
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <Button onClick={updateData} bg={"#0077FF"} color="white">Save</Button>
            </Box>

        </Box>
    </Box>
)
}