// controllers/createCheckoutController.js
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' });

export const createCheckoutSession = async (req, res) => {
  const { planId } = req.body;

  if (!planId) {
    return res.status(400).json({ error: 'Plan ID is required' });
  }

  const planMap = {
    basic_plan: { name: 'Basic Plan', amount: 999 },
    pro_plan: { name: 'Pro Plan', amount: 1999 },
    ultimate_plan: { name: 'Ultimate Plan', amount: 2999 },
  };

  const selectedPlan = planMap[planId];
  if (!selectedPlan) {
    return res.status(400).json({ error: 'Invalid plan selected' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: selectedPlan.name,
            },
            unit_amount: selectedPlan.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    return res.json({ id: session.id });
  } catch (error) {
    console.error('Stripe error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};
