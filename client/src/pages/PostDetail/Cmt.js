import TimeAgo from "../../components/functions/TimeAgo";
import {Close} from "@mui/icons-material";
import {deleteCmt} from "../../redux/postsSlice";
import {Link} from "react-router-dom";

const Cmt = ({cmt, dispatch, post, auth}) => {

    return (
        <div className="detail-info-cmt">
            <div>
                <Link to={`/${cmt.userId === auth._id ? auth.username : cmt.username}`}>
                    <img
                        src={cmt.userId === auth._id
                            ? auth.avatar ? auth.avatar : "/img/avatar.jpg"
                            : cmt.avatar ? cmt.avatar : "/img/avatar.jpg"}
                        alt=""
                    />
                </Link>

            </div>
            <div>
                <div className="cmt-container">
                            <span className="cmt">
                                <Link to={`/${cmt.userId === auth._id ? auth.username : cmt.username}`}>
                                    <span className="cmt-user">
                                    {cmt.userId === auth._id
                                        ? auth.username
                                        : cmt.username ? cmt.username : 'Unknown author'
                                    }
                                </span>
                                </Link>
                                {cmt.cmt}
                            </span>
                </div>

                <div style={{display: 'flex'}}>
                    <div className="cmt-time"><p><TimeAgo timestamp={cmt.date}/></p></div>

                    {(post?.userId === auth._id  || cmt.userId === auth._id || auth.roles.Admin) &&
                        <p
                            style={{fontSize: '12px', cursor: 'pointer'}}
                            onClick={() =>
                                dispatch(deleteCmt({
                                    id: post?._id,
                                    cmtId: cmt._id,
                                }))
                            }
                        >
                            &nbsp;&nbsp;&nbsp;&nbsp;x
                        </p>
                    }

                </div>


            </div>
        </div>
    )
}

export default Cmt