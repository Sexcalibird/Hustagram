import {useAuth} from "../../hooks";
import {useState} from "react";
import UploadImg from "../../components/functions/UploadImg";
import {useDispatch} from "react-redux";
import {updateAvatar} from "../../redux/usersSlice";

const ChangeAvatar = () => {

    const auth = useAuth()
    const dispatch = useDispatch()

    const [picture, setPicture] = useState(null);
    const [imgData, setImgData] = useState( auth?.avatar);

    const upload = () => {
        dispatch(updateAvatar({
            id: auth._id,
            avatar: imgData
        }))
            .unwrap()
            .then(() => setPicture(null))
            .catch( err => {
                return err.messages
            })
    }

    return (
        <div className="change-avatar-container">
            <label htmlFor="file-upload" className="custom-avatar-upload">
                <img src={imgData? imgData : "/img/avatar.jpg"} alt=""/>
            </label>
            <UploadImg
                setImgData={setImgData}
                setPicture={setPicture}
            />
            <div style={{width: "90px", margin:"45px auto"}}>
                <button
                    className="btn-form"
                    onClick={upload}
                    disabled={!picture}
                >Upload
                </button>
            </div>
        </div>
    )
}

export default ChangeAvatar