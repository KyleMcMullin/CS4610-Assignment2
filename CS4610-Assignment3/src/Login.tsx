import './Authentication.css'

export const Login = () => {
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
                <button className="backup-option">No account? Signup here</button>
            </div>
        </div>
    )
}