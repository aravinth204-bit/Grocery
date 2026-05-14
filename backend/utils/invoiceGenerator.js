import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateInvoice = (order, filePath, settings = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        margin: 50,
        size: 'A4',
        info: {
          Title: `Invoice - ${order._id}`,
          Author: settings?.storeInfo?.name || 'FreshCart'
        }
      });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      const storeName = settings?.storeInfo?.name || 'FreshCart Store';
      const storeAddress = settings?.storeInfo?.address || 'Premium Grocery Lane';
      const storePhone = settings?.storeInfo?.phone || '+91 00000 00000';
      const storeEmail = settings?.storeInfo?.email || 'support@freshcart.com';
      const storeGst = settings?.storeInfo?.gst || '33AAAAA0000A1Z5';

      // --- Header Design ---
      // Primary Color Background for top right
      doc
        .rect(350, 0, 245, 150)
        .fill('#10b981');

      doc
        .fillColor('#ffffff')
        .fontSize(28)
        .font('Helvetica-Bold')
        .text('INVOICE', 380, 50);

      doc
        .fontSize(10)
        .font('Helvetica')
        .text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`, 380, 85)
        .text(`Order ID: #${order._id.toString().slice(-8).toUpperCase()}`, 380, 100);

      // Store Brand Info (Top Left)
      doc
        .fillColor('#10b981')
        .fontSize(24)
        .font('Helvetica-Bold')
        .text(storeName.split(' ')[0], 50, 45)
        .fillColor('#334155')
        .text(storeName.split(' ').slice(1).join(' '), doc.x, 45);

      doc
        .fillColor('#64748b')
        .fontSize(9)
        .font('Helvetica')
        .text('ELITE ORGANIC DELIVERY', 50, 75, { characterSpacing: 1 })
        .moveDown(1.5);

      doc
        .fillColor('#334155')
        .fontSize(9)
        .text(storeAddress, 50, 105)
        .text(`Phone: ${storePhone}`, 50, 120)
        .text(`Email: ${storeEmail}`, 50, 135)
        .text(`GSTIN: ${storeGst}`, 50, 150);

      doc.moveDown(4);

      // --- Billing Details ---
      const billToTop = 220;
      doc
        .rect(50, billToTop, 500, 25)
        .fill('#f8fafc');

      doc
        .fillColor('#64748b')
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('BILL TO', 65, billToTop + 8);

      doc
        .fillColor('#1e293b')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text(order.shippingAddress.fullName || 'Valued Customer', 50, billToTop + 40);

      doc
        .fillColor('#64748b')
        .fontSize(10)
        .font('Helvetica')
        .text(order.shippingAddress.address, 50, billToTop + 58, { width: 250 })
        .text(`${order.shippingAddress.city} - ${order.shippingAddress.pincode}`, 50, doc.y + 2)
        .text(`Mobile: ${order.shippingAddress.mobileNumber}`, 50, doc.y + 2);

      // Payment Method Box
      doc
        .rect(350, billToTop + 40, 200, 60)
        .strokeColor('#e2e8f0')
        .stroke();

      doc
        .fillColor('#64748b')
        .fontSize(8)
        .font('Helvetica-Bold')
        .text('PAYMENT METHOD', 365, billToTop + 52);

      doc
        .fillColor('#10b981')
        .fontSize(14)
        .text(order.paymentMethod.toUpperCase(), 365, billToTop + 68);

      // --- Table Section ---
      const tableTop = 360;
      
      // Table Header Row
      doc
        .rect(50, tableTop, 500, 30)
        .fill('#1e293b');

      doc
        .fillColor('#ffffff')
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('DESCRIPTION', 65, tableTop + 10)
        .text('QTY', 300, tableTop + 10, { width: 50, align: 'center' })
        .text('UNIT PRICE', 360, tableTop + 10, { width: 80, align: 'right' })
        .text('TOTAL', 460, tableTop + 10, { width: 80, align: 'right' });

      // Table Rows
      let currentY = tableTop + 30;
      let items = order.orderItems;

      items.forEach((item, i) => {
        const isEven = i % 2 === 0;
        if (isEven) {
          doc.rect(50, currentY, 500, 35).fill('#f8fafc');
        }

        doc
          .fillColor('#1e293b')
          .fontSize(10)
          .font('Helvetica-Bold')
          .text(item.name, 65, currentY + 12);

        doc
          .fillColor('#64748b')
          .fontSize(10)
          .font('Helvetica')
          .text(item.quantity.toString(), 300, currentY + 12, { width: 50, align: 'center' })
          .text(`$${item.price.toFixed(2)}`, 360, currentY + 12, { width: 80, align: 'right' })
          .text(`$${(item.price * item.quantity).toFixed(2)}`, 460, currentY + 12, { width: 80, align: 'right' });

        currentY += 35;
      });

      // --- Summary Section ---
      const summaryY = currentY + 30;
      
      if (summaryY > 700) doc.addPage();

      doc
        .moveTo(350, summaryY)
        .lineTo(550, summaryY)
        .strokeColor('#e2e8f0')
        .stroke();

      const subtotal = order.totalPrice;
      
      doc
        .fillColor('#64748b')
        .fontSize(10)
        .text('Subtotal', 350, summaryY + 15)
        .text(`$${subtotal.toFixed(2)}`, 460, summaryY + 15, { width: 80, align: 'right' });

      doc
        .text('Shipping Charge', 350, summaryY + 35)
        .text('FREE', 460, summaryY + 35, { width: 80, align: 'right', fillColor: '#10b981' });

      doc
        .rect(350, summaryY + 60, 200, 40)
        .fill('#1e293b');

      doc
        .fillColor('#ffffff')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('GRAND TOTAL', 365, summaryY + 74);

      doc
        .fontSize(16)
        .text(`$${order.totalPrice.toFixed(2)}`, 450, summaryY + 72, { width: 90, align: 'right' });

      // --- Footer ---
      doc
        .fillColor('#94a3b8')
        .fontSize(8)
        .font('Helvetica')
        .text('This is a computer generated invoice and does not require a physical signature.', 50, 780, { align: 'center', width: 500 })
        .text('Thank you for choosing FreshCart for your premium organic needs.', 50, 792, { align: 'center', width: 500 });

      doc.end();

      stream.on('finish', () => resolve(filePath));
      stream.on('error', (err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
};
