import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {editUser, getUserByID} from "../../redux/adminSlice";
import {useEffect, useRef, useState} from "react";

const ManagementEdit = () => {

    const {id} = useParams()
    const user = useSelector((state) => getUserByID(state, id))
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [email, setEmail] = useState(user.email)
    const [username, setUsername] = useState(user.username)
    const [name, setName] = useState(user.name ? user.name : '')
    const [bio, setBio] = useState(user.info ? user.info : '')

    const refEdit = useRef()

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (refEdit.current && !refEdit.current.contains(event.target)) {
                navigate(-1)
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [refEdit]);

    const submitUpdate = (e) => {
        e.preventDefault()
        dispatch(editUser({
            id: user._id,
            email: email,
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
        <div className="modalDiv">
            <div className="edit-profile-management" ref={refEdit}>
                <div className="edit-profile-header">
                    <img src={user?.avatar? user?.avatar : "/img/avatar.jpg"} alt=""/>
                    &nbsp;&nbsp;&nbsp;
                    <h4>{user.username}</h4>
                </div>

                <form>

                    <div className="edit-profile-form">
                        <h4>Email</h4>
                        <div style={{display: "flex", flexDirection: "column", padding: "20px"}}>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="edit-profile-form">
                        <h4>Username</h4>
                        <div style={{display: "flex", flexDirection: "column", padding: "20px"}}>
                            <input
                                type="text"
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
                        </div>
                    </div>

                    <div className="edit-profile-form">
                        <h4>Bio</h4>
                        <div style={{display: "flex", flexDirection: "column", padding: "20px"}}>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                        </div>
                    </div>

                    <div style={{width: "90px", margin:"20px auto"}}>
                        <button
                            className="btn-form"
                            onClick={submitUpdate}
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ManagementEdit