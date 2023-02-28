import './Authentication.css'
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApiContext } from "../contexts/api";
import { useApi } from "../hooks/useApi";

export const Login = () => {
    const navigate = useNavigate();
    const api  = useApi();

    return (
        <div>
            <h1>Login</h1>
            <p>Welcome back to your reptiles!</p>
            <div className="inputs">
                <input type="email" placeholder="Email"></input>
                <input type="password" placeholder="Password"></input>
            </div>
            <div>
                <button>Login</button>
            </div>
            <div>
                <button 
                className="backup-option"
                onClick={() => {navigate('../signup/', {replace: true})}}
                >
                    No account? Signup here
                </button>
            </div>
        </div>
    )
}