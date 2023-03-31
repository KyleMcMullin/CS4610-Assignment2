import { useEffect, useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider, useLocation } from "react-router-dom"
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ApiContext } from "./contexts/api"
import { Api } from "./lib/api"
import { Root } from './pages/Root';
import { Reptile } from './pages/Reptile';
import { Dashboard } from './pages/Dashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'reptile/:id',
        element: <Reptile />
      },
      {
        path: '/',
        element: <Home />
      },
      {
        path: 'login/',
        element: <Login />
      },
      {
        path: 'signup/',
        element: <Signup />
      },
      {
        path: 'dashboard/:userId',
        element: <Dashboard />
      }
    ]
  }
])

export const App = () => {
  const [api, setApi] = useState(new Api());

  return (
    <>
    <ApiContext.Provider value = {api}>
      <RouterProvider router={router} />
    </ApiContext.Provider>
    </>
  )
}
// function App() {
// 	const [page, setPage] = useState("login");
//   useEffect(() => {
//     window.location.hash = page
//   }, [page])
  
//   useEffect(() => {
//     const hashChange = () => {
//     }
//     window.addEventListener("hashchange", hashChange);
  
//     return () => {
//       window.removeEventListener("hashchange", hashChange);
//     }
//   }, [])
	
  
// 	if (page === "home") return <Home />
//   else if (page === "login") return <Login />
//   else if (page === "signup") return <Signup />
// 	// else if (page === "dashboard") return <Dashboard />
// 	// else if (page === "reptile") return <Reptile />
// 	else return <div>Not found</div>
// }

// export default App
