import './notification.css'
import {useContext, useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useAuth} from "../../hooks";
import {getNotification, getNotifications, getNtfcStatus, receiveNews} from "../../redux/notificationSlice";
import {Link} from "react-router-dom";
import Loading from "../Loading/Loading";
import TimeAgo from "../functions/TimeAgo";
import CreateContext from "../../context/ContextProvider";

const Notifications = ({collapse, selectedMenu, setCollapse}) => {

    const auth = useAuth()
    const dispatch = useDispatch()
    const notifications = useSelector(getNotifications)
    const status = useSelector(getNtfcStatus)
    const refNtfc = useRef()

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (refNtfc.current && !refNtfc.current.contains(event.target)) {
                setCollapse(false)
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [refNtfc]);

    useEffect(() => {
        if (auth) {
            dispatch(getNotification({id: auth?._id}))
        }
    },[])

    let content;
    if (status === 'loading') {
        content = <Loading/>;
    } else if (status === 'succeeded') {
        content = notifications.slice().sort((a, b) => b.date.localeCompare(a.date)).map((n,index) =>
            <Link
                to={n.postId ? `/p/${n.postId}` : `/${n.username}`}
                key={index}
                className="user_list search-hover"
            >
                <div className="user_list_detail">
                    <img
                        src={n.avatar ? n.avatar : "/img/avatar.jpg"}
                        alt=""
                    />
                    &nbsp;&nbsp;
                    <div>
                        {n.username}
                        <span className="ntfc-text"> {n.text}.</span>
                        <p className="ntfc-ago"> <TimeAgo timestamp={n.date}/></p>
                    </div>
                </div>
            </Link>
        )
    } else if (status === 'failed') {
        content = <p>ERROR</p>;
    }

    return (
        <section>
            {(collapse && selectedMenu === "notification") && (
                <div className="search-bar" ref={refNtfc}>
                    <div>
                        <h1>Notifications</h1>
                    </div>
                    <div className="search-preview">
                        {content}
                    </div>
                </div>
            )}
        </section>
    )
}

export default Notifications