import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateInvoice = (order, filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Header - Store Logo/Name
      doc
        .fillColor('#10b981')
        .fontSize(25)
        .text('FreshCart', 50, 45)
        .fillColor('#444444')
        .fontSize(10)
        .text('Premium Grocery Store', 50, 75)
        .text('123 Green Valley, Chennai', 50, 90)
        .text('GSTIN: 33AAAAA0000A1Z5', 50, 105)
        .moveDown();

      // Invoice Details
      doc
        .fillColor('#000000')
        .fontSize(20)
        .text('INVOICE', 50, 160, { align: 'right' });

      doc
        .fontSize(10)
        .text(`Invoice Number: INV-${order._id.toString().slice(-6)}`, 50, 185, { align: 'right' })
        .text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`, 50, 200, { align: 'right' })
        .moveDown();

      // Horizontal Line
      doc.moveTo(50, 220).lineTo(550, 220).stroke();

      // Billing Details
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Bill To:', 50, 240)
        .font('Helvetica')
        .fontSize(10)
        .text(order.shippingAddress.fullName || 'Customer', 50, 260)
        .text(order.shippingAddress.address, 50, 275)
        .text(`${order.shippingAddress.city} - ${order.shippingAddress.pincode}`, 50, 290)
        .text(`Phone: ${order.shippingAddress.mobileNumber}`, 50, 305);

      // Table Header
      const tableTop = 350;
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Item', 50, tableTop)
        .text('Quantity', 250, tableTop, { width: 90, align: 'right' })
        .text('Price', 340, tableTop, { width: 90, align: 'right' })
        .text('Total', 460, tableTop, { width: 90, align: 'right' });

      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

      // Table Body
      let position = tableTop + 30;
      order.orderItems.forEach((item, index) => {
        doc
          .font('Helvetica')
          .fontSize(10)
          .text(item.name, 50, position)
          .text(item.quantity.toString(), 250, position, { width: 90, align: 'right' })
          .text(`$${item.price.toFixed(2)}`, 340, position, { width: 90, align: 'right' })
          .text(`$${(item.price * item.quantity).toFixed(2)}`, 460, position, { width: 90, align: 'right' });

        position += 20;
      });

      // Summary
      const summaryTop = position + 30;
      doc.moveTo(350, summaryTop).lineTo(550, summaryTop).stroke();

      doc
        .fontSize(10)
        .text('Subtotal:', 350, summaryTop + 15)
        .text(`$${(order.totalPrice / 1.05).toFixed(2)}`, 460, summaryTop + 15, { width: 90, align: 'right' })
        .text('GST (5%):', 350, summaryTop + 30)
        .text(`$${(order.totalPrice - (order.totalPrice / 1.05)).toFixed(2)}`, 460, summaryTop + 30, { width: 90, align: 'right' })
        .font('Helvetica-Bold')
        .fontSize(14)
        .text('Grand Total:', 350, summaryTop + 55)
        .text(`$${order.totalPrice.toFixed(2)}`, 460, summaryTop + 55, { width: 90, align: 'right' });

      // Footer
      doc
        .fontSize(10)
        .fillColor('#aaaaaa')
        .text('Thank you for shopping with FreshCart!', 50, 700, { align: 'center', width: 500 });

      doc.end();

      stream.on('finish', () => resolve(filePath));
      stream.on('error', (err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
};
