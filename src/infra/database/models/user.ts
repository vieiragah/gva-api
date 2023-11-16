import { Model, Schema, model } from "mongoose";
import { User as IUser } from "../../../domain";

const UserSchema = new Schema<Pick<IUser, 'name' | 'email' | 'password'>>({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String
}, {timestamps: true})

export const User: Model<IUser> = model<IUser>('user', UserSchema)