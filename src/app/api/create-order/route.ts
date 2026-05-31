import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const amount = Math.round(Number(data.amount) * 100); // amount in paise

    const keyId = process.env.RAZORPAY_KEY_ID || '';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

    if (keyId && keySecret) {
      const instance = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      const order = await instance.orders.create({
        amount: amount,
        currency: 'INR',
        receipt: `receipt_order_${Date.now()}`,
      });

      return NextResponse.json({
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        key: keyId,
        mode: 'live'
      });
    } else {
      console.warn('Razorpay keys not configured. Falling back to mock test order.');
      const mockOrder = {
        id: 'rzp_mock_' + Math.random().toString(36).substring(2, 9),
        amount: amount,
        currency: 'INR',
        key: 'rzp_test_placeholder',
        mode: 'sandbox'
      };
      return NextResponse.json(mockOrder);
    }
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
