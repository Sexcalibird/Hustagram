import {likePost} from "../../redux/postsSlice";
import {Favorite, FavoriteBorder} from "@mui/icons-material";
import {useDispatch} from "react-redux";
import {newNotification} from "../../redux/notificationSlice";
import {useContext} from "react";
import CreateContext from "../../context/ContextProvider";

const Like = ({post, auth, likes, setLikes}) => {

    const dispatch = useDispatch()
    const {socket} = useContext(CreateContext)

    const hasLikedPost = post?.likes?.find((like) => like === auth._id)

    const handleLike = () => {
        dispatch(likePost({id: post._id, userId: auth._id}))
            .unwrap()
            .then()
            .catch(err => {
                return err.message
            })
        if (hasLikedPost) {
            setLikes(post.likes.filter((id) => id !== auth._id));
        } else {
            setLikes([...post.likes, auth._id]);
            if (post.userId !== auth._id) {
                dispatch(newNotification({
                    id: post.userId,
                    postId: post._id,
                    userId: auth._id,
                    text: "liked your post"
                }))
                socket.emit("sendNotification", {
                    receiverId: post.userId,
                    postId: post._id,
                    userId: auth._id,
                    avatar: auth.avatar,
                    username: auth.username,
                    text: "liked your post",
                    date: new Date(),
                });
            }
        }
    }

    return (
        <button onClick={handleLike}>
            {likes?.find((like) => like === auth._id)
                ? <Favorite fontSize="large" sx={{ color: "#f73378" }}/>
                : <FavoriteBorder fontSize="large"/>
            }
        </button>
    )
}

export default Like