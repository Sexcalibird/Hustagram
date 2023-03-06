import {addCmt} from "../../redux/postsSlice";
import {useDispatch} from "react-redux";
import {newNotification} from "../../redux/notificationSlice";
import {useContext} from "react";
import CreateContext from "../../context/ContextProvider";

const AddCmt = ({post, auth, cmt, setCmt, setJustCmt}) => {

    const dispatch = useDispatch()
    const {socket} = useContext(CreateContext)

    const handleCmt = () => {
        dispatch(addCmt({id: post?._id, author: auth._id, cmt: cmt}))
            .unwrap()
            .then(() => {
                if (setJustCmt) {setJustCmt(cmt)}
                setCmt('')
            })
            .catch(err => {
                return err
            })
        if (post.userId !== auth._id) {
            dispatch(newNotification({
                id: post.userId,
                postId: post._id,
                userId: auth._id,
                text: "commented on your post"
            }))
            socket.emit("sendNotification", {
                receiverId: post.userId,
                postId: post._id,
                userId: auth._id,
                avatar: auth.avatar,
                username: auth.username,
                text: "commented on your post",
                date: new Date(),
            });
        }
    }

    return (
        <button
            className="cmt-disabled"
            onClick={handleCmt}
            disabled={!cmt}
        >
            Post
        </button>
    )
}

export default AddCmt