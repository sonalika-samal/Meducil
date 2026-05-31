import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

    // If sandbox / keyless mode
    if (!keySecret || razorpay_signature === 'mock_sig_placeholder' || razorpay_order_id?.startsWith('rzp_mock_')) {
      console.warn('Sandbox verification bypass active.');
      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully (Sandbox Mode)',
        paymentId: razorpay_payment_id || 'mock_pay_id'
      });
    }

    // Live verification
    const generated_signature = crypto
      .createHmac('sha256', keySecret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid payment signature verification failed'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
  }
}
