// routes/explorePremiumRoutes.js
import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { explorePremiumContent } from '../controllers/explorePremiumController.js'; // The premium content controller
import { createCheckoutSession } from '../controllers/createCheckoutController.js'; // Stripe checkout controller
import checkPremium from '../middlewares/checkPremium.js'; // Custom middleware to check premium access

dotenv.config();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' });

const router = express.Router();

// POST route for creating a Stripe Checkout session for premium plans
router.post('/create-checkout-session', async (req, res) => {
  const { planId } = req.body;

  // Ensure planId is provided
  if (!planId) {
    return res.status(400).json({ error: 'Plan ID is required' });
  }

  const planMap = {
    basic_plan: { name: 'Basic Plan', amount: 10 },
    pro_plan: { name: 'Pro Plan', amount: 862 },
    ultimate_plan: { name: 'Ultimate Plan', amount: 1726 },
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
});

// GET route for exploring premium content
router.get('/content', checkPremium, explorePremiumContent);

// ✅ NEW: Verify Stripe session status
router.get('/verify-session', async (req, res) => {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ success: false, error: 'Session ID is required' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid') {
      return res.status(200).json({ success: true, session });
    } else {
      return res.status(400).json({ success: false, error: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Stripe verification error:', error.message);
    return res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

export default router;
