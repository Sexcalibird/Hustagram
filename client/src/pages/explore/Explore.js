import "./explore.css"
import PostSquare from "../../components/PostSquare/PostSquare";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {fetchExplorePosts, getPosts, getPostsError, getPostsStatus} from "../../redux/postsSlice";
import {useAuth} from "../../hooks";
import {Footer} from "../../components";
import Loading from "../../components/Loading/Loading";

const Explore = () => {

    const auth = useAuth()
    const dispatch = useDispatch()
    const posts = useSelector(getPosts)
    const postStatus = useSelector(getPostsStatus);
    const error = useSelector(getPostsError);

    useEffect(() => {
        dispatch(fetchExplorePosts({userId: auth._id}))
    }, [auth]);

    let content;
    if (postStatus === 'loading') {
        content = <Loading/>;
    } else if (postStatus === 'succeeded') {
        const random = posts.slice().sort((a, b) => 0.5 - Math.random());
        content = random.map(post => <PostSquare key={post._id} post={post} />)
    } else if (postStatus === 'failed') {
        content = <p>{error}</p>;
    }

    return (
        <div className="explore-container">
            <div className="gallery">
                {content}
            </div>
            <Footer/>
        </div>
    )
}

export default Explore