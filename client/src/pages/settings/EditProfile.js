import {useAuth} from "../../hooks";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {updateUser} from "../../redux/usersSlice";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;

const EditProfile = () => {

    const auth = useAuth()
    const dispatch = useDispatch()

    const [username, setUsername] = useState(auth.username)
    const [name, setName] = useState(auth.name ? auth.name : '')
    const [bio, setBio] = useState(auth.info ? auth.info : '')

    const submitUpdate = (e) => {
        e.preventDefault()
        dispatch(updateUser({
            id: auth._id,
            username: username,
            name: name,
            info: bio,
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
                    <h4>Email</h4>
                    <div style={{display: "flex", flexDirection: "column", padding: "20px"}}>
                        <input
                            value={auth.email}
                            disabled = "true"
                        />
                    </div>
                </div>

                <div className="edit-profile-form">
                    <h4>Username</h4>
                    <div style={{display: "flex", flexDirection: "column", padding: "20px"}}>
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <p>Username must be unique.</p>
                    </div>
                </div>

                <div className="edit-profile-form">
                    <h4>Name</h4>
                    <div style={{display: "flex", flexDirection: "column", padding: "20px"}}>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <p>Enter your real name.</p>
                    </div>
                </div>

                <div className="edit-profile-form">
                    <h4>Bio</h4>
                    <div style={{display: "flex", flexDirection: "column", padding: "20px"}}>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                        <p>Write something about yourself.</p>
                    </div>
                </div>

                <div style={{width: "90px", margin:"20px auto"}}>
                    <button
                        className="btn-form"
                        onClick={submitUpdate}
                        disabled={!USER_REGEX.test(username)}
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditProfile