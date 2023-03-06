
const UploadImg = ({setPicture, setImgData}) => {

    const onChangePicture = e => {
        if (e.target.files[0]) {
            console.log("picture: ", e.target.files);
            setPicture(e.target.files[0]);
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setImgData(reader.result);
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <input
            id="file-upload"
            type="file"
            accept=".png,.jpeg,.jpg"
            onChange={onChangePicture}
        />
    )
}

export default UploadImg