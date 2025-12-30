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

    budgets: [
      
      {
        category: { type: String, required: true },
        limit: { type: Number, required: true },
        period: { type: String, enum: ['weekly', 'monthly', 'yearly', 'custom'], default: 'monthly' },
        startDate: { type: Date, default: Date.now },
        endDate: { type: Date },
        isActive: { type: Boolean, default: true },
      },

    ],

    Transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
    preferences: {
      currency: {
        type: String,
        default: 'NGN'
      },
    },
    // For password reset
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);




const User = mongoose.model("User", userSchema);

export default User;
