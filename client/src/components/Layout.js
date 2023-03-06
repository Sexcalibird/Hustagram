import {Outlet, useLocation} from 'react-router-dom';
import {Create, SideMenu} from "./index";
import {useContext, useEffect, useState} from "react";
import {useAuth} from "../hooks";
import Search from "../pages/search/Search";
import Notifications from "./notification/Notifications";
import CreateContext from "../context/ContextProvider";
import {receiveNews} from "../redux/notificationSlice";
import {useDispatch} from "react-redux";

const Layout = () => {

    const auth = useAuth()
    const location = useLocation()
    const dispatch = useDispatch()
    const {toggleCreate} = useContext(CreateContext)

    const [selectedMenu, setSelectedMenu] = useState('/')
    const [collapse, setCollapse] = useState(false)

    const {socket} = useContext(CreateContext)
    useEffect(() => {
        if (auth) {
            socket.emit("addUser", auth?._id)
        }
        socket.on("getUsers", users => {
            console.log(users)
        })
    },[])
    useEffect(() => {
        socket.on("getNotification", (data) => {
            dispatch(receiveNews(data))
        });
        return () => {
            socket.off("getNotification");
        }
    },[])

    useEffect(() => {
        setSelectedMenu(location.pathname)
    },[location])

    useEffect(() => {
        if (collapse === false && toggleCreate === false) {
            setSelectedMenu(location.pathname)
        }
    },[collapse, toggleCreate])

    return (
            <main className="App">
                <SideMenu
                    selectedMenu={selectedMenu}
                    setSelectedMenu={setSelectedMenu}
                    collapse={collapse}
                    setCollapse={setCollapse}
                    avatar={auth?.avatar}
                    username={auth?.username}
                />
                <Search
                    collapse={collapse}
                    setCollapse={setCollapse}
                    selectedMenu={selectedMenu}
                />
                <Notifications
                    collapse={collapse}
                    setCollapse={setCollapse}
                    selectedMenu={selectedMenu}
                />
                <Create
                    avatar={auth?.avatar}
                    username={auth?.username}
                />
                <div className="mainContainer">
                    <Outlet />
                </div>
            </main>
    )
}

export default Layout