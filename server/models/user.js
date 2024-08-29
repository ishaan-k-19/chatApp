import mongoose, {Schema, model} from "mongoose";
import {hash} from "bcrypt";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    bio: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        }
    },
    verified: {
        type: Boolean,
        default: false,
    },

    otp: Number,
    otp_expiry: Date,
    resetPasswordOtp: Number,
    resetPasswordOtp_expiry: Date,
}, {
    timestamps: true,
});

schema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await hash(this.password, 10);
});

schema.methods.getJWTToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
      expiresIn: 15 * 24 * 60 * 60 * 1000,
    });
};
  
schema.methods.comparePassword = async function (password) {
return await bcrypt.compare(password, this.password);
};

schema.index({ otp_expiry: 1 }, { expireAfterSeconds: 0 });

const User = mongoose.models.User || model("User", schema);
export default User;
