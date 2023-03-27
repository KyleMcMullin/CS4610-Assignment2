import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApiContext } from "../contexts/api";
import { useApi } from "../hooks/useApi";

export const Signup = () => {
    const navigate = useNavigate();
    const api  = useApi();
    const [showError, setShowError] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function signup() {
        setShowError(false);
        if (
            firstName === "" ||
            lastName === "" ||
            email === "" ||
            password === ""
        ) {
            setShowError(true);
            return;
        }
        
        let record = {
            "firstName": firstName,
            "lastName": lastName,
            "email": email,
            "password": password
        };
        let result = await api.post("/users", record);
        navigate('../dashboard/', {replace: true});              
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