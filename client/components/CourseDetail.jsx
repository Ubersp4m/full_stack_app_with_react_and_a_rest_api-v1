import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import api from '../utils/apiHelper';
import UserContext from "../context/UserContext";


const CourseDetail = () => {
    const navigate = useNavigate();
    const { authUser } = useContext(UserContext);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const {id} = useParams();

    // Fetch course data
    useEffect(() => {
        const fetchData = async () => {
                 await api(`/courses/${id}`, "GET", null, null)
                .then(response => {
                    if(!response.ok){
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
                    if(error.status === 404){
                            navigate("/notfound");
                    }
                    else{
                        navigate("/error"); 
                    }
                });
        }
        if(id){
            fetchData();
        }
    }, [id]);

// Handle course deletion 
    const handleDelete = async (e) => {
        e.preventDefault();
        // const password = prompt('Please enter your password to delete course');
        const credentials ={
            emailAddress: authUser.emailAddress,
            password: authUser.password,
        }
        const response = await api(`/courses/${id}`, "DELETE", null, credentials);
        if(response.ok)navigate("/");
    }

    if (loading) {
        return (<h1>loading...</h1>);
    }
    else {
        return (
            
            <main>
                <div className="actions--bar">
                    <div className="wrap">
                        
                        {!authUser ?
                        null :
                        authUser.id === course.userId ?
                        <>
                            <a className="button" href={"/api/courses/"+id+"/update"}>Update Course</a>
                            <a className="button" href="#" onClick={handleDelete}>Delete Course</a>
                        </>
                        :
                          null }
                        <a className="button button-secondary" href="/">Return to List</a>
                    </div>
                </div>

                <div className="wrap">
                    <h2>Course Detail</h2>
                    <form>
                        <div className="main--flex">
                            <div>
                                <h3 className="course--detail--title">{course.title}</h3>
                                <h4 className="course--name"><ReactMarkdown>{course.description}</ReactMarkdown></h4>
                            </div>
                            <div>
                                <h3 className="course--detail--title">Estimated Time</h3>
                                <p>{course.estimatedTime}</p>

                                <h3 className="course--detail--title">Materials Needed</h3>
                                <ul className="course--detail--list">
                                   <ReactMarkdown>{course.materialsNeeded}</ReactMarkdown>     
                                </ul>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        );
    }
}

export default CourseDetail;