import "./PostCard.css"
import {ChatBubbleOutline, Share, Close,
    SentimentSatisfiedAlt, Edit} from "@mui/icons-material";
import TimeAgo from "../functions/TimeAgo";
import {useDispatch} from "react-redux";
import {useAuth} from "../../hooks";
import {deletePost} from "../../redux/postsSlice";
import {useContext, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import Like from "../functions/Like";
import Saved from "../functions/Saved";
import CreateContext from "../../context/ContextProvider";
import AddCmt from "../functions/AddCmt";

const PostCard = ({post}) => {

    const {setToggleCreate, setId} = useContext(CreateContext)

    const auth = useAuth()
    const dispatch = useDispatch()

    const [cmt, setCmt] = useState('')
    const [likes, setLikes] = useState(post.likes)

    const [justCmt, setJustCmt] = useState('')

    return (
        <div className="post">
            <div className="info">
                <div className="user css-link">
                    <div className="profile-pic ">
                        <Link to={`/${post.userId === auth._id ? auth.username : post.username}`}>
                            <img
                                src={post.userId === auth._id
                                    ? auth.avatar ? auth.avatar : "/img/avatar.jpg"
                                    : post.avatar ? post.avatar : "/img/avatar.jpg"}
                                alt=""
                            />
                        </Link>
                    </div>
                    <p className="username ">
                        <Link to={`/${post.userId === auth._id ? auth.username : post.username}`}>
                            {post.userId === auth._id
                                ? auth.username
                                : post.username ? post.username : 'Unknown author'}
                        </Link>
                    </p>
                    <p className="post-time">
                        &nbsp;•&nbsp;<TimeAgo timestamp={post.createdAt}/>{post.edited === true && " • Edited"}
                    </p>
                </div>
                {((post.userId === auth._id) || auth.roles.Admin)
                    && (
                        <div style={{display: "flex", verticalAlign: "middle"}}>
                            <button onClick={() => {
                                setToggleCreate(true)
                                setId(post._id)
                            }}>
                                <Edit fontSize="small"/>
                            </button>
                            &nbsp;
                            <button onClick={() => dispatch(deletePost({id: post._id}))}>
                                <Close/>
                            </button>
                        </div>
                    )
                }
            </div>
            <div className="post-image">
                <img src={post.img} alt="" />
            </div>
            <div className="post-content css-link">
                <div className="reaction-wrapper">
                    <div >
                        <Like
                            post={post}
                            auth={auth}
                            likes={likes}
                            setLikes={setLikes}
                        />
                        <Link to={`p/${post._id}`}>
                            <button style={{margin: "0 15px", color: "black"}}>
                                    <ChatBubbleOutline fontSize="large"/>
                            </button>
                        </Link>
                        <button onClick={() =>  navigator.clipboard.writeText(`${window.location.href}p/${post._id}`)}>
                            <Share fontSize="large"/>
                        </button>
                    </div>
                    <Saved post={post} auth={auth}/>
                </div>
                <div className="likes">
                    {likes.length} {likes.length > 2 ? "likes" : "like"}
                </div>
                <p className="description">
                    <span>
                        <Link to={`/${post.userId === auth._id ? auth.username : post.username}`}>
                            {post.userId === auth._id
                                ? auth.username
                                : post.username ? post.username : 'Unknown author'}
                        </Link>
                    </span>
                    {post.desc}<br/>
                    {post?.tags?.map((tag, index) => (
                        <Link to={`/explore/tags/${encodeURIComponent(tag)}`} key={index} style={{  color: '#3f51b5' }}>
                            {`${tag} `}
                        </Link>
                    ))}
                </p>
                <Link to={`p/${post._id}`}>
                    <p className="post-cmt">View all {post.comments.length} comments</p>
                </Link>
                {justCmt &&
                    <p className="description">
                    <span>
                        <Link to={`/${auth.username}`}>
                            {auth.username}
                        </Link>
                    </span>
                        {justCmt}
                    </p>
                }
            </div>
            <div className="comment-wrapper">
                <SentimentSatisfiedAlt/>
                <input
                    type="text"
                    className="comment-box"
                    placeholder="Add a comment"
                    value={cmt}
                    onChange={(e) => setCmt(e.target.value)}
                />
                <AddCmt post={post} auth={auth} cmt={cmt} setCmt={setCmt} setJustCmt={setJustCmt} />
            </div>
        </div>
    )
}

export default PostCard
