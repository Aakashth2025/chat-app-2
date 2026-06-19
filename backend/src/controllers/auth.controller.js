import UserModel from "../models/user.model.js";
import { genToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

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

export const updateProfile = async (req, res)=>{
    try{
        const {profilePic} =  req.body;
        const userId = req.user._id;    //protectRoute call this function as next(), and also adds user to req, hence we can access req.user
        if(!profilePic){
            return res.status(400).json({
                message: "Profile photo is reuqired"
            });
        }
        const upload_res = await cloudinary.uploader.upload(profilePic);
        const updatedUser = UserModel.findByIdAndUpdate(userId, {
            profilePic: upload_res.secure_url
        }, {new: true});

        res.status(200).json(updatedUser);
    }
    catch(error){
        console.log("Error in update profile", error.message);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const checkAuth = (req, res)=>{
    try{
        res.status(200).json(req.user); //send the authenticated user back
    }
    catch(error){
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}
