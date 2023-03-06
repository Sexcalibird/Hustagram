import {Route, Routes, useLocation} from "react-router-dom";
import {Layout, RequireAuth} from "./components";
import {
    Login,
    Register,
    Admin,
    Missing,
    Home,
    Profile,
    Messages,
    PostDetail,
    SavedPost,
    Settings
} from "./pages";
import ExploreTags from "./pages/explore/ExploreTags";
import Explore from "./pages/explore/Explore";
import Modal from "./components/functions/Modal";
import Management from "./pages/management/Management";
import ManagementEdit from "./pages/management/ManagementEdit";

const ROLES = {
    'User': 1999,
    'Admin': 2108
}

const App = () => {

    const location = useLocation();
    const background = location.state && location.state.background;

    return (

        <>
            <Routes location={background || location}>

                <Route>
                    <Route path="/login" element={<Login />}/>
                    <Route path="/register" element={<Register />}/>
                </Route>

                <Route path="/" element={<Layout />}>
                    <Route element={<RequireAuth allowedRoles={[ROLES.User]}/>}>
                        <Route path="" element={<Home />}/>
                        <Route path="explore/" element={<Explore/>}/>
                        <Route path="explore/tags/:tag" element={<ExploreTags/>}/>
                        <Route path="direct/inbox" element={<Messages/>}/>
                        <Route path="p/:postId" element={<PostDetail/>}>
                            <Route path="liked_by" element={<Modal />}/>
                        </Route>
                        <Route path=":username" element={<Profile/>}>
                            <Route path="followers" element={<Modal />}/>
                            <Route path="followings" element={<Modal />}/>
                        </Route>
                        <Route path="accounts/edit" element={<Settings/>}/>
                        <Route path="accounts/saved" element={<SavedPost/>}/>

                        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]}/>} >
                            <Route path="admin/statistic" element={<Admin />}/>
                            <Route path="admin/management" element={<Management/>}>
                                <Route path=":id" element={<ManagementEdit/>}/>
                            </Route>
                        </Route>

                    </Route>
                </Route>

                <Route path="*" element={<Missing />} />
            </Routes>

            {background && (
                <Routes>
                    <Route path=":username/followers" element={<Modal />}/>
                    <Route path=":username/followings" element={<Modal />}/>
                    <Route path="p/:postId/liked_by" element={<Modal />}/>
                    <Route path="admin/management/:id" element={<ManagementEdit/>}/>
                </Routes>
            )}
        </>

  )
}

export default App;
