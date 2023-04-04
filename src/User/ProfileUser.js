
import React,{useState, useEffect,useRef} from "react"
import { Box, Checkbox, Text, Button, Stack, Img, HStack,Avatar,Hide,Show ,Input,InputGroup,InputLeftElement,Alert,
    Image,
    AlertTitle,
    AlertDescription,
 } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Commons from "../Utility/Commons";
import {QqOutlined ,UserOutlined,LoginOutlined,LockOutlined} from '@ant-design/icons';
import { useCookies } from 'react-cookie'; 

export default function PrrofileUser(props){
    const [name, setName]=useState("")
    const [publicaciones, setPublicaciones]=useState(0)
    const [seguidores, setSeguidores]=useState(0)
    const [seguidos, setSeguidos]=useState(0)
    const [selectedFile, setSelectedFile] = useState(null);
    const [listOfImage, setlistOfimage]=useState([])
    const img = useRef(null)
    const [idImg, setIdImg]=useState([])
    const [cookieObjectApiKey, setObjectApiKey, removeCookiObjectApiKey] = useCookies(['apiKey', "id", "email"]);

    useEffect(()=>{
        signInOnClick()
        showImg()
    },[])

    let signInOnClick=async()=>{

        let response = await fetch(Commons.baseUrl+"/mediaPost?email="+props.email+"&apiKey="+cookieObjectApiKey.apiKey)
        if(response.ok){
            let data = await response.json()
            setName(data[0].name)
        }

    }
    let showImg = async()=>{

        let response = await fetch(Commons.baseUrl+"/mediaPost/post?apiKey="+cookieObjectApiKey.apiKey)
        if(response.ok){
            let data = await response.json()
            setIdImg(data)
            
        }

    }
    const onChangeFile = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    let publishPublication=async()=>{
        const formData = new FormData();
        formData.append('myImage', selectedFile);


        let response = await fetch (Commons.baseUrl+"/mediaPost?apiKey="+cookieObjectApiKey.apiKey,{
            method: 'POST',
            body:formData
        })
        img.current.value=""
        console.log(cookieObjectApiKey.apiKey)
        console.log(cookieObjectApiKey.id)
        signInOnClick()
    }
    return(
        <Box>
            <Box justifyContent={"center"}  pt="200px" display={"flex"}>
                
                    <Box w={"50%"} display={"flex"} justifyContent={"end"}>
                        <Stack direction='row' >
                            <Avatar size={"2xl"} src='https://bit.ly/broken-link' />
                        </Stack>
                    </Box>

                    <Box  w={"50%"}  ml={"6%"}  >
                        <Box display={"flex"} alignItems={"center"}>
                            <Text fontSize={"24px"}>{name}</Text>
                            <Button ml={"2%"}>Edit profile</Button>
                        </Box>
                        <Box mb={"2%"} mt={"2%"} w={"40%"} display={"flex"} justifyContent={"space-between"} >

                            <HStack>
                                <Text fontWeight={"bold"}>{publicaciones}</Text>  
                                <Text> publicaciones</Text>
                            </HStack>
                            <HStack>
                                <Text fontWeight={"bold"}>{seguidores}</Text>
                                <Text>seguidores</Text>
                            </HStack>
                            <HStack>
                                <Text fontWeight={"bold"}>{seguidos}</Text>
                                <Text>seguidos</Text>
                            </HStack>
                        </Box>
                        <Text>{name}</Text>
                        <Input
                            errorBorderColor='crimson'
                            name="myImage" 
                            type="file"
                            placeholder="Choose file"
                            accept=".png" 
                            w={"20%"}
                            mt={"2%"}
                            onChange={onChangeFile}
                            ref={img}
                        />
                    <Button onClick={publishPublication} ml={"1%"}>Post</Button>
                    </Box>
            
            
            </Box>
            <Box>
                {idImg.map((img)=>
                <Image  src={Commons.baseUrl+"/images/"+cookieObjectApiKey.id+cookieObjectApiKey.email+img.id+".png"} />)}
            </Box>
        </Box>
    )
}