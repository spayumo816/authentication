import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";

const client = SibApiV3Sdk.ApiClient.instance;

dotenv.config();
// configure API key
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendOTPEmail = async (to, subject, otp) => {
  try {
    const sender = {
      email: process.env.BREVO_SENDER_EMAIL,
      name: "Garbage Pickup App",
    };

    const receivers = [
      {
        email: to,
      },
    ];

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>${subject}</h2>
        <p>Your OTP code is:</p>
        <h1 style="letter-spacing: 4px;">${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `;

    await emailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject,
      htmlContent,
    });
  } catch (error) {
    console.error("Brevo email error:", error?.response?.body || error.message);
    throw new Error("Failed to send OTP email");
  }
};