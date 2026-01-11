import React, { useState, useContext, useEffect, useRef } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import api from '../utils/apiHelper';
import ReactMarkdown from "react-markdown";
import Forbidden from '../components/Forbidden';
import ErrorsDisplay from './ErrorsDisplay';    
    
const UpdateCourse = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { authUser } = useContext(UserContext);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);
    const title = useRef(null);
    const description = useRef(null);
    const estimatedTime = useRef(null);
    const materialsNeeded = useRef(null);


    useEffect(() => {
        // Fetch course data and populate form fields with setCourse(data.course)
        const fetchData = async () => {
            await api(`/courses/${id}`, "GET", null, null)
                .then(response => {
                    if (!response.ok) {
                        let err = new Error(response.status);
                        err.status = response.status;
                        throw err;
                    }
                    return response.json();
                })
                .then(data => {
                        setCourse(data.course);
                        setLoading(false);
                })
                .catch(error => {
                    console.error('Error:', error)
                    if (error.status === 404) {
                        navigate("/notfound");
                    }
                    else{
                        navigate("/error");
                    }
                });
        }
        if (id) {
            fetchData();
        }
    }, [id]);

        //handles the submit event to update the course
    const handleSubmit = async (event) => {
        event.preventDefault();
        // Prompt for password to authenticate user with API
        // const password = prompt('Please enter your password to update course');
        const credentials = {
            emailAddress: authUser.emailAddress,
            password: authUser.password,
        }

        const body = {
            title: title.current.value,
            description: description.current.value,
            estimatedTime: estimatedTime.current.value,
            materialsNeeded: materialsNeeded.current.value,
        }

        //make api call to update course with provided data frome above
        try {
            const response = await api(`/courses/${id}`, "PUT", body, credentials);
            if (response.ok) {
                navigate(`/api/courses/${id}`);
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
    //navigate to course detail page without making any changes
    const handleCancel = (event) => {
        event.preventDefault();
        navigate(`/api/courses/${id}`);
    }


    if (loading) {
        return (<h1>loading...</h1>);
    }
    else if (authUser.id === course.userId) {
        return (
            <main>
                <div className="wrap">
                    <h2>Update Course</h2>
                    <ErrorsDisplay errors={errors} />
                    <form onSubmit={handleSubmit}>
                        <div className="main--flex">
                            <div>
                                <label htmlFor="courseTitle">Course Title</label>
                                <input id="courseTitle" name="courseTitle" type="text" defaultValue={course.title} ref={title} />

                                <p>By {course.User.firstName} {course.User.lastName}</p>

                                <label htmlFor="courseDescription">Course Description</label>
                                <textarea id="courseDescription" name="courseDescription" ref={description} defaultValue={course.description}></textarea>
                            </div>
                            <div>
                                <label htmlFor="estimatedTime">Estimated Time</label>
                                <input id="estimatedTime" name="estimatedTime" type="text" defaultValue={course.estimatedTime} ref={estimatedTime} />

                                <label htmlFor="materialsNeeded">Materials Needed</label>
                                <textarea id="materialsNeeded" name="materialsNeeded" ref={materialsNeeded} defaultValue={course.materialsNeeded}></textarea>
                            </div>
                        </div>
                        <button className="button" type="submit">Update Course</button>
                        <button className="button button-secondary" onClick={handleCancel}>Cancel</button>
                    </form>
                </div>
            </main>
        );
    }
    else{
        return (
            <Forbidden />
        );
    }
}


export default UpdateCourse;