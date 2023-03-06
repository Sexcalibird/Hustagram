import {useAuth} from "../../hooks";
import TimeAgo from "../../components/functions/TimeAgo";

const Mess = ({m, own, user}) => {

    const auth = useAuth()

    return (
        <div className={own ? "message own" : "message"}>
            {own
                ? <div className="messageTop">
                    <p className="messageText">{m.mess}</p>
                    <img
                        className="messageImg"
                        src={auth.avatar? auth?.avatar : "/img/avatar.jpg"}
                        alt=""
                    />
                </div>
                : <div className="messageTop">
                    <img
                        className="messageImg"
                        src={user.img ? user.img : "/img/avatar.jpg"}
                        alt=""
                    />
                    <p className="messageText">{m.mess}</p>
                </div>
            }
            <div className="messageBottom"><TimeAgo timestamp={m.date}/></div>
        </div>
    )
}

export default Mess