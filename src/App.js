
import Menu from './CommonParts/Menu';
import { Route, Routes, useHref } from "react-router-dom"
import LoginUser from './User/LoginUser';
import {Box, Hide, Show, useStatStyles} from '@chakra-ui/react'
import RegistrationUser from './User/RegistrationUser';
import React,{useState, useEffect} from "react"
import PasswordUser from './User/PasswordUser';
import PrrofileUser from './User/ProfileUser';
import PublicationDetails from './Publication.js/PublicationDetails';
function App() {

  const [email, setEmail]=useState("")



  return (
    <Box >
      <Menu/>
      <Routes>
        <Route  path='/' element={<LoginUser setEmail={setEmail}/>} />
        <Route  path='/registration' element={<RegistrationUser/>} />
        <Route  path='/profile' element={<PrrofileUser email={email}/>} />
        <Route  path='/verification/password' element={<PasswordUser  email={email}/>} />
        <Route  path='/mediaPost/:id' element={<PublicationDetails/>} />
      </Routes>
   </Box>
  );
}

export default App;
