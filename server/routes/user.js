import express from 'express';
import { acceptFriendRequest, editMyProfile, getMyFriends, getMyNotifications, getMyProfile, login, logout, newUser, searchUser, sendFriendRequest } from '../controllers/user.js';
import { multerUpload, singleAvatar } from '../middlewares/multer.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { acceptRequestValidator, loginValidator, registerValidator, sendRequestValidator, updateProfileValidator, validateHandler } from '../lib/validators.js';


const app = express.Router();

app.post("/new", singleAvatar, registerValidator(), validateHandler, newUser)
app.post("/login", loginValidator(), validateHandler, login)


// After loggedin

app.use(isAuthenticated)

app.get("/me", getMyProfile)

app.put("/me/editprofile", singleAvatar, updateProfileValidator(), validateHandler, editMyProfile)

app.get("/logout", logout)

app.get("/search", searchUser)

app.put("/sendrequest", sendRequestValidator(), validateHandler, sendFriendRequest)

app.put("/acceptrequest", acceptRequestValidator(), validateHandler, acceptFriendRequest)

app.get("/notifications", getMyNotifications)

app.get("/friends", getMyFriends)

export default app;