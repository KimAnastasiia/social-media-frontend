
import React,{useState, useEffect} from "react"
import { Box, Checkbox, Text, Button, Stack, Img, Badge,Avatar,Hide,Show ,Input,InputGroup,InputLeftElement} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { SearchIcon } from '@chakra-ui/icons'
import {QqOutlined } from '@ant-design/icons';


export default function LoginUser(props){
    const [email , setEmail]=useState("")

    const putEmail=(e)=>{
        setEmail(e.target.value)
        props.setLogin(e.target.value)
    }

return (
<Box pt="200px" display={"flex"} justifyContent="center"  >
    <Box mr={"20px"}  >
        <Text textAlign={"center"} fontSize="2xl" fontWeight={"bold"} >Penguin for mobile devices</Text>
        <Text textAlign={"center"} color="#555657" >Install our official mobile app and stay in touch with your friends anytime and anywhere.</Text>
        <Box m={"20px"} display={"flex"} justifyContent="center" >
            <img  src="/images/pYORDwKmdDI.png" ></img>
            <img src="/images/VD3VpchXcC8.png" ></img>
        </Box>
    </Box>
    <Box ml={"20px"} >
        <Box mb={"30px"} borderRadius={"lg"} bg="lightblue" h="300px" display="flex" flexDirection={"column"} justifyContent="center" alignItems={"center"}>
            <Text m={"30px"} fontWeight="bold" fontSize="2xl" textAlign={"center"}>Sign in to Penguin</Text>
            <Input
            onChange={putEmail}
            errorBorderColor='crimson'
            bg={"white"}
            w={"80%"}
            placeholder="Phone or email">
            </Input>
            <Box mt={"20px"} mb={"20px"} w="80%" display={"flex"} justifyContent={"flex-start"} alignItems="flex-start" >
                <Checkbox defaultChecked>Save user</Checkbox>
            </Box>
            
            <Link w="100%" to={"/verification/password"}>
                <Button color={"white"}  bg={"#0077FF"} w={"100%"} >Sign in</Button>
            </Link>
        </Box>

        <Box borderRadius={"lg"}  p={"20px"} bg={"lightblue"} display="flex" flexDirection={"column"} justifyContent="center" alignItems={"center"} >
            <Link w="100%" to={"/registration"}>
                <Button color={"white"}  mb={"20px"} w={"80%"}  bg={"#4BB34B"}>Registration</Button>
            </Link>    
            <Text textAlign={"center"} w={"80%"} color="#555657">After signing up, you'll get access to all of Penguin ID's features</Text>
        </Box>

    </Box>
 </Box>   
)

}