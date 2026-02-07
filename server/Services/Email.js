import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"AaWAS Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #B59353;">AaWAS Real Estate</h2>
          <div style="font-size: 14px; color: #333;">
            ${htmlContent}
          </div>
          <p style="font-size: 12px; color: #999; margin-top: 20px;">
            This is an automated message, please do not reply.
          </p>
        </div>
      `,
    });
    
    return { success: true };
  } catch (error) {
    console.error("Email Helper Error:", error);
    throw new Error("Failed to send email");
  }
};