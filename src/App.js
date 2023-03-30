
import Menu from './CommonParts/Menu';
import { Route, Routes, useHref } from "react-router-dom"
import LoginUser from './User/LoginUser';
import {Box, Hide, Show, useStatStyles} from '@chakra-ui/react'
import RegistrationUser from './User/RegistrationUser';
import React,{useState, useEffect} from "react"
import PasswordUser from './User/PasswordUser';

function App() {

  const [login, setLogin]=useState("")

  return (
    <Box >
      <Menu/>
      <Routes>
        <Route  path='/' element={<LoginUser setLogin={setLogin}/>} />
        <Route  path='/registration' element={<RegistrationUser/>} />
        <Route  path='/verification/password' element={<PasswordUser  login={login}/>} />
      </Routes>
   </Box>
  );
}

export default App;
