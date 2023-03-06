import "./profilePosts.css"
import PostSquare from "../../components/PostSquare/PostSquare";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {fetchProfilePosts, getPosts, getPostsError, getPostsStatus} from "../../redux/postsSlice";
import Loading from "../Loading/Loading";

const ProfilePosts = ({userId}) => {

    const dispatch = useDispatch()
    const posts = useSelector(getPosts)
    const postStatus = useSelector(getPostsStatus);
    const error = useSelector(getPostsError);

    useEffect(() => {
        dispatch(fetchProfilePosts({userId}))
    }, [userId]);

    let content;
    if (postStatus === 'loading') {
        content = <Loading/>;
    } else if (postStatus === 'succeeded') {
        content = posts.map(post => <PostSquare key={post._id} post={post} />)
    } else if (postStatus === 'failed') {
        content = <p>{error}</p>;
    }

    return (
        <div className="profile-posts-container">
            <div className="gallery">
                {content}
            </div>
        </div>
    )
}

export default ProfilePosts