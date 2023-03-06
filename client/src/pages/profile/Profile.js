import "./profile.css"
import {Footer} from "../../components";
import {useAuth} from "../../hooks";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {clearUsers, fetchUser, getProfile} from "../../redux/usersSlice";
import ProfilePosts from "../../components/ProfilePosts/ProfilePosts";
import {signOut} from "../../redux/authSlice";
import {clearPosts, getPosts} from "../../redux/postsSlice";
import {followUser} from "../../redux/usersSlice";
import CreateContext from "../../context/ContextProvider";
import {addNewChat, getChat} from "../../redux/chatSlice";
import {newNotification} from "../../redux/notificationSlice";

import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined';
import BlockIcon from '@mui/icons-material/Block';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const Profile = () => {

    const auth = useAuth()
    const {username} = useParams()
    const dispatch = useDispatch()
    const user = useSelector(getProfile)
    const posts = useSelector(getPosts)
    const {socket} = useContext(CreateContext)

    const location = useLocation();
    const navigate = useNavigate()
    const {modalOpen, setModalOpen} = useContext(CreateContext)

    useEffect(() => {
        if (auth.username !== username) {
            dispatch(fetchUser({username}))
        }
        return () => {
            dispatch(clearUsers())
        }
    }, [username]);

    let profile
    let options
    if (auth.username === username) {
        profile = auth
        options = <>
            <Link to={`/accounts/edit`}>
                <button className="profile-btn">
                    Edit profile
                </button>
            </Link>

            <button className="profile-logout"
                    onClick={() => {
                        dispatch(signOut())
                        dispatch(clearUsers())
                        dispatch(clearPosts())
                    }
                }
            >
                <PowerSettingsNewOutlinedIcon/>
            </button>
        </>
    } else {
        profile = user
        const following = user?.followers?.find((follow) => follow === auth._id)
        options = <>
            <button className={following ? "profile-following" : "profile-follow"}
                    onClick={() => {
                        dispatch(followUser({id: auth._id, userId: user._id}))
                        if (!following) {
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
                    }}>
                {following ? "Following" : "Follow" }
            </button>
            <button className="profile-btn"
                    onClick={() => {
                        dispatch(addNewChat({userId1: auth._id, userId2: user._id}))
                        dispatch(getChat({userId1: auth._id, userId2: user._id}))
                        navigate('/direct/inbox')
                    }}
            >
                Message
            </button>
        </>
    }

    return (
        <main className={modalOpen ? "modal-open" : "profile-container"}>
            <div className="main-profile">
                <div className="main-profile-left">
                    <img src={profile?.avatar? profile?.avatar : "/img/avatar.jpg"} alt=""/>
                </div>
                <div className="main-profile-right">
                    <div className="right-top">
                        <span>{username}</span>
                        {options}
                    </div>
                    <div className="right-mid">
                        <ul>
                            <li style={{cursor: 'unset'}}>
                                <span className="profile-stat-count">{posts?.length}</span> {posts?.length > 1 ? 'posts' : 'post'}
                            </li>
                            <li>
                                <Link
                                    to="followers"
                                    state={{ background: location }}
                                    onClick={() => {
                                        setModalOpen(true)
                                    }}
                                >
                                    <span className="profile-stat-count">{profile?.followers?.length}</span> {profile?.followers?.length > 1 ? 'followers' : 'follower'}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="followings"
                                    state={{ background: location }}
                                    onClick={() => {
                                        setModalOpen(true)
                                    }}
                                >
                                    <span className="profile-stat-count">{profile?.followings?.length}</span> {profile?.followings?.length > 1 ? 'followings' : 'following'}
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="right-bot">
                        <p className="profile-name">{profile?.name}</p>
                        <p style={{whiteSpace: "pre-wrap"}}>
                            {profile?.info}
                        </p>
                    </div>
                </div>
            </div>
            <ProfilePosts userId={profile?._id}/>
            <Footer/>

        </main>
    )
}

export default Profile