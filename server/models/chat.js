import mongoose ,{Schema, Types, model} from "mongoose";

const schema = new Schema({

    name: {
        type: String,
        required: true,
    },
    groupChat: {
        type: Boolean,
        default: false,
    },
    creator:{
        type: Types.ObjectId,
        ref:"User",
    },
    members: [
        {
            type: Types.ObjectId,
            ref:"User",
        }
    ],
    avatar: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    },
    {
    timestamps: true,
});




const Chat = mongoose.models.Chat ||  model("Chat", schema);

export default Chat;