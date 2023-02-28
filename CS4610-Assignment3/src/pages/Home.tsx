import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApiContext } from "../contexts/api";
import { useApi } from "../hooks/useApi";

export const Home = () => {
    const navigate = useNavigate();
    const api  = useApi();

    return (
        <div>
            <div>
                <h1>Reptile Tracker</h1>
            </div>
            <div>
                <h3>Welcome to your reptile's future!</h3>
                <p>The #1 herpetologist recommended reptile tracking app! We help keep track of your reptile to make ownership as easy and fun as can be!</p>
                <button onClick={() => navigate('login/', {replace: true})}>Login</button>            
                <button onClick={() => navigate('signup', {replace: true})}>Sign up</button>
            </div>
        </div>
    )
}