import './messages.css'
import {useDispatch, useSelector} from "react-redux";
import {getChat, getChatList, getChats, getChatStatus} from "../../redux/chatSlice";
import {useEffect} from "react";
import Loading from "../../components/Loading/Loading";
import {useAuth} from "../../hooks";

const Users = ({setHeader, mess}) => {

    const auth = useAuth()
    const dispatch = useDispatch()
    const chats = useSelector(getChats)
    const status = useSelector(getChatStatus)

    useEffect(() => {
        dispatch(getChatList({id: auth._id}))
    }, []);

    let content;
    if (status === 'loading') {
        content = <Loading/>;
    } else if (status === 'succeeded') {
        const orderedChats = chats.slice().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        content = orderedChats.map((c,i) =>
            <div
                key={i}
                className={mess?._id === c._id ? "mess-user mess-selected" : "mess-user"}
                onClick={() => {
                    dispatch(getChat({userId1: auth._id, userId2: c.userId}))
                    setHeader({
                        img: c.avatar ? c.avatar : "/img/avatar.jpg",
                        username: c.username
                    })
                }}
            >
                <img src={c.avatar ? c.avatar : "/img/avatar.jpg"} alt=""/>
                <h4>{c.username}</h4>
            </div>
        )
    } else if (status === 'failed') {
        content = <p>ERROR</p>;
    }

    return (
        <>{content}</>
    )
}

export default Users