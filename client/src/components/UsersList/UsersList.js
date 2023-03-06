import './usersList.css'
import {Link} from "react-router-dom";
import {useAuth} from "../../hooks";
import {useDispatch} from "react-redux";
import {followUser} from "../../redux/usersSlice";
import {newNotification} from "../../redux/notificationSlice";
import {useContext} from "react";
import CreateContext from "../../context/ContextProvider";

const UsersList = ({user}) => {

    const auth = useAuth()
    const dispatch = useDispatch()
    const {socket} = useContext(CreateContext)

    const check = auth.followings.find((follow) => follow === user._id)

    return (
        <div className="user_list">
            <div className="user_list_detail">
                <Link to={`/${user.username}`}>
                    <img src={user.avatar ? user.avatar : "/img/avatar.jpg"} alt=""/>
                </Link>
                <Link to={`/${user.username}`}>
                    &nbsp;&nbsp;{user.username}
                </Link>
            </div>
            {(user._id !== auth._id) &&
                <button
                    className={check ? 'following' : ''}
                    onClick={() => {
                        dispatch(followUser({
                            id: auth._id,
                            userId: user._id
                        }))
                        if (!check) {
                            dispatch(newNotification({
                                id: user._id,
                                postId: null,
                                userId: auth._id,
                                text: "is following you"
                            }))
                            socket.emit("sendNotification", {
                                receiverId: user._id,
                                postId: null,
                                userId: auth._id,
                                avatar: auth.avatar,
                                username: auth.username,
                                text: "is following you",
                                date: new Date(),
                            });
                        }
                    }}
                >
                    {check ? 'Following' : 'Follow'}
                </button>
            }
        </div>
    )
}

export default UsersList