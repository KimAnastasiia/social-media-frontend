
import Menu from './CommonParts/Menu';
import { Route, Routes, useHref } from "react-router-dom"
import LoginUser from './User/LoginUser';
import {Box, Hide, Show, useStatStyles} from '@chakra-ui/react'
import RegistrationUser from './User/RegistrationUser';
import React,{useState, useEffect} from "react"
import PasswordUser from './User/PasswordUser';
import ProfileUser from './User/ProfileUser';
import PublicationDetails from './Publication.js/PublicationDetails';
import DetailsUser from './User/DetailsUser';
import CreatePublication from './Publication.js/CreatePublication';
import CommentsPublication from './Publication.js/CommentsPublication';
import EditInformationUser from './User/EditInformationUser';
import EditPasswordUser from './User/EditPasswordUser';
import ListSubscriptionRequestsUser from './User/ListSubscriptionRequestsUser';
function App() {

  const [email, setEmail]=useState("")



  return (
    <Box >
      <Menu/>
      <Box pt={"100px"}>
        <Routes>
          <Route  path='/' element={<LoginUser setEmail={setEmail}/>} />
          <Route  path='/registration' element={<RegistrationUser/>} />
          <Route  path='/profile' element={<ProfileUser email={email}/>} />
          <Route  path='/verification/password' element={<PasswordUser  email={email}/>} />
          <Route  path='/mediaPost/:id' element={<PublicationDetails/>} />
          <Route  path='/users/:uniqueName' element={<DetailsUser/>} />
          <Route  path='/users/publication' element={<CreatePublication/>} />
          <Route  path='/users/edit' element={<EditInformationUser/>} />
          <Route  path='/users/editPassword' element={<EditPasswordUser/>} />
          <Route  path='/users/subscriptionRequests' element={<ListSubscriptionRequestsUser/>} />
        </Routes>
      </Box>
   </Box>
  );
}

export default App;
