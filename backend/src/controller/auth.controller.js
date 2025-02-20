import { User } from "../models/user.model.js";

export const authCallback = async (req, res) => {
	try {
		const { id, email_addresses, username, first_name, last_name, image_url } = req.body;
		
		console.log('Auth callback received:', { id, email_addresses, username, first_name, last_name });
		
		if (!id) {
			throw new Error('No user ID provided from Clerk');
		}

		// Find existing user
		let user = await User.findOne({ clerkId: id });
		console.log('Existing user found:', user);

		if (!user) {
			// For new user creation
			const email = email_addresses || '';
			const generatedUsername = username || email.split('@')[0] || `user_${Date.now()}`;
			
			// Create new user with required fields
			const newUser = {
				clerkId: id,
				email: email,
				username: generatedUsername,
				fullName: `${first_name || ''} ${last_name || ''}`.trim(),
				imageUrl: image_url || '',
				isOnline: true
			};

			console.log('Creating new user:', newUser);
			
			try {
				user = await User.create(newUser);
				console.log('✅ New user created successfully:', user);
			} catch (createError) {
				console.error('Error creating user:', createError);
				throw new Error(`Failed to create user: ${createError.message}`);
			}
		} else {
			// Update existing user's information
			try {
				user.email = email_addresses || user.email;
				user.fullName = `${first_name || ''} ${last_name || ''}`.trim() || user.fullName;
				user.imageUrl = image_url || user.imageUrl;
				user.isOnline = true;
				await user.save();
				console.log('✅ Existing user updated successfully:', user);
			} catch (updateError) {
				console.error('Error updating user:', updateError);
				throw new Error(`Failed to update user: ${updateError.message}`);
			}
		}

		res.status(200).json({ 
			success: true,
			user 
		});
	} catch (error) {
		console.error('❌ Error in auth callback:', error);
		res.status(500).json({ 
			success: false,
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
