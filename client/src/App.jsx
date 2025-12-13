import {Route, Routes} from 'react-router-dom';

import Header from '../components/Header';
import Courses from '../components/Courses';
import CourseDetail from '../components/CourseDetail';
import UserSignUp from '../components/UserSignUp';
import UserSignOut from '../components/UserSignOut';
import UserSignIn from '../components/UserSignIn';
import UpdateCourse from '../components/UpdateCourse';
import CreateCourse from '../components/CreateCourse';
import Error from '../components/UnhandledError';
import NotFound from '../components/NotFound';
import PrivateRoute from '../components/PrivateRoute';
import Forbidden from '../components/Forbidden';

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Courses />}/>
        <Route path="/api/courses" element={<Courses />}/>
        <Route path="/api/courses/:id" element={<CourseDetail />}/>
        <Route element={<PrivateRoute />}>
          <Route path="/api/courses/:id/update" element={<UpdateCourse/>}/>
          <Route path="/api/courses/create" element={<CreateCourse />} />
        </Route>
        <Route path="/signup" element={<UserSignUp />} />
        <Route path="/signout" element={<UserSignOut />} />
        <Route path="/signin" element={<UserSignIn />} />
        <Route path='/error' element={<Error />} />
        <Route path='/forbidden' element={<Forbidden />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
);
}

export default App
