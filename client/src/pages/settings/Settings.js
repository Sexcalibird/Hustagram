import "./settings.css"
import {Footer} from "../../components";
import EditProfile from "./EditProfile";
import ChangeAvatar from "./ChangeAvatar";
import ChangePass from "./ChangePass";
import {useState} from "react";

const Settings = () => {

    const [menu, setMenu] = useState('edit')

    return (
        <div className="settings-container">
            <div className="settings-menu">
                <div className="settings-menu-btn">
                    <button
                        className={menu === 'edit' ? 'chosen' : ''}
                        onClick={() => setMenu('edit')}
                    >
                        Edit Profile
                    </button>
                    <button
                        className={menu === 'ava' ? 'chosen' : ''}
                        onClick={() => setMenu('ava')}
                    >
                        Change Avatar
                    </button>
                    <button
                        className={menu === 'pwd' ? 'chosen' : ''}
                        onClick={() => setMenu('pwd')}
                    >
                        Change Password
                    </button>
                </div>
                <div style={{margin: "-40px 0"}}>
                    <Footer/>
                </div>

            </div>

            <div className="settings-content">
                {menu === 'edit' && <EditProfile/>}
                {menu === 'ava' && <ChangeAvatar/>}
                {menu === 'pwd' && <ChangePass/>}
            </div>
        </div>
    )
}

export default Settings