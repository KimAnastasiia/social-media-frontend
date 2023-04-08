
import React,{useState, useEffect,useRef} from "react"
import { Box, Flex, Text, Button, Stack, Img, HStack,Avatar,Hide,Show ,Input,InputGroup,InputLeftElement,Alert,
    Image,
    AlertTitle,
    AlertDescription,
 } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Commons from "../Utility/Commons";
import {QqOutlined ,UserOutlined,LoginOutlined,LockOutlined} from '@ant-design/icons';
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
        <Box>
            <Input
                errorBorderColor='crimson'
                name="myImage" 
                type="file"
                placeholder="Choose file"
                accept=".png" 
                w={"100%"}
                mt={"2%"}
                onChange={onChangeFile}
                ref={img}
                
            />
            <Input
                placeholder="Add a comment to your post"
                w={"100%"}
                mt={"2%"}
                mb={"2%"}
                onChange={(e)=>setComment(e.target.value)}
                value={comment}
            />
            <Flex justifyContent={"center"}>
                <Button w="70%" onClick={publishPublication} ml={"1%"}>Post</Button>
            </Flex>
        </Box>
    )
}