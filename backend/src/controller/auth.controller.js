import { User } from "../models/user.model.js";

export const authCallback = async (req, res, next) => {
	try {
		const { id, firstName, lastName, imageUrl, emailAddresses, username } = req.body;

		// check if user already exists
		const user = await User.findOne({ clerkId: id });

		if (!user) {
			// signup
			await User.create({
				clerkId: id,
				fullName: `${firstName || ""} ${lastName || ""}`.trim(),
				imageUrl: imageUrl,
				email: emailAddresses[0]?.emailAddress,
				username: username || id, // fallback to clerkId if no username
			});
		}

		res.status(200).json({ success: true });
	} catch (error) {
		console.log("Error in auth callback", error);
		next(error);
	}
};
