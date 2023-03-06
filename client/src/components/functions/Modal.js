import {useLocation, useNavigate, useParams} from "react-router-dom";
import UsersList from "../UsersList/UsersList";
import {useContext, useEffect, useRef} from "react";
import CreateContext from "../../context/ContextProvider";
import {useAuth} from "../../hooks";
import {useDispatch, useSelector} from "react-redux";
import {getFollowers, getFollowings, getStatus, getUsers} from "../../redux/usersSlice";
import Loading from "../Loading/Loading";
import {getUserLike} from "../../redux/postsSlice";

const Modal = () => {

    const auth = useAuth()
    const dispatch = useDispatch()
    const users = useSelector(getUsers)
    const status = useSelector(getStatus)

    const {postId, username} = useParams()

    const navigate = useNavigate();
    const location = useLocation()
    const refModal = useRef()
    const {setModalOpen} = useContext(CreateContext)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (refModal.current && !refModal.current.contains(event.target)) {
                navigate(-1)
                setModalOpen(false)
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [refModal]);

    useEffect(() => {
        dispatch(postId ? getUserLike({id: postId})
            : location.pathname === `/${username}/followers`
            ? getFollowers({id: username})
            : getFollowings({id: username}))
    },[])

    let content;
    if (status === 'loading') {
        content = <Loading/>;
    } else if (status === 'succeeded') {
        const orderedPosts = users.slice().reverse()
        content = orderedPosts.map(user => <UsersList key={user._id} user={user} />)
    } else if (status === 'failed') {
        content = <p>ERROR</p>;
    }

    return (
        <div className="modalDiv">
            <div className="modal" ref={refModal}>

                <div className="modal-header">
                    <h4>
                        {postId
                            ? 'Likes'
                            : location.pathname === `/${username}/followers` ? 'Followers' : 'Followings'}
                    </h4>
                </div>

                <div style={{ width: '100%', padding: '10px', marginTop: '40px'}}>
                    {content}
                </div>

            </div>
        </div>
    );
};

export default Modal