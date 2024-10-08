import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import {v4 as uuid} from "uuid";
import { v2 as cloudinary} from "cloudinary";
import { getBase64, getSockets } from "../lib/helper.js";

const cookieOptions = {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    httpOnly: true,
    secure: true,
}

const connectDB = (uri) => {
    mongoose.connect(uri, { dbName: "chatApp"})
    .then((data) => {
        console.log(`Connected to database: ${data.connection.host}`);
    })
    .catch((err) => {throw err;});
}

const sendToken = (res, user, code, message) =>{

    const token = user.getJWTToken();

    return res.status(code).cookie("chatapp-token", token, cookieOptions).json({
        success: true,
        token,
        message,
        user,
})
};

const emitEvent = ( req, event, users, data ) => {
    let io = req.app.get("io");
    const usersSocket = getSockets(users);
    io.to(usersSocket).emit(event, data);
};

const uploadFilesToCloudinary = async (files=[]) =>{
    const uploadPromises = files.map((file) =>{
        return new Promise((resolve, reject) =>{
            cloudinary.uploader.upload(getBase64(file), {
                resource_type: "auto",
                public_id: uuid(),
            },(err, result) => {
                if(err) return reject(err);
                resolve(result);
            });
        })
    });
    try {
        const results = await Promise.all(uploadPromises);

        const formattedResults = results.map((result) => ({
            public_id: result.public_id,
            url: result.secure_url,
        }));
        return formattedResults;
    } catch (error) {
        throw new Error("Error uploading files to cloudinary", error)
    }
}

const delteFilesFromCloudinary = async (public_ids) => {};

export  {connectDB, sendToken, cookieOptions, emitEvent, delteFilesFromCloudinary, uploadFilesToCloudinary};