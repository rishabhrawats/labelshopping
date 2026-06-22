import nodemailer from "nodemailer";

const isEmailConfigured = Boolean(
  process.env.EMAIL_SERVER_HOST &&
  process.env.EMAIL_SERVER_PORT &&
  process.env.EMAIL_SERVER_USER &&
  process.env.EMAIL_SERVER_PASSWORD &&
  process.env.EMAIL_FROM
);

const transporter = isEmailConfigured
  ? nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT || 587),
      secure: false,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD
      }
    })
  : null;

export async function sendOrderEmail(to: string, orderId: string, total: number) {
  if (!to || !transporter) return;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: `Your Label Saumya order ${orderId}`,
      html: `<p>Thank you for shopping with Label Saumya.</p><p>Order ID: <strong>${orderId}</strong></p><p>Total: INR ${total.toFixed(2)}</p>`
    });
  } catch (error) {
    console.error("Order email failed", error);
  }
}
