import './Authentication.css'
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApiContext } from "../contexts/api";
import { useApi } from "../hooks/useApi";

export const Login = () => {
    const navigate = useNavigate();
    const api  = useApi();
    const [showError, setError] = useState(false);

    function signup() {
        setError(false);    
        // if any of the fields are blank
        // set error and return
        // setError("visible");
        // else
        // make api call   
        // check if api call is valid
        // if not then set error and return
        // else navigate to dashboard 
        
        setError(true);        
    }

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
            <div className="error">
                <h4>Login Error!</h4>
            </div>
        </div>
    )
}