import User from "../Models/User.js";
import Guide from "../Models/Guide.js";
import bcrypt from "bcrypt";
import { generateToken } from "../Security/jwt-utils.js";


export const registerUser = async (req, res) => {
  try {
    const { fullName, email, phone, password, dob } = req.body;

    if (!fullName || !email || !phone || !password || !dob) {
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
      role: "trekker", 
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
    
    const { licenseNo, licenseImg, citizenshipImg } = req.body;
    const userId = req.user.id; 

    
    if (!licenseNo || !licenseImg || !citizenshipImg) {
      return res.status(400).json({ 
        message: "Missing required documents." 
      });
    }

    const existingGuide = await Guide.findOne({ where: { userId } });
    if (existingGuide) {
      return res.status(400).json({ message: "You have already applied for or hold a guide profile." });
    }

    const duplicateLicense = await Guide.findOne({ where: { licenseNo } });
    if (duplicateLicense) {
      return res.status(400).json({ message: "This license number is already registered in our system." });
    }

    const newGuide = await Guide.create({
      userId,
      licenseNo,
      licenseImg,
      citizenshipImg,
      totalTreks: 0,
      status: "pending"
    });

    await User.update({ role: "guide" }, { where: { id: userId } });

    res.status(201).json({
      message: "Registration successful. Your guide application is under review.",
    });

  } catch (error) {
    res.status(500).json({ 
      message: "An error occurred during guide registration.", 
      error: error.message 
    });
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
    const { email, password } = req.body;

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
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const verifyToken = (req, res) => {
  res.status(200).json({
    valid: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,      
      status: req.user.status, 
    },
  });
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