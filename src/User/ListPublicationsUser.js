import React,{useState, useEffect,useRef} from "react"
import { useNavigate   } from "react-router-dom";
import { Box, Flex, Text, Button, Stack, Img, HStack,Avatar,Hide,Show ,Input,InputGroup,InputLeftElement,Alert,
    Image,
    AlertTitle,
    AlertDescription,
 } from "@chakra-ui/react";
import Commons from "../Utility/Commons";

export default function ListPublicationsUser(props){
    
    const navigate  = useNavigate();
    const [posts, setPosts]=useState([])
    const [user, setUser]=useState({})

    useEffect(()=>{
        getUser()
    },[props.uniqueName])

    let getUser=async()=>{
        let response = await fetch(Commons.baseUrl+"/public/users/"+props.uniqueName)
        if(response.ok){
            let data = await response.json()
            getPosts(data[0].id)
            setUser(data[0])
        }

    } 
    let getPosts=async(uid)=>{

        let response = await fetch(Commons.baseUrl+"/public/mediaPost?userId="+uid)
        if(response.ok){
            let data = await response.json()
            setPosts(data)
        }

    }
    return(
        <Box  mt={"60px"} h={"309px"} w={["90%","90%","100%","90%","60%"]} display={"flex"} justifyContent={["center"]} flexWrap={"wrap"}>
        {posts.sort((a,b)=>b.id-a.id)
            .map((post)=>
                <Box m={"0.3%"} >
                    <Image  onClick={()=>{navigate("/mediaPost/"+post.id)}} src={Commons.baseUrl+"/images/"+user.id+post.id+"mini.png"} />
                </Box>
            )}
        </Box>
    )
}