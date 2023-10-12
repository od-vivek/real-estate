import React from 'react'
import {BrowserRouter , Routes , Route} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';

export default function App() {
  return (
      <BrowserRouter>
      <Header></Header>
      <Routes>
        <Route path='/' element = {<Home></Home>}></Route>
        <Route path='/login' element = {<Login></Login>}></Route>
        <Route path='/signup' element = {<Signup></Signup>}></Route>
        <Route path='/about' element = {<About></About>}></Route>
        <Route path='/profile' element = {<Profile></Profile>}></Route>
      </Routes>
      </BrowserRouter>
    ) 
}
