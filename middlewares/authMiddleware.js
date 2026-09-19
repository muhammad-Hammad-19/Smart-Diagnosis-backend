import jwt from "jsonwebtoken";
import donenv from "dotenv";
donenv.config();

export const verifyToken = (req, res, next) => {
  // 1. Get the token from the Authorization header
  const authHeader = req.headers["authorization"];

  // The header format is usually: "Bearer <TOKEN>"
  const token = authHeader && authHeader.split(" ")[1];

  // 2. Check if the token exists
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // 3. Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "12345");

    // 4. Attach the decoded payload (e.g., user id/role) to the request object
    req.user = decoded;

    // 5. Pass control to the next middleware or route handler
    next();
  } catch (error) {
    // If verification fails (expired or tampered token)
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Ensure verifyToken ran first and populated req.user
    
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    // Check if the user's role is permitted
    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions." });
    }

    next();
  };
};
