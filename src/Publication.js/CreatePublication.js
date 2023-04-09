
import React,{useState, useEffect,useRef} from "react"
import { Box, Flex, Text, Button ,Input,InputGroup,InputLeftElement,Alert,Image} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Commons from "../Utility/Commons";

import { useCookies } from 'react-cookie'; 
import { useNavigate   } from "react-router-dom";

import { Upload, Form } from 'antd';



export default function CreatePublication(props){


    const [comment, setComment]=useState("")
    const [cookieObjectApiKey, setCookieObjectApiKey, removeCookiObjectApiKey] = useCookies(['apiKey', "id", "email"]);
    const [myFile, setMyFile]=useState()


    let publishPublication=async()=>{
        const formData = new FormData();
        formData.append('myImage', myFile);
        formData.append('comment', comment);
        if(myFile!==null){
            let response = await fetch (Commons.baseUrl+"/mediaPost?apiKey="+cookieObjectApiKey.apiKey,{
                method: 'POST',
                body:formData
            })
        }

        setComment("")
        console.log(cookieObjectApiKey.apiKey)
        console.log(cookieObjectApiKey.id)

    }

    let chageValueImage =(file)=>{
        setMyFile(file)
        console.log("Test")
    }

    return(
        <Box  pt="100px" minH={["90vh"]} alignItems={"center"} justifyContent={"center"} display={"flex"} flexDirection={"column"} >
            <Box borderRadius={"2xl"} w={["80%", "80%", "70%","50%", "30%"]} minH={["60vh"]}  borderWidth={"1px"} borderColor={"lightgray"}  display={"flex"} flexDirection={"column"}>
                
                <Box minH={["5vh"]} display={"flex"} justifyContent={"center"} alignItems={"center"}  borderColor={"lightgray"} borderBottomWidth={"1px"}>
                    <Text fontSize={"xl"} textAlign={"center"} >Make your new post</Text>
                </Box>
                <Box flexDirection={"column"}  minH={["60vh"]}  display={"flex"} justifyContent={"center"} alignItems={"center"} >
                    
                    <Box  w={"100%"} display={"flex"} justifyContent={"center"}>
                        <Form.Item name="image">
                            <Upload  action={ (file) => {chageValueImage(file)} }  listType="picture">
                                <Text  style={{fontSize: '20px', width:"400px", borderWidth:"1px", borderStyle:"dashed solid", padding:"10px", textAlign:"center" }} >
                                    <Box display={"flex"} justifyContent={"center"}>
                                        <img  src="/images/photo-svgrepo-com.svg" ></img>
                                    </Box>
                                    <Text mb={"20px"}>Click or drag file to this area to upload </Text>
                                </Text>
                            </Upload>
                        </Form.Item>
                    </Box>
                    <Input
                        placeholder="Add a comment to your post"
                        w={["40%"]}
                        mb={"2%"}
                        onChange={(e)=>setComment(e.target.value)}
                        value={comment}
                    />
               
                    <Flex mt={"4%"} w={"100%"} justifyContent={"center"}  >
                        <Button color={"white"} w={"50%"} bg="#0077FF" onClick={publishPublication} >Post</Button>
                    </Flex>
                    
                </Box>
            </Box>
        </Box>
    )
}