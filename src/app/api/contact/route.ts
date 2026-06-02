import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, subject, message } = data;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({
        success: false,
        error: 'All fields are required.'
      }, { status: 400 });
    }

    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = Number(process.env.SMTP_PORT || '587');
    const smtpUser = process.env.SMTP_USER?.trim().replace(/['"]/g, '');
    const smtpPass = process.env.SMTP_PASS?.trim().replace(/\s+/g, '').replace(/['"]/g, '');

    // Check if SMTP is configured
    if (!smtpUser || !smtpPass) {
      console.warn('SMTP credentials are not configured. Simulating sending contact email to sonalika.ctc29@gmail.com.');
      return NextResponse.json({
        success: true,
        isSimulated: true,
        message: 'Message sent successfully (Simulated mode)'
      });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const mailOptions = {
      from: `"Meducil Contact Form" <${smtpUser}>`,
      to: 'sonalika.ctc29@gmail.com',
      replyTo: email,
      subject: `Meducil Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #f0f0f0; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0284c7; padding-bottom: 15px;">
            <h2 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 800;">Meducil Contact Message</h2>
            <p style="color: #64748b; font-size: 14px; margin-top: 5px;">New message from contact page</p>
          </div>
          
          <div style="margin-bottom: 25px;">
            <p style="margin: 5px 0;"><strong>Sender Name:</strong> ${name}</p>
            <p style="margin: 5px 0;"><strong>Sender Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
          </div>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 10px; margin-bottom: 25px; white-space: pre-wrap; color: #334155; line-height: 1.6;">
            ${message}
          </div>

          <div style="border-top: 1px solid #f0f0f0; padding-top: 20px; text-align: center; font-size: 11px; color: #94a3b8;">
            <p>Sent from Meducil Contact Form Page</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Contact email successfully sent to sonalika.ctc29@gmail.com`);

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!'
    });
  } catch (error: any) {
    console.error('Error sending contact email:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'SMTP server connection failed'
    }, { status: 500 });
  }
}
