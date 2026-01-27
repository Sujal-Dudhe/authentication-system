import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplates.js";
import { client as mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const toEmail = process.env.NODE_ENV === "development" && process.env.MAILTRAP_OWNER_EMAIL ? process.env.MAILTRAP_OWNER_EMAIL : email;
  const recipient = [{ email: toEmail }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken,
      ),
      category: "Email Verification",
    });

    console.log("Verification Email sent successfully", response);
  } catch (error) {
    console.error(`Error sending verification email:`, error);

    // Do not throw — email failures in dev (Mailtrap demo) should not block signup
    return null;
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const toEmail = process.env.NODE_ENV === "development" && process.env.MAILTRAP_OWNER_EMAIL ? process.env.MAILTRAP_OWNER_EMAIL : email;
  const recipient = [{ email: toEmail }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "1fd84c38-c686-4932-8b90-a9ae058feba2",
      template_variables: {
        company_info_name: "Auth Company",
        name: name,
      },
    });

    console.log("Welcome Email sent successfully", response);
  } catch (error) {
    console.error("Error sending welcome email", error);
    return null;
  }
};

export const sendResetPasswordEmail = async (email, resetURL) => {
  const toEmail = process.env.NODE_ENV === "development" && process.env.MAILTRAP_OWNER_EMAIL ? process.env.MAILTRAP_OWNER_EMAIL : email;
  const recipient = [{ email: toEmail }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(
        "{resetURL}",
        resetURL,
      ),
      category: "Password Reset",
    });

    console.log("Reset Password Email sent successfully", response);

  } catch (error) {
    console.error("Error sending reset password email", error);
    return null;
  }
};

export const sendResetPasswordSuccessEmail = async (email) => {
  const toEmail = process.env.NODE_ENV === "development" && process.env.MAILTRAP_OWNER_EMAIL ? process.env.MAILTRAP_OWNER_EMAIL : email;
  const recipient = [{ email: toEmail }];
  
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });

    console.log("Password Reset Success Email sent successfully", response);

  } catch (error) {
    console.error("Error sending reset password success email", error);
    return null;
  }
};