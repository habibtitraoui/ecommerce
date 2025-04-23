import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import './login.css';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch("http://127.0.0.1:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
    
            const data = await response.json();
            console.log("Server response:", data); // ✅ تحقق من الرد في وحدة التحكم
    
            if (data === "success") {
                localStorage.setItem("userLoggedIn", "true");  // ✅ حفظ حالة تسجيل الدخول
                navigate("/dashboard");  // ✅ الانتقال إلى لوحة التحكم
            } else {
                alert("Invalid credentials");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Login failed. Please try again.");
        }
    };
    

    return (
        <div>
            <form onSubmit={handleLogin}>
                <div className="login-root">
                    <div className="box-root flex-flex flex-direction--column" style={{ minHeight: "100vh", flexGrow: 1 }}>
                        <div className="loginbackground box-background--white padding-top--64">
                            <div className="loginbackground-gridContainer">
                                <div className="box-root flex-flex" style={{ gridArea: "top / start / 8 / end" }}>
                                    <div className="box-root" style={{ backgroundImage: "linear-gradient(white 0%, rgb(247, 250, 252) 33%)", flexGrow: 1 }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="box-root padding-top--24 flex-flex flex-direction--column" style={{ flexGrow: 1, zIndex: 9 }}>
                            <div className="formbg-outer">
                                <div className="formbg">
                                    <div className="formbg-inner padding-horizontal--48">
                                        <span className="padding-bottom--15">Sign in to your account</span>
                                        <div className="field padding-bottom--24">
                                            <label htmlFor="email">Email</label>
                                            <input 
                                                type="email" 
                                                name="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="field padding-bottom--24">
                                            <div className="grid--50-50">
                                                <label htmlFor="password">Password</label>
                                                <div className="reset-pass">
                                                    <a href="#">Forgot your password?</a>
                                                </div>
                                            </div>
                                            <input
                                                type="password" 
                                                name="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="field padding-bottom--24">
                                            <input type="submit" value="Continue" />
                                        </div>
                                    </div>
                                </div>
                                <div className="footer-link padding-top--24">
                                    <span>Dont have an account? <a href="/signup">Sign up</a></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>  
        </div>
    );
}

export default Login;
