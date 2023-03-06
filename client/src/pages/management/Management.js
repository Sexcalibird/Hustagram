import './management.css'
import {useDispatch, useSelector} from "react-redux";
import {banUser, clearStatistics, deleteUser, fetchAllUsers, getAllUsers} from "../../redux/adminSlice";
import {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";

const Management = () => {

    const dispatch = useDispatch()
    const location = useLocation()
    const users = useSelector(getAllUsers)

    const [search, setSearch] = useState('')

    useEffect(() => {
        dispatch(fetchAllUsers())
        return () => {
            dispatch(clearStatistics())
        };
    }, []);

    return (
        <div className="management-container">
            <h1>User Management</h1>
            <input
                type="text"
                placeholder="Search..."
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className="management-header">
                <h4 className="management-header-item">id</h4>
                <h4 className="management-header-item">Username</h4>
                <h4 className="management-header-item">Email</h4>
                <h4 className="management-header-item">Created at</h4>
            </div>
            <div className="management-list-container">
                {users?.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                    .filter((user) => user.username.toLowerCase().includes(search))
                    .map((u,i) =>
                    <div className="management-list" key={i}>
                        <div className="management-list-item">
                            {u._id}
                        </div>
                        <Link to={`/${u.username}`} className="management-list-item">
                            <img src={u.avatar ? u.avatar : "/img/avatar.jpg"} alt=""/>
                            &nbsp;&nbsp;{u.username}
                        </Link>
                        <div className="management-list-item">
                            {u.email}
                        </div>
                        <div className="management-list-item">
                            {u.createdAt}
                        </div>
                        {!u.roles.Admin &&
                            <div className="management-list-last">
                                <Link to={`${u._id}`} state={{ background: location }}>
                                    <button>Edit</button>
                                </Link>
                                &nbsp;&nbsp;
                                <button
                                    className={u.banned === true ? "banned" : ""}
                                    onClick={() => dispatch(banUser({id: u._id}))}
                                >
                                    {u.banned === true ? 'Banned' : 'Ban'}
                                </button>
                                &nbsp;&nbsp;
                                <button
                                    style={{backgroundColor: 'red'}}
                                    onClick={() => dispatch(deleteUser({id: u._id}))}
                                >
                                    Delete
                                </button>
                            </div>
                        }
                    </div>
                )}
            </div>

        </div>
    )
}

export default Management