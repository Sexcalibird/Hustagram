import "./home.css"
import {Footer, PostCard} from "../../components";
import {useAuth} from "../../hooks";
import {useDispatch, useSelector} from "react-redux";
import {fetchHomePosts, getPosts, getPostsError, getPostsStatus} from "../../redux/postsSlice";
import {useContext, useEffect} from "react";
import Loading from "../../components/Loading/Loading";
import UsersList from "../../components/UsersList/UsersList";
import {getSuggestion, getSuggestions, getUsers} from "../../redux/usersSlice";
import {Link} from "react-router-dom";
import CreateContext from "../../context/ContextProvider";

const Home = () => {

    const auth = useAuth()
    const dispatch = useDispatch()
    const posts = useSelector(getPosts)
    const suggestions = useSelector(getSuggestions)
    const postStatus = useSelector(getPostsStatus);
    const error = useSelector(getPostsError);

    const {modalOpen} = useContext(CreateContext)

    useEffect(() => {
        dispatch(fetchHomePosts({userId: auth._id}))
        dispatch(getSuggestion({id: auth._id}))
    }, []);

    let content;
    if (postStatus === 'loading') {
        content = <Loading/>;
    } else if (postStatus === 'succeeded') {
        const orderedPosts = posts.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        content = orderedPosts.map(post => <PostCard key={post._id} post={post} />)
    } else if (postStatus === 'failed') {
        content = <p>{error}</p>;
    }

    return (
        <div className={modalOpen ? 'list-modal-open' : 'list-container'}>
            <div>
                {content}
            </div>

            <div className="home-side">
                <Link to={`/${auth?.username}`} className="home-side-user">
                    <img src={auth?.avatar? auth?.avatar : "/img/avatar.jpg"} alt=""/>
                    <h4>{auth?.username}</h4>
                </Link>
                <div style={{marginBottom: "-40px"}}>
                    <p className="suggestion">Suggestions for you</p>

                    {suggestions?.map(s => <UsersList key={s._id} user={s}/>)}

                </div>
                <Footer/>
            </div>

        </div>
    )
}

export default Home