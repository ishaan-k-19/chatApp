import mongoose ,{Schema, model, Types} from "mongoose";

const schema = new Schema({

    status : {
        type: String,
        default: "pending",
        enum: ["pending", "accepted", "rejected"],
    },

    sender:{
        type: Types.ObjectId,
        ref:"User",
        required: true,
    },
    reciver:{
        type: Types.ObjectId,
        ref:"User",
        required: true,
    },

},{
    timestamps: true,
});


const Request = mongoose.models.Request ||  model("Request", schema);
export default Request;