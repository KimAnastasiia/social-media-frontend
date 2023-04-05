
import React,{useState, useEffect,useRef} from "react"
import { Box, Flex, Text, Button, Stack, Img, HStack,Avatar,Hide,Show ,Input,InputGroup,InputLeftElement,Alert,
    Image,
    AlertTitle,
    AlertDescription,
 } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import Commons from "../Utility/Commons";
import {MessageOutlined ,SmileOutlined,SendOutlined,HeartOutlined,EllipsisOutlined,BookOutlined} from '@ant-design/icons';
import { useCookies } from 'react-cookie'; 
import { useNavigate   } from "react-router-dom";
import { useParams } from "react-router-dom";
import FormatDate from "../Utility/FormatDate";


export default function PublicationDetails (props){
    const {id} = useParams()
    const navigate  = useNavigate();
    const [cookieObjectApiKey, setObjectApiKey, removeCookiObjectApiKey] = useCookies(['apiKey', "id", "email"]);
    const [publication, setPublication]=useState({})
    
    useEffect (()=>{ 
        dataOfpublication()
    },[])

    let dataOfpublication=async()=>{
        let response = await fetch(Commons.baseUrl+"/mediaPost/"+id+"?apiKey="+cookieObjectApiKey.apiKey)
        if(response.ok){
            let data = await response.json()
            if(!data.error){
                setPublication(data[0])
            }
        }
    }
    return(
        <Box  justifyContent={"center"} display={"flex"} pt={"100px"}>
            <Box w={"30%"} bg={"black"} justifyContent={"center"} display={"flex"}> 
                <Image src={Commons.baseUrl+"/images/"+cookieObjectApiKey.id+cookieObjectApiKey.email+publication.id+".png"} />
            </Box>
            <Box borderWidth={"3px"} borderColor={"black"} w={"30%"} >
                    <Box borderBottomWidth={"2px"} h={"10%"} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                        <Box pl={"2%"} w={"20%"} display={"flex"} justifyContent={"space-between"} alignItems={"center"} >
                            <Avatar size={"md"}></Avatar>
                            <Text>Mariia</Text>
                        </Box>
                        <Box  pr={"2%"}  >
                            <EllipsisOutlined style={{ fontSize: '25px' }}/>
                        </Box>
                    </Box>
                    <Box pr={"2%"} pl={"2%"} borderBottomWidth={"2px"} h={"70%"}>
                        <Text>{publication.comment}</Text>
                    </Box>
                    <Box  pl={"2%"} pr={"2%"}  justifyContent={"flex-start"} h={"15%"} >
                        <Box  h={"40%"} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                            <Box w={"18%"} justifyContent={"space-between"} display={"flex"}>
                                <HeartOutlined style={{ fontSize: '25px' }} />
                                <MessageOutlined style={{ fontSize: '25px' }}/>
                                <SendOutlined style={{ fontSize: '25px' }}/>
                            </Box>
                            <Box   w={"70%"} display={"flex"} justifyContent={"end"}>
                                <BookOutlined style={{ fontSize: '25px' }}/>
                            </Box>
                        </Box>
                        <Box h={"35%"} display={"flex"} justifyContent={"flex-start"}>
                            <Avatar mr={"1%"} size={"sm"}></Avatar>
                            <Text fontSize={"20px"}>who likes</Text>
                        </Box>
                        <Box h={"25%"}>
                            <Text fontSize={"12px"}>{FormatDate (publication.date)}</Text>
                        </Box>
                    </Box>
                    <Box borderTopWidth={"2px"} display={"flex"} alignItems={"center"} h={"5%"} >
                        <Box w={"10%"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                            <SmileOutlined style={{ fontSize: '25px' }}/>
                        </Box>
                        
                        <Input border={"none"} placeholder="Add a comment"></Input>
                    </Box>
             
            </Box>
        </Box>
    )
}