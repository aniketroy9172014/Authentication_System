import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

export const register= async (req, res)=>{
    // store details from web page in veriabel 
    const {name, email, password}= req.body;

    //check the details are empty or not
    if(!name || !email || !password){
        return res.json({success: false, message: 'Missing Details'})
    }

    try {
        //check for existing user
        const existingUser= await userModel.findOne({email})
        if(existingUser){
            return res.json({ success: false, message:"User already exists" });
        }
        
        //encrypt password by bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
        //create new user
        const user = new userModel({name, email,password:hashedPassword})
        await user.save();

        //generate jwt token
        const token= jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true, //only run in http and https because both have http
            secure: process.env.NODE_ENV === 'production', //if Production environment then security needed(true) but in development env security not needed(false)
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', //strict in development because in development backend and frontend is in same side local host but in Production is is different
            maxAge: 7*24*60*60*1000 //7day expire convert in mili second
        });

        //sending welcome email
        const mailOptions= {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to Auth",
            text: `Hi ${name} your account created with email:- ${email}`
        }
        await transporter.sendMail(mailOptions);

        return res.json({success: true});

    } catch(error) {
        res.json({ success: false, message: error.message})
    }
}


export const login= async(req, res)=> {
    // store details from web page in veriabel 
    const {email, password}= req.body;

    //check the details are empty or not
    if(!email || !password){
        return res.json({success: false, message: "email and password required"})
    }

    try{
        // find user is present or not with the email id
        const user= await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message: "Invalid Email"});
        }

        //check the user password match or not
        const isMatch= await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.json({ success: false, message: "Wrong Password"});
        }

        //generate jwt token (same as register token generate)
        const token= jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true, //only run in http and https because both have http
            secure: process.env.NODE_ENV === 'production', //if Production environment then security needed(true) but in development env security not needed(false)
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', //strict in development because in development backend and frontend is in same side local host but in Production is is different
            maxAge: 7*24*60*60*1000 //7day expire convert in mili second
        });

        return res.json({success: true});

    } catch(error){
        return res.json({ success: false, message: error.message});
    }
}


export const logout= async(req, res)=>{
    try{
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })

        return res.json({success: true, message: "logged out"});

    } catch(error) {
        return res.json({ success: false, message: error.message});
    }
}


//send Verification OTP to the User's Email
export const sendVerifyOtp = async(req, res)=> {
    try {
        const{userId}= req.user; // From userAuth middleware

        const user= await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        } 

        if(user.isAccountVerified){
            return res.json({success: false, message: "Account already verified"})
        }

        const otp= String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt= Date.now()+ 24 * 60 * 60 * 1000;

        await user.save();

        const mailOptions= {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification OTP",
            text: `Hi ${user.name} your OTP is ${otp}. Varify account using this.`
        }
        await transporter.sendMail(mailOptions);
        res.json({success: true, message: `Verification OTP sent on email: ${user.email}`});
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


//Verify user with OTP
export const verifyEmail= async(req, res)=> {
    const { userId } = req.user; // from middleware
    const { otp } = req.body;    // OTP still comes from frontend


    if(!userId || !otp){
        return res.json({ success: false, message: 'Missing Details'});
    }
    try {
        const user= await userModel.findById(userId);

        if(!user){
            return res.json({ success: false, message: 'User not found'});
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.json({ success: false, message: 'Invalid OTP'});
        }

        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({ success: false, message: 'OTP Expired'});
        }

        user.isAccountVerified= true;
        user.verifyOtp= '';
        user.verifyOtpExpireAt= 0;

        await user.save();
        return res.json({ success: true, message: 'Email Verified Successfully'});

    } catch (error) {
        return res.json({ success: false, message: error.message});
    }

}


//Check if user is authenticated
export const isAuthenticated= async (req, res)=> {
    try{
        return res.json({ success: true});
    } catch (error){
        res.json({success: false, message: error.message});
    }
}


//Send Password reset otp
export const sendResetOtp= async(req, res)=> {
    const {email}= req.body;

    if(!email){
        return res.json({success: false, message: 'Email is needed'});
    }

    try{

        const user= await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message: 'User not found'});
        }

        const otp= String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt= Date.now()+ 15 * 60 * 1000;

        await user.save();

        const mailOptions= {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset OTP",
            text: `Hi ${user.name} your Password Reset OTP is ${otp}.`
        }
        await transporter.sendMail(mailOptions);
        res.json({success: true, message: `Password Reset OTP sent on email: ${user.email}`});

    }catch(error) {
        return res.json({success: false, message: error.message});
    }
}


//Reset User Password
export const resetPassword= async(req, res)=> {
    const {email, otp, newPassword}= req.body;

    if(!email || !otp || !newPassword) {
        return res.json({success: false, message: 'Email, OTP, new Password needed'});
    }

    try{

        const user= await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message: "user not found"});
        }

        if(user.resetOtp === "" || user.resetOtp !== otp){
            return res.json({success: false, message: "Invalid OTP"});
        }

        if(user.resetOtpExpireAt < Date.now()){
            return res.json({success: false, message: "OTP Expired"});
        }

        const hashedPassword= await bcrypt.hash(newPassword, 10);

        user.password= hashedPassword;
        user.resetOtp= '';
        user.resetOtpExpireAt= 0;

        await user.save();

        return res.json({success: true, message: "Password Reset Successfully"});

    }catch(error) {
        return res.json({success: false, message: error.message});
    }
}