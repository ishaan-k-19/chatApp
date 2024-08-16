import { TryCatch } from "../middlewares/error.js";
import User from "../models/user.js";
import { compare } from "bcrypt";
import { cookieOptions, emitEvent, sendToken, uploadFilesToCloudinary } from "../utils/features.js";
import { ErrorHandler } from "../utils/utitlity.js";
import Request from "../models/request.js";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";
import Chat from "../models/chat.js";
import { getOtherMembers } from "../lib/helper.js";

// Create a new user and save it to the database and save in cookie
const newUser = TryCatch(async (req, res, next) => {

    const { name, username, password, bio } = req.body;

    const file = req.file;

    if(!file) return next(new ErrorHandler("Please upload your picture"))


    const result = await uploadFilesToCloudinary([file]);

    const avatar = {
        public_id: result[0].public_id,
        url: result[0].url,
    }

    const user = await User.create({
        name,
        bio,
        username: username.toLowerCase(),
        password,
        avatar,
    })

    sendToken(res, user, 201, "User created successfully");
});


const login = TryCatch(async (req, res, next) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select("+password");

    if (!user) return next(new ErrorHandler("Invalid Username or Password", 404));

    const isMatch = await compare(password, user.password);

    if (!isMatch) return next(new ErrorHandler("Invalid Username or Password", 404));

    sendToken(res, user, 200, `Welcome Back, ${user.name}`);
}
);

const getMyProfile = TryCatch(async (req, res, next) => {

    
    const user = await User.findById(req.user);

    if (!user) return next(new ErrorHandler("User not found", 404));

    res.status(200).json({
        success: true,
        user,
    })

}
);

const editMyProfile = TryCatch(async (req, res, next) => {
    const userId = req.user.toString();


    const {name, bio, username} = req.body;
    const file = req.file;

    const user = await User.findById(userId);

    if(!user) return next(new ErrorHandler("User not found", 404));


    if(user._id.toString()!== req.user.toString()) return next( new ErrorHandler("You are not authorized to edit this profle.", 403))

    const existingUser = await User.find({username: username.toLowerCase()});
    if (existingUser.length !== 0 && existingUser[0].username !== user.username) {
        return next (
            new ErrorHandler('This username is already taken, Please try different username', 400)
        )
    }

    if(file){
        const result = await uploadFilesToCloudinary([file]);

    const updatedAvatar = {
        public_id: result[0].public_id,
        url: result[0].url,
    }


    user.avatar = updatedAvatar;

    }
    
    user.name = name;
    user.bio = bio;
    user.username = username.toLowerCase();


    await user.save();

    return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user,
    })


})

const logout = TryCatch(async (req, res) => {

    res.status(200).cookie("chatapp-token", "", { ...cookieOptions, maxAge: 0 }).json
        ({
            success: true,
            message: "Logged out successfully",
        })

}
);



const searchUser = TryCatch(async (req, res) => {

    const { name } = req.query;

    const myChats = await Chat.find({ groupChat: false, members: req.user });

    const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);

    const allUsersExceptMeAndFriends = await User.find({
        _id: { $nin: allUsersFromMyChats },
        name: { $regex: name, $options: "i" },

    });

    const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
        _id,
        name,
        avatar: avatar.url,
    }));

    res.status(200).json
        ({
            success: true,
            message: name,
            users,
        })

}
);

const sendFriendRequest = TryCatch(async (req, res, next) => {
    const {userId} = req.body;
    
    const request = await Request.findOne({
        $or: [
            { sender: req.user, reciver: userId },
            { sender: userId, reciver: req.user },
        ],
    });
    
    if (request) {return next(new ErrorHandler("Friend request already sent", 400))}

    await Request.create({
        sender: req.user,
        reciver: userId,
    });
    emitEvent(req, NEW_REQUEST, [userId]);
    
    return res.status(200).json({
        success: true,
        message: "Friend request sent successfully",
    })
});

const acceptFriendRequest = TryCatch(async (req, res, next) => {
    const { requestId, accept } = req.body;

    const request = await Request.findById(requestId)
        .populate("sender", "name")
        .populate("reciver", "name");

    if (!request) return next(new ErrorHandler("Request not found", 404));

    if (request.reciver._id.toString() !== req.user.toString()) return next(new ErrorHandler("You are not authorized to accept this request", 401));

    if (!accept) {
        await request.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Friend request rejected",
        });
    }

    const members = [request.sender._id, request.reciver._id];

    await Promise.all([
        Chat.create({
            members,
            name: `${request.sender.name} - ${request.reciver.name}`,
        }),
        request.deleteOne(),
    ]);


    emitEvent(req, REFETCH_CHATS, members);

    return res.status(200).json({
        success: true,
        message: "Friend request accepted",
        senderId: request.sender._id,
    })
});

const getMyNotifications = TryCatch(async (req, res) => {
    const requests = await Request.find({ reciver: req.user }).populate(
        "sender", 
        "name avatar"
    );

    const allRequests = requests.map(({_id, sender}) => ({
        _id, 
        sender:{
            _id: sender._id,
            name: sender.name,
            avatar: sender.avatar.url,
        },
    }));

    return res.status(200).json({
        success: true,
        allRequests,
    })
});

const getMyFriends = TryCatch(async (req, res) => {
    const chatId = req.query.chatId;
    const chats = await Chat.find({
        members: req.user,
        groupChat: false,
    }).populate("members", "name avatar");


    const friends = chats.map(({ members }) =>{
        const otherUser = getOtherMembers(members, req.user);

        return {
            _id: otherUser._id,
            name: otherUser.name,
            avatar: otherUser.avatar.url,
        };
    });

    if(chatId){

        const chat = await Chat.findById(chatId);

        const availableFriends = friends.filter(
            (friend) =>!chat.members.includes(friend._id)
        );

        return res.status(200).json({
            success: true,
            friends: availableFriends,
        })

    }else{
        return res.status(200).json({
            success: true,
            friends,
        })
    }

});



export { login, newUser, getMyProfile, logout, searchUser, sendFriendRequest, acceptFriendRequest, getMyNotifications, getMyFriends, editMyProfile };