import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectRoute from "./components/auth/ProtectRoute";
import {LayoutLoader} from "./components/layout/Loaders";
import axios from "axios";
import { server } from "./constants/config";
import { useDispatch, useSelector } from "react-redux";
import { userExists, userNotExists } from "./redux/reducers/auth";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "./socket";
import Profile from "./components/specific/Profile";



const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const ChatMangement = lazy(() => import("./pages/admin/ChatMangement"));
const MessageManagement = lazy(() => import("./pages/admin/MessageManagement"));

function App() {

  const { user, loader } = useSelector(state => state.auth)

  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then(({ data }) => dispatch(userExists(data.user)))
      .catch((err) => dispatch(userNotExists()));
  }, [dispatch]);

  return loader? <LayoutLoader/> : (
    <>
      <BrowserRouter>
        <Suspense
          fallback={
            <div>
              <LayoutLoader />
            </div>
          }
        >
          <Routes>
            <Route element={<SocketProvider>
                <ProtectRoute user={user} />
            </SocketProvider>}>
              <Route path="/" element={<Home />} />
              <Route path="/chat/:chatId" element={<Chat />} />
              <Route path="/groups" element={<Groups />} title="ConvocCube - Groups" />
              <Route path="/profile" element={<Profile user={user}/>} title="ConvoCube - Profile" />
            </Route>
            <Route
              path="/login"
              title="ConvoCube-Login"
              element={
                <ProtectRoute user={!user} redirect="/">
                  <Login />
                </ProtectRoute>
              }
            />

            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/chats" element={<ChatMangement />} />
            <Route path="/admin/messages" element={<MessageManagement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>

        <Toaster position="top-right" />
      </BrowserRouter>
    </>
  );
}

export default App;
