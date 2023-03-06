import "./postDetail.css"
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    deletePost,
    fetchCmt,
    fetchPostDetail,
    getCmt,
    getPost,
    getPostsStatus,
    reset
} from "../../redux/postsSlice";
import {useContext, useEffect, useState} from "react";
import {useAuth} from "../../hooks";
import TimeAgo from "../../components/functions/TimeAgo";
import Loading from "../../components/Loading/Loading";

import {
    ChatBubbleOutline, Share,
    SentimentSatisfiedAlt, Edit, Close,
} from "@mui/icons-material";
import {followUser} from "../../redux/usersSlice";
import Cmt from "./Cmt";
import Like from "../../components/functions/Like";
import Saved from "../../components/functions/Saved";
import CreateContext from "../../context/ContextProvider";
import AddCmt from "../../components/functions/AddCmt";
import {newNotification} from "../../redux/notificationSlice";

const PostDetail = () => {

    const {setToggleCreate, setId, socket} = useContext(CreateContext)

    const auth = useAuth()
    const dispatch = useDispatch()
    const { postId } = useParams()
    const post = useSelector(getPost)
    const cmt = useSelector(getCmt)
    const status = useSelector(getPostsStatus)
    const location = useLocation()
    const navigate = useNavigate()

    const [likes, setLikes] = useState([])
    const [addCmt, setAddCmt] = useState('')
    const following = auth.followings.find((follow) => follow === post?.userId)

    useEffect(() => {
        dispatch(fetchPostDetail({id: postId}))
        dispatch(fetchCmt({id: postId}))
        return () => {
            dispatch(reset())
        }
    }, [postId]);

    useEffect(() => {
        setLikes(post?.likes)
    },[post])

    if (status === "loading") {
        return <Loading/>
    } else if (status === "rejected") {
        return (
            <section style={{margin: "auto"}}>
                <h2>Post not found!</h2>
            </section>
        )
    }

    return (
        <article className="detail-container">
            <div className="detail-img">
                <img src={post?.img} alt=""/>
            </div>

            <div className="detail-info">

                <div className="detail-info-header">
                    <div className="detail-user">
                        <Link to={`/${post?.username}`}>
                            <img src={post?.avatar ? post.avatar : "/img/avatar.jpg"} alt=""/>
                        </Link>
                        <Link to={`/${post?.username}`}>
                            {post ? post.username : 'Unknown author'}
                        </Link>
                        {(!following && post?.userId !== auth._id) &&
                            <p onClick={() => {
                                dispatch(followUser({id: auth._id, userId: post.userId}))
                                if (!following) {
                                    dispatch(newNotification({
                                        id: post.userId,
                                        postId: null,
                                        userId: auth._id,
                                        text: "is following you"
                                    }))
                                    socket.emit("sendNotification", {
                                        receiverId: post.userId,
                                        postId: null,
                                        userId: auth._id,
                                        avatar: auth.avatar,
                                        username: auth.username,
                                        text: "is following you",
                                        date: new Date(),
                                    });
                                }
                            }}>
                                &nbsp;• Follow
                            </p>
                        }
                    </div>
                    {((post?.userId === auth._id) || auth.roles.Admin)
                        && (
                            <div style={{display: "flex", verticalAlign: "middle"}}>
                                <button onClick={() => {
                                    setToggleCreate(true)
                                    setId(post._id)
                                }}>
                                    <Edit fontSize="small"/>
                                </button>
                                <button
                                    onClick={() => {
                                        dispatch(deletePost({id: post._id}))
                                        navigate(-1)
                                    }}
                                >
                                    <Close/>
                                </button>
                            </div>
                        )
                    }
                </div>


                <div className="cmt-wrapper">

                    <div className="detail-info-cmt">
                        <div>
                            <Link to={`/${post?.username}`}>
                                <img src={post?.avatar ? post.avatar : "/img/avatar.jpg"} alt=""/>
                            </Link>
                        </div>
                        <div>
                            <div className="cmt-container">
                            <span className="cmt">
                                <Link to={`/${post?.username}`}>
                                    <span className="cmt-user">
                                        {post ? post.username : 'Unknown author'}
                                    </span>
                                </Link>
                                {post?.desc}<br/>
                                {post?.tags?.map((tag, index) => (
                                    <Link to={`/explore/tags/${encodeURIComponent(tag)}`} key={index} style={{  color: '#3f51b5' }}>
                                        {`${tag} `}
                                    </Link>
                                ))}
                            </span>
                            </div>
                            <div className="cmt-time"><p><TimeAgo timestamp={post?.createdAt}/></p></div>
                        </div>
                    </div>

                    {cmt?.slice().sort((a, b) => b.date.localeCompare(a.date))
                        .map(cmt =>
                        <Cmt key={cmt._id} cmt={cmt} dispatch={dispatch} post={post} auth={auth}/>
                    )}

                </div>

                <div className="detail-info-bot">
                    <div className="cmtbtn-container">
                        <div>
                            <Like
                                post={post}
                                auth={auth}
                                likes={likes}
                                setLikes={setLikes}
                            />
                            <button style={{margin: "0 15px"}}><ChatBubbleOutline fontSize="large"/></button>
                            <button onClick={() =>  navigator.clipboard.writeText(`${window.location.href}`)}>
                                <Share fontSize="large"/>
                            </button>
                        </div>
                        <Saved post={post} auth={auth}/>
                    </div>
                    <div className="detail-likes">
                        <Link to={`liked_by`}  state={{ background: location }}>
                            {likes?.length} {likes?.length > 2 ? "likes" : "like"}
                        </Link>
                    </div>
                    <p className="detail-time">
                        <TimeAgo timestamp={post?.createdAt}/>{post?.edited === true && " • Edited"}
                    </p>
                    <div className="detail-addcmt">
                        <SentimentSatisfiedAlt fontSize="large"/>
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={addCmt}
                            onChange={(e) => setAddCmt(e.target.value)}
                        />
                        <AddCmt post={post} auth={auth} cmt={addCmt} setCmt={setAddCmt}/>
                    </div>
                </div>

            </div>

        </article>

    )
}

export default PostDetail