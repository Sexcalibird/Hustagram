import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import "./register.css";
import {GoogleBtn, Footer, OR} from "../../components";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import {useDispatch, useSelector} from "react-redux";
import {signUp, getError, getSuccess} from "../../redux/registerSlice";

const EMAIL_REGEX = /^[a-z0-9.]{1,64}@[a-z0-9.]{1,64}$/i;
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[A-z])(?=.*[0-9]).{4,24}$/;

const Register = () => {

    const dispatch = useDispatch()
    const error = useSelector(getError)
    const success = useSelector(getSuccess)

    const [email, setEmail] = useState('')
    const [validEmail, setValidEmail] = useState(false)

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);

    const [errMsg, setErrMsg] = useState(false);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg(false);
    }, [email, user, pwd, matchPwd])

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(signUp({email, user, pwd}))
            .unwrap()
            .then(() => {
                setEmail('')
                setUser('')
                setPwd('')
                setMatchPwd('')
            })
            .catch (err =>
            {
                setErrMsg(true)
                return err.messages
            })
    }

    return (
        <div className="register">
            {success ? (
                <div className="box goto">
                    <p>
                        SUCCESS !
                        <Link to="/login"> Log In</Link>
                    </p>
                </div>
            ) : (
                <>
                    <div className="box">
                        <div className="goto">
                            <h1>Hustagram</h1>
                            <h5>Sign up to see photos and videos from your friends.</h5>
                            <GoogleBtn/>
                        </div>
                        <OR/>
                        <form
                            className="login-form"
                            onSubmit={handleSubmit}
                            autoComplete="off"
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
                                <label htmlFor="email">
                                    Email
                                </label>
                                <div className={validEmail ? "checkmark" : "hide"}>
                                    <CheckIcon color="success" />
                                </div>
                                <div className={validEmail || !email ? "hide" : "checkmark"}>
                                    <ClearIcon color="error" />
                                </div>
                            </div>

                            <div className="field">
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Username"
                                    maxLength="24"
                                    onChange={(e) => setUser(e.target.value)}
                                    value={user}
                                    required
                                    onFocus={() => setUserFocus(true)}
                                    onBlur={() => setUserFocus(false)}
                                />
                                <label htmlFor="username">
                                    Username
                                </label>
                                <div className={validName ? "checkmark" : "hide"}>
                                    <CheckIcon color="success" />
                                </div>
                                <div className={validName || !user ? "hide" : "checkmark"}>
                                    <ClearIcon color="error" />
                                </div>
                                <p className={userFocus && !validName ? "instruction" : "hide"}>
                                    4 to 24 characters.<br />
                                    Must begin with a letter.<br />
                                </p>
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
                                    onFocus={() => setPwdFocus(true)}
                                    onBlur={() => setPwdFocus(false)}
                                />
                                <label htmlFor="password">
                                    Password
                                </label>
                                <div className={validPwd ? "checkmark" : "hide"}>
                                    <CheckIcon color="success" />
                                </div>
                                <div className={validPwd || !pwd ? "hide" : "checkmark"}>
                                    <ClearIcon color="error" />
                                </div>
                                <p className={pwdFocus && !validPwd ? "instruction" : "hide"}>
                                    4 to 24 characters.<br />
                                    Must include both letters and numbers.<br />
                                </p>
                            </div>

                            <div className="field">
                                <input
                                    id="conf_pw"
                                    type="password"
                                    placeholder="Confirm Password"
                                    maxLength="24"
                                    onChange={(e) => setMatchPwd(e.target.value)}
                                    value={matchPwd}
                                    required
                                />
                                <label htmlFor="conf_pw">
                                    Confirm Password
                                </label>
                                <div className={validMatch && matchPwd ? "checkmark" : "hide"}>
                                    <CheckIcon color="success" />
                                </div>
                                <div className={validMatch || !matchPwd ? "hide" : "checkmark"}>
                                    <ClearIcon color="error" />
                                </div>
                            </div>

                            <p className="etc">
                                By signing up, you agree to our Terms , Privacy Policy and Cookies Policy .
                            </p>
                            <button
                                className="btn-register btn-form"
                                disabled={!validEmail || !user || !validPwd || !validMatch}
                            >Sign Up</button>

                        </form>
                    </div>
                    <div className="box goto">
                        <p>
                            Have an account ?
                            <Link to="/login"> Log In</Link>
                        </p>
                    </div>

                </>
            )}
            <Footer/>
        </div>
    )
}

export default Register