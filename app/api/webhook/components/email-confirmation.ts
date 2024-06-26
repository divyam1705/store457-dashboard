import transporter from "@/utils/nodemailer"; // adjust the import path accordingly
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
interface emailConfirmationInputs {
  orderId: string;
  email: string;
  name: string;
  amount: string;
}
export async function emailConfirmation({
  orderId,
  email,
  name,
  amount,
}: emailConfirmationInputs) {
  const orderDetails = { orderId, email, name, amount };
  const htmlTemplatePath = path.join(
    process.cwd(),
    "public",
    "template-email.html"
  );
  const logoPath = path.join(process.cwd(), "public", "457.jpg");
  //   const htmlTemplate = fs.readFileSync(__dirname+ '\components\template-email.html', 'utf-8');
  const htmlTemplate = fs.readFileSync(htmlTemplatePath, "utf-8");
  const mailOptions = {
    from: process.env.EMAIL,
    to: orderDetails.email,
    subject: "Order Confirmation",
    html: htmlTemplate
      .replace("{{customerName}}", orderDetails.name)
      .replace("{{orderId}}", orderDetails.orderId)
      .replace("{{amount}}", orderDetails.amount),
    attachments: [
      {
        filename: "457.jpg",
        path: logoPath,
        cid: "logo",
      },
    ],
  };
  // console.log(logoPath);
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
  return "Order completed and email sent";
}
