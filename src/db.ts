import mongoose,{model,Schema} from "mongoose";
import { connection } from "./config";

mongoose.connect(connection);

const UserSchema = new Schema({
    username: {type:String , unique: true},
    password: String
})

export const UserModel = model("users",UserSchema);