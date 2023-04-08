
import React,{useState, useEffect,useRef} from "react"
import { Box, Flex, Text, Button, Stack, Img, HStack,Avatar,Hide,Show ,Input,InputGroup,InputLeftElement,Alert,
    Image,
    AlertTitle,
    AlertDescription,
 } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Commons from "../Utility/Commons";
import {AppstoreAddOutlined} from '@ant-design/icons';
import { useCookies } from 'react-cookie'; 
import { useNavigate   } from "react-router-dom";
import FormatDate from "../Utility/FormatDate";

export default function CreatePublication(props){

    const [selectedFile, setSelectedFile] = useState(null);
    const [comment, setComment]=useState("")
    const img = useRef(null)
    const [cookieObjectApiKey, setCookieObjectApiKey, removeCookiObjectApiKey] = useCookies(['apiKey', "id", "email"]);
    
    let publishPublication=async()=>{
        const formData = new FormData();
        formData.append('myImage', selectedFile);
        formData.append('comment', comment);
        if(selectedFile!==null){
            let response = await fetch (Commons.baseUrl+"/mediaPost?apiKey="+cookieObjectApiKey.apiKey,{
                method: 'POST',
                body:formData
            })
        }
        img.current.value=""
        setComment("")
        console.log(cookieObjectApiKey.apiKey)
        console.log(cookieObjectApiKey.id)
    }


    const onChangeFile = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    return(
        <Box  pt="100px" minH={["90vh"]} alignItems={"center"} justifyContent={"center"} display={"flex"} flexDirection={"column"} >
            <Box borderRadius={"2xl"} w={["80%", "80%", "70%","50%", "30%"]} minH={["60vh"]}  borderWidth={"1px"} borderColor={"lightgray"}  display={"flex"} flexDirection={"column"}>
                
                <Box minH={["5vh"]} display={"flex"} justifyContent={"center"} alignItems={"center"}  borderColor={"lightgray"} borderBottomWidth={"1px"}>
                    <Text fontSize={"xl"} textAlign={"center"} >Make your new post</Text>
                </Box>
                <Box flexDirection={"column"}  minH={["60vh"]}  display={"flex"} justifyContent={"center"} alignItems={"center"} >
                    <img  src="/images/photo-svgrepo-com.svg" ></img>
                    <Text fontSize={"xl"} >Drag photos and videos here</Text>
                    <Input
                        errorBorderColor='crimson'
                        name="myImage" 
                        type="file"
                        placeholder="Select from computer"
                        accept=".png" 
                        mt={"2%"}
                        mb={"1%"}
                        onChange={onChangeFile}
                        ref={img}
                        w={["40%"]}
                    />
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