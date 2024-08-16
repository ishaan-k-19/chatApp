import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { newGroupChat, getMyChats, getMyGroups, addMembers, removeMembers, leaveGroup, sendAttachments, getChatDetails, renameGroup, deleteChat, getMessages, getGroupDetails } from '../controllers/chat.js';
import { addMembersValidator, chtIdValidator, leaveGroupValidator, newGroupValidator, removeMemberValidator, renameGroupValidator, sendAttachmentsValidator, validateHandler } from '../lib/validators.js';
import { attachmentMulter, singleAvatar } from '../middlewares/multer.js';

const app = express.Router();

// After loggedin

app.use(isAuthenticated)

app.post("/new", singleAvatar, validateHandler, newGroupChat);

app.get("/my", getMyChats);

app.get("/my/groups", getMyGroups);

app.put("/addmembers", addMembersValidator(), validateHandler, addMembers);

app.put("/removemember", removeMemberValidator(), validateHandler, removeMembers);

app.delete("/leave/:id", leaveGroupValidator(), validateHandler, leaveGroup)

app.post("/message", attachmentMulter, sendAttachmentsValidator(), validateHandler, sendAttachments);

app.get("/message/:id", chtIdValidator(), validateHandler, getMessages);

app.route("/:id")
.get( chtIdValidator(), validateHandler, getChatDetails)
.put(singleAvatar, renameGroupValidator(), validateHandler, renameGroup)
.delete( chtIdValidator(), validateHandler, deleteChat );

app.route("/group/:id").get( chtIdValidator(), validateHandler, getGroupDetails)





export default app;