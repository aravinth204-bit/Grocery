import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = 'whatsapp:+14155238886'; // Twilio Sandbox Number
const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER || 'whatsapp:+918778017989';

const client = twilio(accountSid, authToken);

/**
 * Send WhatsApp notification to admin
 * @param {Object} orderData 
 */
export const sendOrderNotification = async (orderData) => {
  const { customerName, amount, paymentMethod, address, orderId } = orderData;

  const messageBody = `*New Order Received!* 🛍️\n\n` +
    `*Order ID:* #${orderId.toString().slice(-6)}\n` +
    `*Customer:* ${customerName}\n` +
    `*Amount:* $${amount}\n` +
    `*Payment:* ${paymentMethod}\n` +
    `*Address:* ${address}\n\n` +
    `Check admin dashboard for more details.`;

  try {
    const message = await client.messages.create({
      from: fromNumber,
      to: adminNumber,
      body: messageBody
    });
    console.log('WhatsApp Notification Sent Successfully:', message.sid);
    return message;
  } catch (error) {
    console.error('WhatsApp Notification Error Details:', {
      message: error.message,
      code: error.code,
      status: error.status
    });
    return null;
  }
};
