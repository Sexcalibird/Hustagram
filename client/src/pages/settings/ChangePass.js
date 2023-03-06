import {useAuth} from "../../hooks";
import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import {updatePwd} from "../../redux/usersSlice";

const PWD_REGEX = /^(?=.*[A-z])(?=.*[0-9]).{4,24}$/;

const ChangePass = () => {

    const auth = useAuth()
    const dispatch = useDispatch()

    const [oldPwd, setOldPwd] = useState('')
    const [newPwd, setNewPwd] = useState('')
    const [validPwd, setValidPwd] = useState(false);

    const [confirm, setConfirm] = useState('')
    const [validMatch, setValidMatch] = useState(false);

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(oldPwd) && PWD_REGEX.test(newPwd))
        setValidMatch(newPwd === confirm);
    }, [oldPwd, newPwd, confirm])

    const submitChange = (e) => {
        e.preventDefault()
        dispatch(updatePwd({
            id: auth._id,
            oldPwd,
            newPwd,
        }))
            .unwrap()
            .then()
            .catch( err => {
                return err.messages
            })
    }

    return (
        <div className="edit-profile-container">
            <div className="edit-profile-header">
                <img src={auth?.avatar? auth?.avatar : "/img/avatar.jpg"} alt=""/>
                &nbsp;&nbsp;&nbsp;
                <h4>{auth.username}</h4>
            </div>

            <form>

                <div className="edit-profile-form">
                    <h4 style={{width: "150px"}}>Old password</h4>
                    <div style={{display: "flex", flexDirection: "column", padding: "20px"}}>
                        <input
                            type="password"
                            maxLength="24"
                            required
                            value={oldPwd}
                            onChange={(e) => setOldPwd(e.target.value)}
                        />
                    </div>
                </div>

                <div className="edit-profile-form">
                    <h4 style={{width: "150px"}}>New password</h4>
                    <div style={{display: "flex", flexDirection: "column", padding: "20px"}}>
                        <input
                            type="password"
                            maxLength="24"
                            required
                            value={newPwd}
                            onChange={(e) => setNewPwd(e.target.value)}
                        />
                    </div>
                </div>

                <div className="edit-profile-form">
                    <h4 style={{width: "150px"}}>Confirm password</h4>
                    <div style={{display: "flex", flexDirection: "column", padding: "20px"}}>
                        <input
                            type="password"
                            maxLength="24"
                            required
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                        />
                    </div>
                </div>

                <div style={{width: "150px", margin:"35px auto"}}>
                    <button
                        className="btn-form"
                        onClick={submitChange}
                        disabled={!validPwd ||!validMatch || oldPwd===newPwd}
                    >
                        Change Password
                    </button>
                </div>

            </form>

        </div>
    )
}

export default ChangePass