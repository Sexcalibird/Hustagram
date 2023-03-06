import "./create.css"
import CloseIcon from '@mui/icons-material/Close';
import {useContext, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {addNewPost, getPost, getPostsbyID, updatePost} from "../../redux/postsSlice";
import {useAuth} from "../../hooks";
import CreateContext from "../../context/ContextProvider";
import UploadImg from "../functions/UploadImg";

const Create = ({avatar, username}) => {

    const {toggleCreate, setToggleCreate, id, setId} = useContext(CreateContext)

    const list = useSelector((state) => getPostsbyID(state, id))
    const single = useSelector(getPost)
    let post
    if (!list) {
        post = single
    } else {
        post = list
    }

    const [caption, setCaption] = useState('')
    const [picture, setPicture] = useState(null);
    const [imgData, setImgData] = useState( null);
    const [tags, setTags] = useState([])

    const auth = useAuth()
    const dispatch = useDispatch()
    const refCreate = useRef()

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (refCreate.current && !refCreate.current.contains(event.target)) {
                close()
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [refCreate]);

    useEffect(() => {
        setCaption(post?.desc)
        setImgData(post?.img)
        setTags(post?.tags)
    }, [id]);

    const close = () => {
        setToggleCreate(false)
        setCaption('')
        setPicture(null)
        setImgData(null)
        setId('')
    }

    const submitPost = (e) => {
        e.preventDefault()
        if (tags) {
            if (!tags?.every((tag) => tag.startsWith('#'))) {
                return
            }
        }
        dispatch(!post ? addNewPost({
            id: auth._id,
            caption: caption,
            imgData,
            tags: [...new Set(tags)]
        }) : updatePost({
            id: id,
            caption: caption,
            imgData,
            tags: [...new Set(tags)]
        }))
            .unwrap()
            .then( () => {
                setCaption('')
                setPicture(null)
                setImgData(null)
                setTags([])
            })
            .catch( err => {
                return err.messages
            })
    }

    return (
        <form>
            {toggleCreate && (
                <div className="overlay">
                    <button
                        className="closebtn"
                        onClick={close}
                    >
                        <CloseIcon fontSize="large" sx={{ color: 'white' }}/>
                    </button>

                    <div className="overlay-content" ref={refCreate}>
                        <div className="overlay-content-header">
                            {post ? "Edit your post" : "Create new post"}
                            <button
                                className="share-btn"
                                type="submit"
                                disabled={!caption || !imgData}
                                onClick={submitPost}
                            >
                                {post ? "Update" : "Share"}
                            </button>
                        </div>
                            <div className="overlay-content-main">

                                <div className="overlay-content-left">
                                    <div className="overlay-user">
                                        <div className="overlay-profile-pic">
                                            <img src={avatar? avatar : "/img/avatar.jpg"} alt=""/>
                                        </div>
                                        <p className="overlay-username">{username}</p>
                                    </div>
                                    <textarea
                                        placeholder="Write a caption..."
                                        value={caption}
                                        onChange={(e) => setCaption(e.target.value)}
                                    />
                                    <input
                                        placeholder="Tags"
                                        value={tags?.join(' ') || ''}
                                        onChange={(e) => setTags(e.target.value.split(' '))}
                                    />
                                </div>

                                <div className="overlay-content-right">
                                    <label htmlFor="file-upload" className="custom-file-upload">
                                        Select image from computer
                                    </label>
                                    <UploadImg setImgData={setImgData} setPicture={setPicture}/>
                                    <img src={imgData? imgData : "/img/no-photo-available.png"} alt=""/>
                                </div>

                            </div>
                    </div>
                </div>
            )}
        </form>
    )
}

export default Create