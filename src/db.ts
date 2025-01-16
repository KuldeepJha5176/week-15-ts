import mongoose,{model,Schema} from "mongoose";
import { connection } from "./config";

mongoose.connect(connection);

const UserSchema = new Schema({
    username: {type:String , unique: true},
    password: String
})

export const UserModel = model("users",UserSchema);

const ContentSchema = new Schema({
    tittle: String,
    link: String,
    type: String,
    tags:[{type: mongoose.Types.ObjectId, ref: 'Tag'}] ,
    userId: {type: mongoose.Types.ObjectId, ref: 'users',required: true},
    authorId: {type: mongoose.Types.ObjectId, ref: 'users'}
})
const linkSchema = new Schema({
    hash: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'users',required: true, unique: true},

})
export const ContentModel = model("content",ContentSchema);//name of model then SCHEMA OF THE MODEL


export const LinkModel = model("Links",linkSchema);