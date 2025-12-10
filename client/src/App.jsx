import { useState } from 'react'
import {Route, Routes} from 'react-router-dom';

import Header from '../components/Header';
import Courses from '../components/Courses';
import CourseDetail from '../components/CourseDetail';
import UserSignUp from '../components/UserSignUp';
import UserSignOut from '../components/UserSignOut';
import UserSignIn from '../components/UserSignIn';

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Courses />}/>
        <Route path="/api/courses" element={<Courses />}/>
        <Route path="/api/courses/:id" element={<CourseDetail />}/>
        <Route path="/signup" element={<UserSignUp />} />
        <Route path="/signout" element={<UserSignOut />} />
        <Route path="/signin" element={<UserSignIn />} />
      </Routes>
    </>
);
}

export default App
