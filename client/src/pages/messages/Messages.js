import './messages.css'
import {useAuth} from "../../hooks";
import Users from "./Users";
import {SentimentSatisfiedAlt} from "@mui/icons-material";
import {useContext, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {clearChat, getChats, getMess, newMessage, receiveMess} from "../../redux/chatSlice";
import {Link} from "react-router-dom";
import Mess from "./Mess";
import CreateContext from "../../context/ContextProvider";

const Messages = () => {

    const auth = useAuth()
    const mess = useSelector(getMess)
    const chats = useSelector(getChats)
    const dispatch = useDispatch()
    const scrollRef = useRef()
    const {socket} = useContext(CreateContext)

    const [newMess, setNewMess] = useState('')
    const [header, setHeader] = useState({
        img: '',
        username: ''
    })

    useEffect(() => {
        if (mess !== null) {
            const found = chats.find(c => c._id === mess._id)
            setHeader({
                img: found.avatar ? found.avatar : "/img/avatar.jpg",
                username: found.username
            })
        }
    },[chats])


    useEffect(() => {
        socket.on("getMessage", (data) => {
            dispatch(receiveMess(data))
        });
    },[])

    useEffect(() => {
        return () => {
            dispatch(clearChat())
        }
    },[])

    const handleSend = () => {
        dispatch(newMessage({id: mess._id, userId: auth._id, mess: newMess}))
            .unwrap()
            .then()
            .catch(err => {
                return err.message
            })
        socket.emit("sendMessage", {
            userId: auth._id,
            receiverId: mess.members.find((member) => member !== auth._id),
            mess: newMess,
            date: new Date(),
        });
    }

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [mess]);

    return (
        <div className="mess-page">
            <div className="mess-container">
                <div className="mess-users">
                    <div className="mess-auth">
                        <h4>{auth.username}</h4>
                    </div>
                    <div style={{padding: '10px'}}>
                        <Users setHeader={setHeader} mess={mess}/>
                    </div>
                </div>

                <div className="mess-main">
                    {mess !== null && (
                        <>
                            <Link to={`/${header.username}`} className="mess-user mess-main-header">
                                <img src={header.img} alt=""/>
                                <h4>{header.username}</h4>
                            </Link>
                            <div className="mess-inbox">
                                {mess.messages.map((m,i) =>
                                    <div ref={scrollRef} key={i}>
                                        <Mess m={m} own={m.userId === auth._id} user={header}/>
                                    </div>
                                )}
                            </div>

                            <div className="mess-input">
                                <button>:)</button>
                                <textarea
                                    placeholder="Aa"
                                    value={newMess}
                                    onChange={(e) => setNewMess(e.target.value)}
                                />
                                <button onClick={handleSend}>Send</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Messages