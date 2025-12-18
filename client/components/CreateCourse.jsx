import ErrorsDisplay from "./ErrorsDisplay";
import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import api from '../utils/apiHelper';

const CreateCourse = () => {
    const { authUser } = useContext(UserContext);
    const [errors, setErrors] = useState([]);
    const title = useRef(null);
    const description = useRef(null);
    const estimatedTime = useRef(null);
    const materialsNeeded = useRef(null);
    const navigate = useNavigate();

    const handleSubmit = async (event) =>{
        event.preventDefault();

        const password = prompt('Please enter your password to create course');
        const credentials = {
            emailAddress: authUser.emailAddress,
            password: password,
        }

        const body = {
            title: title.current.value,
            description: description.current.value,
            estimatedTime: estimatedTime.current.value,
            materialsNeeded: materialsNeeded.current.value,
            userId: authUser.id,
        }
        //make api call to create course with provided data frome above
        try{
            const response = await api("/courses","POST", body, credentials);
            if (response.status === 201) {
                const location = await response.headers.get('Location');
                if(location){
                  navigate(location);
                }
                else{
                    console.log('failed redirect');
                }
            }
            else if (response.status === 400) {
                const data = await response.json();
                setErrors(data.errors);
                console.log(data.errors);
            }
            else {
                throw new Error();
            }
        } catch (error) {
            console.log(error);
            navigate("/error");
        }

        
    }
// Cancel course creation and navigate to homepage
    const handleCancel = (event) => {
        event.preventDefault();
        navigate("/");
    }

    return (
        <main>
            <div className="wrap">
                <h2>Create Course</h2>
                <ErrorsDisplay errors={errors}/>
                <form onSubmit={handleSubmit}>
                    <div className="main--flex">
                        <div>
                            <label htmlFor="courseTitle">Course Title</label>
                            <input id="courseTitle" name="courseTitle" type="text" defaultValue="" ref={title}/>

                            <p>By {authUser.firstName} {authUser.lastName}</p>

                            <label htmlFor="courseDescription">Course Description</label>
                            <textarea id="courseDescription" name="courseDescription" ref={description}></textarea>
                        </div>
                        <div>
                            <label htmlFor="estimatedTime">Estimated Time</label>
                            <input id="estimatedTime" name="estimatedTime" type="text" defaultValue="" ref={estimatedTime} />

                            <label htmlFor="materialsNeeded">Materials Needed</label>
                            <textarea id="materialsNeeded" name="materialsNeeded" ref={materialsNeeded}></textarea>
                        </div>
                    </div>
                    <button className="button" type="submit">Create Course</button>
                    <button className="button button-secondary" onClick={handleCancel}>Cancel</button>
                </form>
            </div>
        </main>
    );
}

export default CreateCourse;