import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { email, otp, method, destination } = data;

    const targetEmail = email || destination || 'sonalika.ctc29@gmail.com';

    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = Number(process.env.SMTP_PORT || '587');
    const smtpUser = process.env.SMTP_USER?.trim().replace(/['"]/g, '');
    const smtpPass = process.env.SMTP_PASS?.trim().replace(/\s+/g, '').replace(/['"]/g, '');

    // Check if SMTP is configured
    if (!smtpUser || !smtpPass) {
      console.warn('SMTP credentials are not configured in .env.local. Falling back to local simulation mode.');
      return NextResponse.json({
        success: false,
        isSimulated: true,
        error: 'SMTP_USER or SMTP_PASS is missing in .env.local file. Real email cannot be sent.'
      });
    }

    // Configure nodemailer transport
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const mailOptions = {
      from: `"Meducil Admin Portal" <${smtpUser}>`,
      to: targetEmail,
      subject: `Meducil Admin Access OTP Code: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #f0f0f0; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">Meducil Admin Portal</h2>
            <p style="color: #64748b; font-size: 13px; margin-top: 5px;">Founder Security Access Control Desk</p>
          </div>
          
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 25px; border-radius: 10px; text-align: center; margin-bottom: 25px;">
            <p style="font-size: 13px; color: #475569; margin-top: 0; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">Your 6-Digit Security OTP</p>
            <h1 style="font-size: 38px; color: #0284c7; font-family: monospace; letter-spacing: 0.15em; margin: 15px 0; font-weight: bold;">${otp}</h1>
            <p style="font-size: 11px; color: #94a3b8; margin-bottom: 0;">This passcode is valid for the next 10 minutes and is single-use only.</p>
          </div>

          <div style="color: #334155; font-size: 13px; line-height: 1.6; margin-bottom: 25px;">
            <p><strong>Security Warning:</strong> A login request was initiated for your Meducil Founder panel on a local server. If you did not trigger this request, please change your admin password in your settings immediately to preserve clinic security.</p>
          </div>

          <div style="border-top: 1px solid #f0f0f0; padding-top: 20px; text-align: center; font-size: 10px; color: #94a3b8;">
            <p>© 2026 Meducil Homeopathic Clinic, Fulfillment Desk. Potency Protected Security Protocol.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Real OTP email successfully sent to ${targetEmail}`);

    return NextResponse.json({
      success: true,
      message: `OTP email successfully sent to ${targetEmail}`
    });
  } catch (error: any) {
    console.error('Error sending email via SMTP:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'SMTP server connection failed'
    }, { status: 500 });
  }
}
