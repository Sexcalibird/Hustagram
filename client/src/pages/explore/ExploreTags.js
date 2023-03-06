import './explore.css'
import {Footer} from "../../components";
import PostSquare from "../../components/PostSquare/PostSquare";
import {useAuth} from "../../hooks";
import {useDispatch, useSelector} from "react-redux";
import {fetchExploreTags, getPosts, getPostsError, getPostsStatus} from "../../redux/postsSlice";
import {useParams} from "react-router-dom";
import {useEffect} from "react";
import Loading from "../../components/Loading/Loading";

const ExploreTags = () => {

    const {tag} = useParams()

    const auth = useAuth()
    const dispatch = useDispatch()
    const posts = useSelector(getPosts)
    const postStatus = useSelector(getPostsStatus);
    const error = useSelector(getPostsError);

    useEffect(() => {
        dispatch(fetchExploreTags({
            tag: encodeURIComponent(tag)
        }))
    },[tag])

    let content;
    if (postStatus === 'loading') {
        content = <Loading/>;
    } else if (postStatus === 'succeeded') {
        content = posts.map(post => <PostSquare key={post._id} post={post} />)
    } else if (postStatus === 'failed') {
        content = <p>{error}</p>;
    }

    return (
        <div className="explore-container">
            <div style={{margin: '40px', paddingLeft: '65px'}}>
                <h1 style={{margin: '5px'}}>{tag}</h1>
                <p style={{fontSize: '19px', margin: '5px'}}>
                    <span style={{fontWeight: 'bold'}}>{posts?.length}</span> {posts?.length > 1 ? 'posts' : 'post'}
                </p>
            </div>
            <div className="gallery">
                {content}
            </div>
            <Footer/>
        </div>
    )
}

export default ExploreTags