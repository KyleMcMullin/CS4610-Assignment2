import './Authentication.css'
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApiContext } from "../contexts/api";
import { useApi } from "../hooks/useApi";

export const Login = () => {
    const navigate = useNavigate();
    const api  = useApi();
    const [showError, setShowError] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function login() {
        setShowError(false);    
        if (
            email === "" ||
            password === ""
        ) {
            setShowError(true);
            return;
        }

        let record = {
            "email": email,
            "password": password
        };

        let result = await api.post("/sessions", record);
        navigate('../dashboard/', {replace: true});
    }

    return (
        <div>
            <h1>Login</h1>
            <p>Welcome back to your reptiles!</p>
            <div className="inputs">
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
                <button onClick={login}>Login</button>
            </div>
            <div>
                <button 
                className="backup-option"
                onClick={() => {navigate('../signup/', {replace: true})}}
                >
                    No account? Signup here
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