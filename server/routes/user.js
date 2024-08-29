import express from 'express';
import { acceptFriendRequest, editMyProfile, forgetPassword, getMyFriends, getMyNotifications, getMyProfile, login, logout, newUser, resetPassword, searchUser, sendFriendRequest, updatePassword, verify } from '../controllers/user.js';
import { multerUpload, singleAvatar } from '../middlewares/multer.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { acceptRequestValidator, loginValidator, registerValidator, sendRequestValidator, updatePasswordValidator, updateProfileValidator, validateHandler } from '../lib/validators.js';


const app = express.Router();

app.post("/new", singleAvatar, registerValidator(), validateHandler, newUser)
app.post("/login", loginValidator(), validateHandler, login)
app.post("/forgetpassword", forgetPassword)
app.put("/resetpassword", resetPassword)

// After loggedin

app.use(isAuthenticated)

app.post("/verify", verify)

app.get("/me", getMyProfile)

app.put("/me/editprofile", singleAvatar, updateProfileValidator(), validateHandler, editMyProfile)
app.put("/me/updatepassword", updatePasswordValidator(), validateHandler, updatePassword)

app.get("/logout", logout)

app.get("/search", searchUser)

app.put("/sendrequest", sendRequestValidator(), validateHandler, sendFriendRequest)

app.put("/acceptrequest", acceptRequestValidator(), validateHandler, acceptFriendRequest)

app.get("/notifications", getMyNotifications)

app.get("/friends", getMyFriends)

export default app;