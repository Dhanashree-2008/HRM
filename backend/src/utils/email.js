import nodemailer from "nodemailer";

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Basic email sender
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: `"LiteHR" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Send employee credentials email
export const sendEmployeeCredentials = async ({ 
  to, 
  personalEmail, 
  fullName, 
  email, 
  password, 
  employeeCode 
}) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .credentials { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .credential-item { margin: 15px 0; padding: 10px; background: #f5f5f5; border-radius: 5px; }
        .label { font-weight: bold; color: #667eea; }
        .value { color: #333; font-size: 16px; }
        .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to LiteHR!</h1>
        </div>
        <div class="content">
          <p>Dear ${fullName},</p>
          <p>Your employee account has been created successfully. Please find your login credentials below:</p>
          
          <div class="credentials">
            <div class="credential-item">
              <span class="label">Employee Code:</span>
              <div class="value">${employeeCode}</div>
            </div>
            <div class="credential-item">
              <span class="label">Login Email:</span>
              <div class="value">${email}</div>
            </div>
            <div class="credential-item">
              <span class="label">Password:</span>
              <div class="value"><strong>${password}</strong></div>
            </div>
          </div>
          
          <div class="warning">
            <strong>⚠️ Important:</strong> Please change your password after your first login for security purposes.
          </div>
          
          <p>You can now access the LiteHR system using these credentials.</p>
          <p>If you have any questions, please contact your HR department.</p>
          
          <div class="footer">
            <p>This is an automated email from LiteHR System.</p>
            <p>Please do not reply to this email.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
Welcome to LiteHR!

Dear ${fullName},

Your employee account has been created successfully. Please find your login credentials below:

Employee Code: ${employeeCode}
Login Email: ${email}
Password: ${password}

⚠️ Important: Please change your password after your first login for security purposes.

You can now access the LiteHR system using these credentials.

If you have any questions, please contact your HR department.

---
This is an automated email from LiteHR System.
Please do not reply to this email.
  `;

  // Send to personal email if provided
  if (personalEmail) {
    await sendEmail({
      to: personalEmail,
      subject: "Your LiteHR Account Credentials",
      text: textContent,
      html: htmlContent,
    });
  }

  // Also send to company email
  await sendEmail({
    to: email,
    subject: "Your LiteHR Account Credentials",
    text: textContent,
    html: htmlContent,
  });
};
