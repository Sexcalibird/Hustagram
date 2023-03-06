import "./postSquare.css"

import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import {Link} from "react-router-dom";

const PostSquare = ({post}) => {
    return (
        <div className="gallery-item">
            <Link to={`/p/${post._id}`}>
                <img src={post.img}
                     className="gallery-image"
                     alt=""
                />
                <div className="gallery-item-info">
                    <ul>
                        <li className="gallery-item-likes">
                            <span className="visually-hidden">Likes:</span>
                            <FavoriteIcon fontSize="small"/> {post.likes.length}
                        </li>
                        <li className="gallery-item-comments">
                            <span className="visually-hidden">Comments:</span>
                            <ChatBubbleIcon fontSize="small"/> {post.comments.length}
                        </li>
                    </ul>
                </div>
            </Link>
        </div>
    )
}

export default PostSquare