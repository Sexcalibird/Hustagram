import "./sideMenu.css"
import {Link} from "react-router-dom";
import More from "./More";
import {useContext} from "react";
import CreateContext from "../../context/ContextProvider";

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import ExploreIcon from '@mui/icons-material/Explore';
import SendTimeExtensionOutlinedIcon from '@mui/icons-material/SendTimeExtensionOutlined';
import SendTimeExtensionIcon from '@mui/icons-material/SendTimeExtension';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';

const SideMenu = ({selectedMenu, setSelectedMenu, collapse, setCollapse, avatar, username}) => {

    const {setToggleCreate} = useContext(CreateContext)

    return (
        <div style={{width: "300px"}}>
            <div className={collapse ? "side side-collapse" : "side"}>
                <div className="side-logo">
                    <Link to="/">
                        <h3>{collapse ? "H" : "Hustagram"}</h3>
                    </Link>
                </div>

                <div className="container-side">
                    <div className="menu-btn">

                        <Link to="/">
                            <button className={selectedMenu === "/" ? "selected" : ""}>
                        <span>
                            {selectedMenu === "/" ? <HomeIcon fontSize="large"/> : <HomeOutlinedIcon fontSize="large"/>}
                        </span>
                                <span className={collapse ? "hide" : ""}>&nbsp;&nbsp;&nbsp;Home</span>
                            </button>
                        </Link>

                        <button
                            className={selectedMenu === "search" ? "collapse-selected" : ""}
                            onClick={() => {
                            setCollapse(true)
                            setSelectedMenu('search')
                        }}>
                            <span>{selectedMenu === "search" ? <SavedSearchIcon fontSize="large"/> : <SearchIcon fontSize="large"/>}</span>
                            <span className={collapse ? "hide" : ""}>&nbsp;&nbsp;&nbsp;Search</span>
                        </button>

                        <Link to="/explore">
                            <button className={selectedMenu === "/explore" ? "selected" : ""}>
                        <span>
                            {selectedMenu === "/explore" ? <ExploreIcon fontSize="large"/> : <ExploreOutlinedIcon fontSize="large"/>}
                        </span>
                                <span className={collapse ? "hide" : ""}>&nbsp;&nbsp;&nbsp;Explore</span>
                            </button>
                        </Link>

                        <Link to="/direct/inbox" >
                            <button className={selectedMenu === "/direct/inbox" ? "selected" : ""}>
                        <span>
                            {selectedMenu === "/direct/inbox" ? <SendTimeExtensionIcon fontSize="large"/> : <SendTimeExtensionOutlinedIcon fontSize="large"/>}
                        </span>
                                <span className={collapse ? "hide" : ""}>&nbsp;&nbsp;&nbsp;Messages</span>
                            </button>
                        </Link>

                        <button
                            className={selectedMenu === "notification" ? "collapse-selected" : ""}
                            onClick={() => {
                                setCollapse(true)
                                setSelectedMenu('notification')
                            }}
                        >
                            <span>{selectedMenu === "notification" ? <NotificationsActiveIcon fontSize="large"/> : <NotificationsActiveOutlinedIcon fontSize="large"/>}</span>
                            <span className={collapse ? "hide" : ""}>&nbsp;&nbsp;&nbsp;Notifications</span>
                        </button>

                        <button
                            className={selectedMenu === "create" ? "selected" : ""}
                            onClick={() => {
                                setToggleCreate(true)
                                setSelectedMenu('create')
                            }}
                        >
                        <span>
                            {selectedMenu === "create" ? <AddBoxIcon fontSize="large"/> : <AddBoxOutlinedIcon fontSize="large"/>}
                        </span>
                            <span className={collapse ? "hide" : ""}>&nbsp;&nbsp;&nbsp;Create</span>
                        </button>

                        <Link to={`/${username}`}>
                            <button className={selectedMenu === `/${username}` ? "selected" : ""}>
                            <span className="side-profile">
                                <img src={avatar? avatar : "/img/avatar.jpg"} alt=""/>
                            </span>
                                <span className={collapse ? "hide" : ""}>&nbsp;&nbsp;&nbsp;Profile</span>
                            </button>
                        </Link>

                    </div>
                    <More collapse={collapse}/>
                </div>
            </div>
        </div>

    )
}

export default SideMenu