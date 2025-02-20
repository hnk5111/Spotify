import { Card, CardContent } from "@/components/ui/card";
import { axiosInstance } from "@/lib/axios";
import { useUser } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AuthCallbackPage = () => {
	const { isLoaded, user } = useUser();
	const navigate = useNavigate();
	const syncAttempted = useRef(false);

	useEffect(() => {
		const syncUser = async () => {
			if (!isLoaded || !user || syncAttempted.current) return;

			try {
				syncAttempted.current = true;
				console.log('Syncing user data:', {
					id: user.id,
					email_addresses: user.primaryEmailAddress?.emailAddress,
					username: user.username,
					first_name: user.firstName,
					last_name: user.lastName,
					image_url: user.imageUrl,
				});

				const response = await axiosInstance.post("/auth/callback", {
					id: user.id,
					email_addresses: user.primaryEmailAddress?.emailAddress,
					username: user.username,
					first_name: user.firstName,
					last_name: user.lastName,
					image_url: user.imageUrl,
				});

				console.log('Sync response:', response.data);

				if (response.data.success) {
					toast.success("Successfully signed in!");
				} else {
					toast.error("Something went wrong during sign in");
				}
			} catch (error) {
				console.error("Error in auth callback:", error);
				toast.error("Failed to complete sign in");
			} finally {
				navigate("/");
			}
		};

		syncUser();
	}, [isLoaded, user, navigate]);

	return (
		<div className='h-screen w-full bg-black flex items-center justify-center'>
			<Card className='w-[90%] max-w-md bg-zinc-900 border-zinc-800'>
				<CardContent className='flex flex-col items-center gap-4 pt-6'>
					<Loader className='size-6 text-emerald-500 animate-spin' />
					<h3 className='text-zinc-400 text-xl font-bold'>Logging you in</h3>
					<p className='text-zinc-400 text-sm'>Please wait while we set up your account...</p>
				</CardContent>
			</Card>
		</div>
	);
};

export default AuthCallbackPage;
