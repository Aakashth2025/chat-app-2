import UserModel from "../models/user.model.js";
import { genToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    //    res.send("signup route");
    const { fullName, email, password } = req.body;
    try {
        if (!email || !password || !fullName) {
            return res.status(400).json({
                message: "All fields required."
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be of atleast 6 characters"
            });
        }
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }
        //hash the password
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password, salt);
        const newUser = new UserModel({
            fullName: fullName,
            email: email,
            password: hashPass
        });

        if (!newUser) {
            res.status(400).json({
                message: "Invalid user data"
            });
        }
        else {
            genToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            });
        }
    }
    catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }
        const isPassCorrect = await bcrypt.compare(password, user.password);
        if (!isPassCorrect) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }
        genToken(user._id, res);
        //console.log("Logged in succefully");
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });
    }
    catch (error) {
        console.log("Error in login controller: ", error.message);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const logout = (req, res) => {
    try{
        res.cookie("jwt", "", { //just clear the cookies
            maxAge:0
        });
        res.status(200).json({
            message: "Logges out succesfully"
        });
    }
    catch(error){
        console.log("Error in logout controller", error.message);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const updateProfile = (req, res)=>{
    
}