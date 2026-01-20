import bcrypt from "bcryptjs";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail, sendResetPasswordEmail, sendResetPasswordSuccessEmail } from "../mailtrap/emails.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const userAlreadyExists = await User.findOne({ email });

    if (userAlreadyExists) {
      return res.status(400).json({ message: "User already exists!" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    console.log("Generated Verification Token:", verificationToken);

    const user = new User({
      email,
      name,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    await user.save();

    // jwt token
    generateTokenAndSetCookie(res, user._id);

    // send verification email
    try {
      await sendVerificationEmail(user.email, verificationToken);
    } catch (emailError) {
      console.log("Error sending verification email:", emailError);
    }

    return res.status(201).json({
      success: true,
      message: "User created successfully!",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    if (!code) {
       return res.status(400).json({ success: false, message: "Verification code is required" });
    }

    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (emailError) {
      console.log("Error sending welcome email:", emailError);
    }
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in verifyEmail ", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required!" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid credentials!" });
    }

    generateTokenAndSetCookie(res, user._id);
    
    user.lastLogin = new Date();
    await user.save();
    
    res.status(200).json({
      success: true,
      message: "Logged in successfully!",
      user: {
        ...user._doc,
        password: undefined,
      },
    });

  } catch (error) {
    console.log("Error in login controller ", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    // Send reset password email
    await sendResetPasswordEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
    
    return res.status(200).json({ success: true, message: "Reset password email sent successfully" });

  } catch (error) {
    console.log("Error in forgotPassword controller ", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {

  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ resetPasswordToken: token, 
      resetPasswordExpiresAt: { $gt: Date.now() },
     });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
    }

    // update password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetPasswordSuccessEmail(user.email);
    
    return res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.log("Error in resetPassword controller ", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}