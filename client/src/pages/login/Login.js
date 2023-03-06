import "./login.css"
import {Link, useLocation, useNavigate} from "react-router-dom";
import {GoogleBtn, Footer, OR} from "../../components";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {getError, signIn} from "../../redux/authSlice";

const Login = () => {

    const dispatch = useDispatch()
    const error = useSelector(getError)

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [email, setEmail] = useState('')
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState(false);

    useEffect(() => {
        setErrMsg(false);
    }, [email, pwd])

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(signIn({email, pwd}))
            .unwrap()
            .then(() => {
                setEmail('')
                setPwd('')
                navigate(from, { replace: true })
            })
            .catch (err =>
            {
                setErrMsg(true)
                return err.messages
            })
    }

    return (
        <div className="login">
            <div className="con">
                {/*<div className="logo">
                    <img src="/img/iphone.png" alt=""/>
                </div>*/}
                <div className="login-main">
                    <div className="box">
                        <div className="goto">
                            <h1>Hustagram</h1>
                        </div>
                        <form
                            className="login-form"
                            onSubmit={handleSubmit}
                            autoComplete = "true"
                        >

                            <p className={errMsg ? "errmsg" : "hide"}>{error}</p>

                            <div className="field">
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Email"
                                    maxLength="28"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    required
                                />
                                <label htmlFor="email">Email</label>
                            </div>

                            <div className="field">
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    maxLength="24"
                                    onChange={(e) => setPwd(e.target.value)}
                                    value={pwd}
                                    required
                                />
                                <label htmlFor="password">Password</label>
                            </div>

                            <button className="btn-login btn-form">Log In</button>

                        </form>
                        <OR/>
                        <GoogleBtn/>
                    </div>
                    <div className="box goto">
                        <p>
                            Don't have an account?
                            <Link to="/register"> Sign up</Link>
                        </p>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Login