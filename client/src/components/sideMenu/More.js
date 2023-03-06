import {signOut} from "../../redux/authSlice";
import {useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {clearUsers} from "../../redux/usersSlice";
import {clearPosts} from "../../redux/postsSlice";
import {Link} from "react-router-dom";
import {useAuth} from "../../hooks";

import DehazeOutlinedIcon from "@mui/icons-material/DehazeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import InstagramIcon from '@mui/icons-material/Instagram';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';

const More = ({collapse}) => {

    const [toggleMore, setToggleMore] = useState(false)

    const auth = useAuth()
    const dispatch = useDispatch()
    const refMore = useRef()

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (refMore.current && !refMore.current.contains(event.target)) {
                setToggleMore(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [refMore]);

    return (
        <div ref={refMore}>
            <div className={toggleMore ? "more-menu" : "hide"}>

                <Link to={`/accounts/edit`}>
                    <button className="buttonTop">
                        Settings
                        <SettingsOutlinedIcon/>
                    </button>
                </Link>

                <Link to={`/accounts/saved`}>
                    <button style={{justifyContent: "space-between"}}>
                        Saved
                        <BookmarkBorderOutlinedIcon/>
                    </button>
                </Link>

                {auth?.roles.Admin &&
                    <>
                        <Link to={`/admin/statistic`}>
                            <button style={{justifyContent: "space-between"}}>
                                Statistics
                                <InstagramIcon/>
                            </button>
                        </Link>
                        <Link to={`/admin/management`}>
                            <button style={{justifyContent: "space-between"}}>
                                User Management
                                <SupervisedUserCircleIcon/>
                            </button>
                        </Link>
                    </>
                }
                <button className="buttonBot"
                        onClick={() => {
                            dispatch(signOut())
                            dispatch(clearUsers())
                            dispatch(clearPosts())
                        }
                    }
                >
                    Log out
                </button>
            </div>

            <div className="menu-btn more-btn">
                <button
                    className={toggleMore ? "selected" : ""}
                    onClick={() => setToggleMore(!toggleMore)}
                >
                    <span><DehazeOutlinedIcon fontSize="large"/></span>
                    <span className={collapse ? "hide" : ""}>&nbsp;&nbsp;&nbsp;More</span>
                </button>
            </div>
        </div>
    )
}

export default More
