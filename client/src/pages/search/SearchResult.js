import {addHistory, deleteHistory} from "../../redux/searchSlice";
import {Link} from "react-router-dom";

const SearchResult = ({s, auth, dispatch, close, history}) => {
    return (
        <section className="search-container" style={{display: "flex"}}>
            <Link
                to={`/${s._id ? s.username : `explore/tags/${encodeURIComponent(s.tag)}`}`}
                className="user_list search-hover"
                onClick={() => {
                    close()
                    dispatch(s._id ? addHistory({
                        id: auth._id,
                        history: {userId: s._id}
                    }) : addHistory({
                        id: auth._id,
                        history: {tag: s.tag}
                    }))
                }}
            >
                <div className="user_list_detail">
                    <img
                        src={s._id
                            ? s.avatar ? s.avatar : "/img/avatar.jpg"
                            : "/img/Number_sign.png"}
                        alt=""
                    />
                    <div>
                        &nbsp;&nbsp;{s._id ? s.username : s.tag}
                        {!s._id && <p>&nbsp;&nbsp;{s.count} {s.count > 1 ? 'posts' : 'post'}</p>}
                    </div>
                </div>

            </Link>
            {history &&
                <button
                    className="search-delete"
                    onClick={() => dispatch(deleteHistory({
                        id: auth._id,
                        history: s._id ? s._id : s.tag
                    }))}
                >
                    X
                </button>
            }
        </section>

    )
}

export default SearchResult