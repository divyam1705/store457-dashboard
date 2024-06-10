// pages/api/completeOrder.ts
import { NextResponse } from "next/server";
import transporter from "@/utils/nodemailer"; // adjust the import path accordingly

export async function POST(req: Request) {
  // Assuming you have a function to process the order and get the order details
  //   const orderDetails = await processOrder(req.body);
  const body = await req.json();
  const  orderDetails  = body;
  //   {orderId,amount,description,email}
  // Send email
  const mailOptions = {
    from: process.env.EMAIL,
    to: orderDetails.email, // customer's email
    subject: "Order Confirmation",
    html: `
      <h1>Order Confirmation</h1>
      <p>Thank you for your order. Here are your order details:</p>
      <ul>
        <li>Order ID: ${orderDetails.orderId}</li>
        <li>Amount: ${orderDetails.amount}</li>
        <li>Description: ${orderDetails.description}</li>
      </ul>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
  return NextResponse.json({ message: "Order completed and email sent" });
}

