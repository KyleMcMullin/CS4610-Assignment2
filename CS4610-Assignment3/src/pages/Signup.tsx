import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApiContext } from "../contexts/api";
import { useApi } from "../hooks/useApi";

export const Signup = () => {
    const navigate = useNavigate();
    const api  = useApi();

    return (
        <div>
            <h1>Sign Up</h1>
            <p>You're just a few clicks away from keeping your reptiles healthy and happy!</p>
            <div className="inputs">
                <input type="text" placeholder="Full Name"></input>
                <input type="email" placeholder="Email"></input>
                <input type="password" placeholder="Password"></input>
            </div>
            <div>
                <button>Signup</button>
            </div>
            <button 
                className="backup-option"
                onClick={() => {navigate('../login/', {replace: true})}}
                >
                    Have an account? Login here.
                </button>
        </div>
    )
}