import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApiContext } from "../contexts/api";
import { useApi } from "../hooks/useApi";

export const Signup = () => {
    const navigate = useNavigate();
    const api  = useApi();
    const [showError, setError] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function signup() {
        setError(false);
        if (
            firstName === "" ||
            lastName === "" ||
            email === "" ||
            password === ""
        ) {
            setError(true);
            return;
        }
        
        let result = false;
        let record = {
            "firstName": firstName,
            "lastName": lastName,
            "email": email,
            "password": password
        };
        let promise = api.post("http://localhost:3000/users", record);
        promise.then(response => {
            console.log(response.status);
            // if (response.status === 204) {
                
            // }
            // responses.forEach( (response: { status: string; }) =>
            //     if (response.status === '') {

            //     }                              
            // )
            }
        )
        // if any of the fields are blank
        // set error and return
        // setError("visible");
        // else
        // make api call   
        // check if api call is valid
        // if not then set error and return
        // else navigate to dashboard                 
    }

    return (
        <div>
            <h1>Sign Up</h1>
            <p>You're just a few clicks away from keeping your reptiles healthy and happy!</p>
            <div className="inputs">
                <input 
                    type="text" 
                    placeholder="First Name" 
                    value={firstName} 
                    onChange={evt => setFirstName(evt.target.value)}
                ></input>
                <input 
                    type="text" 
                    placeholder="Last Name"
                    value={lastName}
                    onChange={evt => setLastName(evt.target.value)}
                ></input>
                <input 
                    type="email" 
                    placeholder="Email"
                    value={email}
                    onChange={evt => setEmail(evt.target.value)}
                ></input>
                <input 
                    type="password" 
                    placeholder="Password"
                    value={password}
                    onChange={evt => setPassword(evt.target.value)}
                ></input>
            </div>
            <div>
                <button onClick={signup}>Signup</button>
            </div>
            <div>
            <button 
                className="backup-option"
                onClick={() => {navigate('../login/', {replace: true})}}
                >
                    Have an account? Login here.
                </button>
            </div>
            <div className={
                showError ? 'visible' : 'hidden'
            }>
                <h4>Login Error!</h4>
            </div>
        </div>
    )
}