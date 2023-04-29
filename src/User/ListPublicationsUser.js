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
    const [listOfButtons,setListOfButtons]=useState([])
    let userIdRef = useRef()
    const [i, setI]=useState(0)


    useEffect(()=>{
        setPosts([])
        getUser()
    },[props.uniqueName])

    let getUser=async()=>{
        let response = await fetch(Commons.baseUrl+"/public/users/"+props.uniqueName)
        if(response.ok){
            let data = await response.json()
            getPostsInitial(data[0].id,1)
            createListOfButtons(data[0].id)
            userIdRef.current=data[0].id
        }
    } 
    let getPostsInitial=async(uId, p)=>{
        let response = await fetch(Commons.baseUrl+"/public/mediaPost/postes?userId="+uId+"&p="+p)
        if(response.ok){
            let data = await response.json()
            setPosts(data)
        }
    }
    let getPosts=async(uId, p)=>{
        let response = await fetch(Commons.baseUrl+"/public/mediaPost/postes?userId="+uId+"&p="+p)
        if(response.ok){
            let data = await response.json()
            let newList = [...posts, ...data]
            setPosts(newList)
        }
        setI(i+1)
    }
    let createListOfButtons=async(id)=>{
        let listOfButtons=[]
        let numberOfRows=0
        let response = await fetch(Commons.baseUrl+"/public/mediaPost/count?id="+id)
        if(response.ok){
            let data = await response.json()
            if(!data.error){
                numberOfRows = data[0].number 
            }
        }
        let numberOfPages = numberOfRows/6 
        numberOfPages = Math.ceil(numberOfPages) 

        for(let i=0; i<numberOfPages; i++){
            listOfButtons.push(<Button bg="lightblue"  w={"1%"} m={"5px"} onClick={e=>getPosts( userIdRef.current,(i+1))} key={i} >{i+1}</Button>)
        }
        console.log(listOfButtons)
        setListOfButtons(listOfButtons) 
    }
    return(
        <Box mt={"60px"} w={["90%","90%","100%","90%","60%"]} flexDirection={"column"} display={"flex"} justifyContent={"center"} >
                <Box  display={"flex"} justifyContent={["center"]} flexWrap={"wrap"}>
                {posts
                    .map((post)=>
                        <Box m={"0.3%"} >
                            <Image  onClick={()=>{navigate("/mediaPost/"+post.id)}} src={Commons.baseUrl+"/images/"+ userIdRef.current+post.id+"mini.png"} />
                        </Box>
                    )}
                </Box>
                <Box mt={"20px"} w="100%" display={"flex"} justifyContent={"center"}>
                    {(listOfButtons.length>1 && i<=(listOfButtons.length-1)) && <Button bg="lightblue"  w={"10%"} m={"5px"} onClick={e=>{getPosts( userIdRef.current,(i+1))}} >Show more</Button>}

                </Box>
        </Box>
    )
}