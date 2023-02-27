import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { Home } from './Home';
import { Login } from './Login';
import { Signup } from './Signup';


function App() {
	const [page, setPage] = useState("login");
  useEffect(() => {
    window.location.hash = page
  }, [page])
  
  useEffect(() => {
    const hashChange = () => {
    }
    window.addEventListener("hashchange", hashChange);
  
    return () => {
      window.removeEventListener("hashchange", hashChange);
    }
  }, [])
	
  
	if (page === "home") return <Home />
  else if (page === "login") return <Login />
  else if (page === "signup") return <Signup />
	// else if (page === "dashboard") return <Dashboard />
	// else if (page === "reptile") return <Reptile />
	else return <div>Not found</div>
}

export default App
