import Menu from './CommonParts/Menu';
import { Route, Routes, useHref } from "react-router-dom"
import LoginUser from './User/LoginUser';
import {Box, Hide, Show, useStatStyles} from '@chakra-ui/react'
import RegistrationUser from './User/RegistrationUser';
import React,{useState, useEffect} from "react"
import PasswordUser from './User/PasswordUser';
import PublicationDetails from './Publication.js/PublicationDetails';
import DetailsUser from './User/DetailsUser';
import CreatePublication from './Publication.js/CreatePublication';
import EditInformationUser from './User/EditInformationUser';
import EditPasswordUser from './User/EditPasswordUser';
import ListSubscriptionRequestsUser from './User/ListSubscriptionRequestsUser';
import AllDialogues from './Messages/AllDialogues';
import PrivateChat from './Messages/PrivateChat';
function App() {

  const [email, setEmail]=useState("")
  const [login, setLogin]=useState(false)


  return (
    <Box >
      <Menu login={login} setLogin={setLogin}/>
      <Box pt={"100px"}>
        <Routes>
          <Route  path='/' element={<LoginUser setEmail={setEmail}/>} />
          <Route  path='/registration' element={<RegistrationUser/>} />
          <Route  path='/verification/password' element={<PasswordUser  email={email}/>} />
          <Route  path='/mediaPost/:id' element={<PublicationDetails/>} />
          <Route  path='/users/:uniqueName' element={<DetailsUser setLogin={setLogin} />}/>
          <Route  path='/users/publication' element={<CreatePublication/>} />
          <Route  path='/users/edit' element={<EditInformationUser/>} />
          <Route  path='/users/editPassword' element={<EditPasswordUser/>} />
          <Route  path='/users/subscriptionRequests' element={<ListSubscriptionRequestsUser/>} />
          <Route  path='/users/yourDialogues' element={<AllDialogues/>} />
          <Route  path='/users/chat/:uniqueName' element={<PrivateChat/>} />
        </Routes>
      </Box>
   </Box>
  );
}

export default App;
