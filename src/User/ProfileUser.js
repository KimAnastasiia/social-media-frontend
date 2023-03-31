
import React,{useState, useEffect} from "react"
import { Box, Checkbox, Text, Button, Stack, Img, HStack,Avatar,Hide,Show ,Input,InputGroup,InputLeftElement,Alert,
    AlertIcon,
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
    useEffect(()=>{
        signInOnClick()
    })

    let signInOnClick=async()=>{

        let response = await fetch(Commons.baseUrl+"/users?email="+"b")
        if(response.ok){
            let data = await response.json()
            setName(data[0].name)
        }

    }

    return(
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
            </Box>
        </Box>
    )
}