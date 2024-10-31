import User from "../models/user.model";
import { hashedPassword } from "../utils/hasPasswprd";
import { comparePasswords } from "../utils/passwordCompare";
import jwt from "jsonwebtoken";
export const createUser = async() => {
    try {
        const userData:any = {
            username:process.env.USER_NAME,
            role:process.env.ROLE,
            password: await hashedPassword(`${process.env.PASSWORD}`)
        };
        const existingUser = await User.findOne({ username: userData.username });
        if (existingUser) {
            throw new Error(`User ${userData.username} already exists`);
        }
        return await User.create(userData);
    } catch (err) {
        if(err instanceof Error){
            throw new Error(err.message);
        }
    }
};
const secret = process.env.JWT_SECRET || 'try_me_to_day'

export const Login = async (loginData:any) => {
    try {
        const user = await User.findOne({ username:loginData.username });
        if (!user) {
            throw new Error('User not found'); 
        }
        const isMatch = await comparePasswords(loginData.password, user?.password);
        if (!isMatch) {
            throw new Error('Invalid credentials!'); 
        }
        const token = jwt.sign({ username: user.username, role: user.role }, secret, { expiresIn: '72h' });
        return  token;
    } catch (err) {
        if (err instanceof Error) {
            throw new Error(err.message);
        } else {
            throw new Error('An unexpected error occurred');
        }
    }
};