import './savedPost.css'
import {Footer} from "../../components";
import {useAuth} from "../../hooks";
import {useDispatch, useSelector} from "react-redux";
import {fetchSavedPost, getPosts, getPostsError, getPostsStatus} from "../../redux/postsSlice";
import {useEffect} from "react";
import Loading from "../../components/Loading/Loading";
import PostSquare from "../../components/PostSquare/PostSquare";

const SavedPost = () => {

    const auth = useAuth()
    const dispatch = useDispatch()
    const posts = useSelector(getPosts)
    const postStatus = useSelector(getPostsStatus);
    const error = useSelector(getPostsError);

    useEffect(() => {
        dispatch(fetchSavedPost({userId: auth._id}))
    },[])

    let content;
    if (postStatus === 'loading') {
        content = <Loading/>;
    } else if (postStatus === 'succeeded') {
        const saved = posts.slice().reverse()
        content = saved.map(post => <PostSquare key={post._id} post={post} />)
    } else if (postStatus === 'failed') {
        content = <p>{error}</p>;
    }

    return (
        <div className="saved-container">
            <p className="saved-text">Only you can see what you've saved</p>
            <div className="gallery">
                {content}
            </div>
            <Footer/>
        </div>
    )
}

export default SavedPost