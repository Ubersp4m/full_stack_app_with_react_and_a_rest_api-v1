import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import api from '../utils/apiHelper';
import UserContext from "../context/UserContext";


const CourseDetail = () => {
    const { authUser } = useContext(UserContext);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const {id} = useParams();

    useEffect(() => {
        const fetchData = async () => {
                 await api(`/courses/${id}`, "GET", null, null)
                .then(response => response.json())
                .then(data => setCourse(data.course))
                .catch(error => console.error('Error:', error))
                .finally(() => setLoading(false));
        }
        if(id){
            fetchData();
        }
    }, [id]);

    const handleDelete = async (e) => {
        await api(`/courses/${id}`, "DELETE", null, authUser);
    }

    if (loading) {
        return (<h1>loading...</h1>);
    }
    else {
        return (
            
            <main>
                <div className="actions--bar">
                    <div className="wrap">
                        {authUser.id === course.userId ?
                        <>
                            <a className="button" href={"/api/courses/"+id+"/update"}>Update Course</a>
                            <a className="button" href="#" onClick={handleDelete}>Delete Course</a>
                        </>
                        :
                          null  }
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