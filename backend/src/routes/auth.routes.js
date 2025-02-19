import express from 'express';
import { Webhook } from 'svix';
import { authCallback, getCurrentUser } from '../controller/auth.controller.js';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';

const router = express.Router();

// Webhook route for user creation/updates
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // Get the webhook signing secret from environment variables
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      throw new Error('Please add CLERK_WEBHOOK_SECRET to your .env file');
    }

    // Get the headers
    const svix_id = req.headers['svix-id'];
    const svix_timestamp = req.headers['svix-timestamp'];
    const svix_signature = req.headers['svix-signature'];

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return res.status(400).json({
        error: 'Missing required Svix headers'
      });
    }

    // Create a new Svix instance with your secret
    const wh = new Webhook(WEBHOOK_SECRET);
    
    let evt;
    
    try {
      evt = wh.verify(
        JSON.stringify(req.body),
        {
          'svix-id': svix_id,
          'svix-timestamp': svix_timestamp,
          'svix-signature': svix_signature,
        }
      );
    } catch (err) {
      console.error('❌ Webhook verification failed:', err);
      return res.status(400).json({
        error: 'Webhook verification failed',
        message: err.message
      });
    }

    const { data } = evt;
    console.log('📩 Verified webhook data:', evt.type, data);

    // Handle user creation/update
    if (evt.type === 'user.created' || evt.type === 'user.updated') {
      const reqWithAuth = {
        auth: {
          id: data.id,
          email_addresses: data.email_addresses,
          username: data.username,
          first_name: data.first_name,
          last_name: data.last_name,
          image_url: data.image_url,
          primary_email_address_id: data.primary_email_address_id
        }
      };

      await authCallback(reqWithAuth, res);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('❌ Webhook Error:', error);
    res.status(500).json({ 
      error: 'Webhook processing failed',
      message: error.message 
    });
  }
});

// Protected routes
router.get('/me', ClerkExpressWithAuth(), getCurrentUser);
router.post('/callback', ClerkExpressWithAuth(), authCallback);

export default router;