import mongoose from "mongoose";
const userSchema= new mongoose.Schema({
    name: {type: String, require: true},
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    verifyOtp: {type: String, default: ''}, //this store user varification OTP
    verifyOtpExpireAt: {type: Number, default: 0}, //this store the expire time of the user varification OTP
    isAccountVerified: {type: Boolean, default: false}, //this store is the user varified or not
    resetOtp: {type: String, default: ''}, //this store the password reset OTP
    resetOtpExpireAt: {type: Number, default: 0} //this store the expire time of the password reset OTP 
});

const userModel= mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;