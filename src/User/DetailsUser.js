
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

export default function DetailsUser(props){

    const [publicaciones, setPublicaciones]=useState(0)
    const [seguidores, setSeguidores]=useState(0)
    const [seguidos, setSeguidos]=useState(0)


    const [posts, setPosts]=useState([])
    const [user, setUser]=useState({})
    const {uniqueName} = useParams()
    const navigate  = useNavigate();

    const img = useRef(null)
    const [selectedFile, setSelectedFile] = useState(null);
    const [cookieObjectApiKey, setObjectApiKey, removeCookiObjectApiKey] = useCookies(['apiKey', "id", "email"]);
    const [comment, setComment]=useState("")


    useEffect(()=>{
        getUser()
        console.log("id: "+cookieObjectApiKey.id)
    },[uniqueName])

    let getUser=async()=>{
        let response = await fetch(Commons.baseUrl+"/users/"+uniqueName)
        if(response.ok){
            let data = await response.json()
            setUser(data[0])
            getPosts(data[0].id)
        }

    }

    let getPosts=async(uid)=>{

        let response = await fetch(Commons.baseUrl+"/mediaPost?userId="+uid)
        if(response.ok){
            let data = await response.json()
            setPosts(data)
        }

    }
    
    const onChangeFile = (event) => {
        setSelectedFile(event.target.files[0]);
    };


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
        getUser()
       
    }


    return(
        <Box  display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}  >
            <Box alignItems={"center"}   justifyContent={"center"}  pt="200px" display={"flex"}>
                
                    <Box w={"30%"} display={"flex"} >
                        <Stack direction='row' >
                            <Avatar size={"2xl"} src='https://bit.ly/broken-link' />
                        </Stack>
                    </Box>

                    <Box  w={"70%"}  ml={"6%"}  >

                        <Box display={"flex"} alignItems={"center"} justifyContent={"space-around"}>
                            <Text fontSize={"24px"}>{user.uniqueName}</Text>
                            {cookieObjectApiKey.id==user.id &&<Button >Edit profile</Button>}
                        </Box>

                        <Box mb={"2%"} mt={"2%"} w={"80%"} display={"flex"} justifyContent={"space-between"} >

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
                        <Text>{user.name}</Text>
                        {cookieObjectApiKey.id==user.id &&
                        <div>
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
                        </div>}
                    </Box>
            </Box>
            <Box mt={"60px"} h={"309px"} w={["90%","90%","100%","90%","60%"]} display={"flex"} justifyContent={["center"]} flexWrap={"wrap"}>
                {posts.map((post)=>
                    <Box h={"100%"}  display={"flex"} alignItems={"center"}  flexDirection={"column"} w={"25%"} m={"0.3%"} justifyContent={"center"}>
                        <Image h="100%" onClick={()=>{navigate("/mediaPost/"+post.id)}} w={["100%"]} src={Commons.baseUrl+"/images/"+user.id+user.email+post.id+"mini.png"} />
                    </Box>
                )}
            </Box>
        </Box>
    )
}