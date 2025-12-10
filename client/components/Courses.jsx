import api from '../utils/apiHelper';
import React, { useState, useEffect } from 'react';

const Courses = () => {
    const [courses, setCourses] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
                await api("/courses", "GET", null, null)
                .then(response => response.json())
                .then(data => setCourses(data.courses))
                .catch(error => console.error('Error:', error))
                .finally(() => setLoading(false));
        }

        fetchData();
    }, []);

    if (loading) {
        return (<h1>Loading ...</h1>);
    }
    else {
        return (
            <main>
                <div className="wrap main--grid">
                    {courses.map(course => (
                        <a key={course.id} className="course--module course--link" href={"/api/courses/"+course.id}>
                            <h2 className="course--label">Course</h2>
                            <h3 className="course--title">{course.title}</h3>
                        </a>
                    ))}  
                    <a className="course--module course--add--module" href="create-course.html">
                        <span className="course--add--title">
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                viewBox="0 0 13 13" className="add"><polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon></svg>
                            New Course
                        </span>
                    </a>
                </div>
            </main>
        );
    }
}

export default Courses;