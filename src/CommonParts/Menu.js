
import React,{useState, useEffect} from "react"
import { Box, Flex, Text, Button, Stack, Img, Badge,Avatar,Hide,Show ,Input,InputGroup,InputLeftElement} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { SearchIcon } from '@chakra-ui/icons'
import {QqOutlined } from '@ant-design/icons';
export default function Menu(props){

return (
 
   <Flex w="100%" bg="lightblue"  zIndex="sticky" as="nav" align="center" justify={["space-between" ,"space-between" ,"space-between" ,"space-around" , "space-around"]} position={"fixed"}>
 
        <Stack
          
            spacing={8}
            align="center"
            justify={"space-around"}
            direction={"row"}
            pt={[4, 4, 0, 0]}
            w={'100%'}
        >

    <Box  w={"20%"} mt={"10px"} mb={"10px"} display="flex" alignItems={"center"} justifyContent="space-between" >
            <QqOutlined style={{fontSize: '30px', color: "#0077FF"} } />
            <InputGroup w={"50%"} >
                <InputLeftElement
                    pointerEvents='none'
                    children={<SearchIcon color='gray.300' />}
                />
                <Input placeholder="Search" 
                bg={"white"}>
                </Input>
            </InputGroup>
    </Box>        
           
        </Stack>
   </Flex>   
);
}