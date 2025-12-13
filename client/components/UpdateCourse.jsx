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
        const fetchData = async () => {
            await api(`/courses/${id}`, "GET", null, null)
                .then(response => response.json())
                .then(data => setCourse(data.course))
                .catch(error => console.error('Error:', error))
                .finally(() => setLoading(false));
        }
        if (id) {
            fetchData();
        }
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const password = prompt('Please enter your password to update course');
        const credentials = {
            emailAddress: authUser.emailAddress,
            password: password,
        }

        const body = {
            title: title.current.value,
            description: description.current.value,
            estimatedTime: estimatedTime.current.value,
            materialsNeeded: materialsNeeded.current.value,
        }
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