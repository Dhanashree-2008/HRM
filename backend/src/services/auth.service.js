import { User, Employee } from "../models/index.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { signToken, verifyToken } from "../utils/jwt.js";
import { sendEmail } from "./emailService.js";

export const loginService = async (email, password) => {
  const user = await User.findOne({
    where: { email, isActive: true },
    include: [
      {
        model: Employee,
        as: "employeeProfile",
      },
    ],
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // 🔥 IMPORTANT — include employeeId in JWT payload
  const tokenPayload = {
    id: user.id,
    role: user.role,
    employeeId: user.employeeProfile ? user.employeeProfile.id : null,
  };

  const token = signToken(tokenPayload);

  // Generate username from email if not set
  const username = user.username || user.email.split("@")[0];

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      username: username,
      role: user.role,
      employee: user.employeeProfile
        ? {
          id: user.employeeProfile.id,
          fullName: user.employeeProfile.fullName,
          employeeCode: user.employeeProfile.employeeCode,
          department: user.employeeProfile.department,
          designation: user.employeeProfile.designation,
          phone: user.employeeProfile.phone,
          location: user.employeeProfile.location,
          status: user.employeeProfile.status,
          profileImage: user.employeeProfile.profileImage,
        }
        : null,
    },
  };
};

export const forgotPasswordService = async (email) => {
  const user = await User.findOne({
    where: { email },
    include: [{ model: Employee, as: "employeeProfile" }]
  });

  if (!user) {
    console.log(`[Forgot Password] Email not found: ${email}`);
    // Return success message to avoid enumeration
    return { message: "If your email is registered, you will receive a reset link." };
  }

  // Determine target email
  const targetEmail = user.employeeProfile?.personalEmail || user.email;

  // Generate a stateless reset token valid for 1 hour
  // Encrypt user ID into the token so we know who it is later
  const resetToken = signToken({ id: user.id, type: 'reset' }, '1h');

  const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #7C3AED;">LiteHR Password Reset</h2>
      <p>Hello ${user.username || 'User'},</p>
      <p>You requested a password reset.</p>
      <p>Click the button below to proceed (link expires in 1 hour):</p>
      <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #7C3AED; color: #fff; text-decoration: none; border-radius: 5px; margin: 15px 0;">Reset Password</a>
      <p>This link was sent to <strong>${targetEmail}</strong> as it is your registered personal contact.</p>
    </div>
  `;

  await sendEmail(targetEmail, "Reset Your Password - LiteHR", emailHtml);

  return { message: `Password reset link sent to your email (${targetEmail}).` };
};

export const resetPasswordService = async (token, newPassword) => {
  // 1. Verify the token
  const decoded = verifyToken(token);

  if (!decoded || decoded.type !== 'reset') {
    throw new Error("Invalid or expired reset token.");
  }

  // 2. Find the user
  const user = await User.findByPk(decoded.id);
  if (!user) {
    throw new Error("User not found.");
  }

  // 3. Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // 4. Update user password
  user.passwordHash = hashedPassword;
  await user.save();

  return { message: "Password has been successfully updated." };
};
