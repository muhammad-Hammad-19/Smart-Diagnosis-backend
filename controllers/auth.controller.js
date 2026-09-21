import { registerUser, loginUser } from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    const { token, user } = await registerUser({ name, email, password, role });

    return res
      .status(201)
      .json({ message: "User registered successfully", token, user });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const { token, user } = await loginUser({ email, password });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Server error" });
  }
};
