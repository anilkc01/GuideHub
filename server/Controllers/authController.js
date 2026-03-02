import User from "../Models/User.js";
import Guide from "../Models/Guide.js";
import bcrypt from "bcrypt";
import { generateToken } from "../Security/jwt-utils.js";
import { sendEmail } from "../Services/Email.js";
import OTP from "../Models/Otp.js";


export const registerUser = async (req, res) => {
  try {
    const { fullName, email, phone, password, dob, address, role } = req.body;

    if (!fullName || !email || !phone || !password || !dob || !address) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      dob,
      address,
      role: role, 
    });

    res.status(201).json({ 
      message: "User registered successfully.", 
      user: { id: newUser.id, email: newUser.email } 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const registerGuide = async (req, res) => {
  try {
    const { userId, licenseNo } = req.body;
    const files = req.files;

    if (!files.licenseImage || !files.citizenshipImage || !files.dpImage) {
      return res.status(400).json({ message: "All three images (License, Citizenship, and DP) are required." });
    }

    await User.update(
      { dp: files.dpImage[0].path },
      { where: { id: userId } }
    );

    await Guide.create({
      userId,
      licenseNo,
      licenseImg: files.licenseImage[0].path,
      citizenshipImg: files.citizenshipImage[0].path,
      status: "pending" 
    });

    res.status(200).json({ message: "Guide documents uploaded successfully" });
  } catch (error) {
    res.status(500).json({ message: "File upload failed", error: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ 
      where: { email },
      attributes: ['id', 'fullName', 'dp', 'status']
    });

    if (!user) {
      return res.status(404).json({ message: "No account found with this email." });
    }

    if (user.status === "suspended") {
      return res.status(403).json({ message: "This account has been suspended." });
    }

    if (user.status === "deactivated") {
      return res.status(404).json({ message: "No account found with this email." });
    }

    
    res.status(200).json({
      message: "Email verified.",
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const verifyPassword = async (req, res) => {
  try {
    const { email, password, remember } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Authentication failed." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    
    const token = generateToken({ id: user.id }, remember);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        role: user.role,
        dp: user.dp,
        status: user.status,
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const verifyToken = (req, res) => {
  res.status(200).json({
    
    user: {
      id: req.user.id,
      fullName: req.user.fullName,
      role: req.user.role,
      dp: req.user.dp,
      status: req.user.status
    },
  });
};

export const getMe = async (req, res) => {
  try {
    // req.user.id comes from your 'protect' middleware
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] } // Security: never send password back
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findByPk(req.user.id);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    await user.destroy();
    res.status(200).json({ message: "Account deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
   
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.destroy({ where: { email } });
    await OTP.create({
      email,
      otp: otpCode,
      expiresAt,
    });

    await sendEmail(
      email,
      "Verification Code",
      `
      <div style="font-family: sans-serif; max-width: 400px; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #333;">Verify Your Email</h2>
        <p>Use the following code to complete your registration:</p>
        <div style="background: #f4f4f4; padding: 15px; text-align: center; border-radius: 8px;">
          <b style="font-size: 24px; color: #B59353; letter-spacing: 5px;">${otpCode}</b>
        </div>
        <p style="font-size: 12px; color: #888; margin-top: 20px;">
          This code expires in 5 minutes. If you did not request this, please ignore this email.
        </p>
      </div>
      `
    );

    return res.status(200).json({ message: "OTP sent successfully" });

  } catch (error) {
    console.error("OTP Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const record = await OTP.findOne({ where: { email, otp } });

    if (!record) {
      return res.status(400).json({ message: "Invalid OTP code" });
    }

    if (new Date() > record.expiresAt) {
      await record.destroy(); // Optional cleanup
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Success - clean up the OTP record so it can't be reused
    await record.destroy();

    return res.status(200).json({ message: "OTP verified" });
  } catch (error) {
    return res.status(500).json({ message: "Verification failed" });
  }
};

export const deactiveAccount = async (req, res) => {
  const { password } = req.body;
  const user = await User.findByPk(req.user.id);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

  user.status = "deactivated";
  await user.save();
  res.json({ message: "Account deactivated" });
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
