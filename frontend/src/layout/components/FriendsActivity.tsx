import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import { axiosInstance } from "@/lib/axios";
import { Loader2 } from "lucide-react";

interface Friend {
	clerkId: string;
	fullName: string;
	imageUrl: string;
}

export const FriendsActivity = ({ isMobile = false }: { isMobile?: boolean }) => {
	const { data: friends = [], isLoading, error } = useQuery<Friend[]>({
		queryKey: ["friends"],
		queryFn: async () => {
			const { data } = await axiosInstance.get("/friends");
			return data;
		},
		retry: false,
	});

	if (error) {
		return null;
	}

	if (isLoading) {
		return (
			<div className={`bg-zinc-900 rounded-lg p-4 ${isMobile ? '' : 'hidden lg:block'}`}>
				<h2 className="text-lg font-semibold mb-4">Friends Activity</h2>
				<div className="flex items-center justify-center h-32">
					<Loader2 className="h-6 w-6 animate-spin" />
				</div>
			</div>
		);
	}

	if (friends.length === 0) {
		return null;
	}

	return (
		<div className={`bg-zinc-900 rounded-lg p-4 ${isMobile ? '' : 'hidden lg:block'}`}>
			<h2 className="text-lg font-semibold mb-4">Friends Activity</h2>
			<ScrollArea className={isMobile ? "h-[calc(100vh-16rem)]" : "h-[calc(100vh-200px)]"}>
				<div className="space-y-4">
					{friends.map((friend) => (
						<Link
							key={friend.clerkId}
							to={`/profile/${friend.clerkId}`}
							className="flex items-center gap-3 hover:bg-zinc-800 p-2 rounded-lg"
						>
							<Avatar>
								<AvatarImage src={friend.imageUrl} alt={friend.fullName} />
								<AvatarFallback>{friend.fullName.charAt(0)}</AvatarFallback>
							</Avatar>
							<div>
								<p className="font-medium">{friend.fullName}</p>
							</div>
						</Link>
					))}
				</div>
			</ScrollArea>
		</div>
	);
};
