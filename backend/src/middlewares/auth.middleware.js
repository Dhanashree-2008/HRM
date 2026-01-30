import { verifyToken } from "../utils/jwt.js";
import { Employee } from "../models/index.js";

export const authMiddleware = async (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // { id, role, employeeId (maybe) }

    // If employeeId is missing (stale token), fetch it from DB
    if (!req.user.employeeId && req.user.id) {
      try {

        const emp = await Employee.findOne({ where: { userId: req.user.id } });

        if (emp) {
          req.user.employeeId = emp.id;
        } else if (req.user.role !== "ADMIN") {
          console.log("AuthMiddleware: Employee not found for userId:", req.user.id);
        }
      } catch (dbErr) {
        console.error("Error fetching employee details in auth middleware:", dbErr);
      }
    }

    next();
  } catch (err) {
    console.error("JWT verify error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
export const authenticate = authMiddleware;

export const authorize = (roles = []) => {
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!roles.length) {
      return next();
    }

    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};
