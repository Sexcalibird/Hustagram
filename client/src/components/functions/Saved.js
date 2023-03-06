import {Bookmark, BookmarkBorder} from "@mui/icons-material";
import {savePost} from "../../redux/usersSlice";
import {useDispatch} from "react-redux";

const Saved = ({post, auth}) => {

    const dispatch = useDispatch()

    const hasSaved = auth.saved.find((save) => save === post?._id)
    const handleSave = () => {
        dispatch(savePost({id: auth._id, postId: post._id}))
            .unwrap()
            .then()
            .catch(err => {
                return err.message
            })
    }

    return (
        <button onClick={handleSave}>
            {hasSaved
                ? <Bookmark fontSize="large"/>
                : <BookmarkBorder fontSize="large"/>}
        </button>
    )
}

export default Saved