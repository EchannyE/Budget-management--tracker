import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
  {
    
    name: {
      type: String,
      required: [true,],
      trim: true,
    },
    email: {
      type: String,
      required: [true,],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\d{10,15}$/,],
    },
    password: {
      type: String,
      required: [true,],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, 
    },
    preferences: {
      currency: {
      type: String,
      default: 'NGN'
    },
     
    },
    
    
    
  },
  { timestamps: true }
);




const User = mongoose.model("User", userSchema);

export default User;
