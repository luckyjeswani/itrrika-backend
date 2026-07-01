import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmation(order: {
  id: number;
  customerName: string;
  email: string;
  items: any[];
  totalAmount: string;
  paymentMethod: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}) {
  const itemsList = order.items.map((item: any) =>
    `<tr>
      <td style="padding:8px;border-bottom:1px solid #2a2a2a;color:#fff">${item.name}</td>
      <td style="padding:8px;border-bottom:1px solid #2a2a2a;color:#999">${item.size}</td>
      <td style="padding:8px;border-bottom:1px solid #2a2a2a;color:#c9a84c">₹${item.price}</td>
    </tr>`
  ).join("");

  const paymentInstructions = order.paymentMethod === "upi"
    ? `<div style="background:#1a1a1a;border:1px solid #c9a84c33;padding:20px;margin:20px 0;text-align:center">
        <p style="color:#999;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px">UPI ID</p>
        <p style="color:#c9a84c;font-size:24px;margin:0">itrrika@upi</p>
        <p style="color:#999;font-size:12px;margin:8px 0 0">Please send ${order.totalAmount} and share screenshot on WhatsApp</p>
      </div>`
    : `<div style="background:#1a1a1a;border:1px solid #c9a84c33;padding:20px;margin:20px 0">
        <p style="color:#999;font-size:13px;margin:0">Cash on Delivery — Please keep <span style="color:#c9a84c">${order.totalAmount}</span> ready at the time of delivery.</p>
      </div>`;

  await resend.emails.send({
    from: "ITRRIKA Fragrances <orders@itrrika.com>",
    to: order.email,
    subject: `Order Confirmed — #${order.id} | ITRRIKA Fragrances`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Georgia,serif">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:40px">
      <p style="color:#c9a84c;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:0 0 8px">ITRRIKA</p>
      <h1 style="color:#fff;font-size:28px;margin:0;font-weight:normal">Order Confirmed</h1>
      <p style="color:#666;font-size:13px;margin:8px 0 0">Order #${order.id}</p>
    </div>

    <!-- Greeting -->
    <p style="color:#ccc;font-size:15px;line-height:1.6">
      Dear ${order.customerName},<br><br>
      Thank you for choosing ITRRIKA. Your order has been confirmed and we will contact you shortly.
    </p>

    <!-- Items -->
    <div style="margin:30px 0">
      <p style="color:#c9a84c;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 12px">Items Ordered</p>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr>
            <th style="padding:8px;text-align:left;color:#666;font-size:11px;font-weight:normal;text-transform:uppercase;letter-spacing:2px">Fragrance</th>
            <th style="padding:8px;text-align:left;color:#666;font-size:11px;font-weight:normal;text-transform:uppercase;letter-spacing:2px">Size</th>
            <th style="padding:8px;text-align:left;color:#666;font-size:11px;font-weight:normal;text-transform:uppercase;letter-spacing:2px">Price</th>
          </tr>
        </thead>
        <tbody>${itemsList}</tbody>
      </table>
      <div style="border-top:1px solid #c9a84c33;padding:12px 8px;display:flex;justify-content:space-between">
        <span style="color:#999;font-size:12px;text-transform:uppercase;letter-spacing:2px">Total</span>
        <span style="color:#c9a84c;font-size:20px">${order.totalAmount}</span>
      </div>
    </div>

    <!-- Payment -->
    <p style="color:#c9a84c;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 8px">Payment</p>
    ${paymentInstructions}

    <!-- Delivery Address -->
    <div style="margin:30px 0">
      <p style="color:#c9a84c;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 12px">Delivery Address</p>
      <p style="color:#ccc;font-size:14px;line-height:1.8;margin:0">
        ${order.customerName}<br>
        ${order.addressLine}<br>
        ${order.city}, ${order.state} — ${order.pincode}
      </p>
    </div>

    <!-- Cancel notice -->
    <div style="border:1px solid #333;padding:16px;margin:30px 0">
      <p style="color:#999;font-size:12px;margin:0;line-height:1.6">
        ⏱ You can cancel your order within <strong style="color:#fff">3 hours</strong> of placing it.
        After that, cancellation will not be possible.
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;border-top:1px solid #1a1a1a;padding-top:30px;margin-top:40px">
      <p style="color:#c9a84c;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 8px">ITRRIKA Fragrances</p>
      <p style="color:#555;font-size:12px;margin:0">For any queries, contact us on WhatsApp</p>
    </div>

  </div>
</body>
</html>
    `,
  });
}