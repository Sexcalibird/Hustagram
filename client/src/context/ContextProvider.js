import {createContext, useState} from "react";
import { io } from "socket.io-client";

const CreateContext = createContext({})

export const ContextProvider =({children}) => {
    const [toggleCreate, setToggleCreate] = useState(false)
    const [id, setId] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const socket = io("https://hustagram-socket.onrender.com")
    return (
        <CreateContext.Provider
            value={{
                toggleCreate, setToggleCreate,
                id, setId,
                modalOpen, setModalOpen,
                socket,
            }}
        >
            {children}
        </CreateContext.Provider>
    )
}

export default CreateContext
