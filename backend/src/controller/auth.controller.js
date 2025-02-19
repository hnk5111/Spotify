import { User } from "../models/user.model.js";

export const authCallback = async (req, res) => {
	try {
		const { id, email_addresses, username, first_name, last_name, image_url } = req.auth;
		
		if (!id) {
			throw new Error('No user ID provided from Clerk');
		}

		// Find existing user
		let user = await User.findOne({ clerkId: id });

		if (!user) {
			// Get primary email from Clerk
			const primaryEmail = email_addresses?.find(email => email.id === req.auth.primary_email_address_id)?.email_address;
			
			if (!primaryEmail) {
				throw new Error('No primary email found from Clerk');
			}

			// Create new user with required fields
			user = await User.create({
				clerkId: id,
				email: primaryEmail,
				username: username || primaryEmail.split('@')[0], // Use username or create from email
				fullName: `${first_name || ''} ${last_name || ''}`.trim(),
				imageUrl: image_url || '',
				isOnline: true
			});

			console.log('✅ New user created:', user.fullName);
		} else {
			// Update existing user's information
			user.email = email_addresses?.[0]?.email_address || user.email;
			user.fullName = `${first_name || ''} ${last_name || ''}`.trim() || user.fullName;
			user.imageUrl = image_url || user.imageUrl;
			user.isOnline = true;
			await user.save();

			console.log('✅ Existing user updated:', user.fullName);
		}

		res.json({ user });
	} catch (error) {
		console.error('❌ Error in auth callback:', error);
		res.status(500).json({ 
			error: 'Authentication failed',
			message: error.message 
		});
	}
};

export const getCurrentUser = async (req, res) => {
	try {
		const { userId } = req.auth;
		
		if (!userId) {
			return res.status(401).json({ error: 'No user ID provided' });
		}

		const user = await User.findOne({ clerkId: userId });
		
		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		res.json(user);
	} catch (error) {
		console.error('❌ Error getting current user:', error);
		res.status(500).json({ 
			error: 'Failed to get user',
			message: error.message 
		});
	}
};
