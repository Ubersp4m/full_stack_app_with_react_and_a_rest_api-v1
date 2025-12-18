import { useContext, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import ErrorsDisplay from './ErrorsDisplay';
import { api } from '../utils/apiHelper';

const UserSignUp = () => {
    const { actions } = useContext(UserContext);
    const navigate = useNavigate();


    // State
    const firstName = useRef(null);
    const lastName = useRef(null);
    const emailAddress = useRef(null);
    const password = useRef(null);
    const [errors, setErrors] = useState([]);

    // event handlers
    const handleSubmit = async (event) => {
        event.preventDefault();

        const user = {
            firstName: firstName.current.value,
            lastName: lastName.current.value,
            emailAddress: emailAddress.current.value,
            password: password.current.value,
        }

        try {// Make API call to create a new user
            const response = await api("/users", "POST", user, null);
            if (response.status === 201) {
                console.log(`${user.emailAddress} is successfully signed up and authenticated!`);
                await actions.signIn(user);
                navigate("/");
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
        navigate("/");
    }

    return (
        <main>
            <div className="form--centered">
                <h2>Sign Up</h2>
                <ErrorsDisplay errors={errors}/>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="firstName">First Name</label>
                    <input id="firstName" name="firstName" type="text" defaultValue="" ref={firstName} />
                        <label htmlFor="lastName">Last Name</label>
                        <input id="lastName" name="lastName" type="text" defaultValue="" ref={lastName}/>
                            <label htmlFor="emailAddress">Email Address</label>
                            <input id="emailAddress" name="emailAddress" type="email" defaultValue="" ref={emailAddress}/>
                                <label htmlFor="password">Password</label>
                                <input id="password" name="password" type="password" defaultValue="" ref={password}/>
                                    <button className="button" type="submit">Sign Up</button>
                                    <button className="button button-secondary" onClick={handleCancel}>Cancel</button>
                                </form>
                                <p>Already have a user account? Click here to <a href="/signin">sign in</a>!</p>
                            </div>
                        </main>
                        );
  }

                        export default UserSignUp;