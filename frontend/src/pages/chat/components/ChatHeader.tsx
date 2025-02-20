import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ChatHeaderProps {
	imageUrl?: string;
	fullName: string;
	isOnline?: boolean;
	isMobile?: boolean;
	onBack?: () => void;
}

export const ChatHeader = ({
	imageUrl,
	fullName,
	isOnline = false,
	isMobile = false,
	onBack
}: ChatHeaderProps) => {
	const navigate = useNavigate();

	return (
		<div className="h-14 px-4 border-b bg-card/30 backdrop-blur-sm flex items-center gap-3">
			{isMobile && (
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8"
					onClick={() => onBack ? onBack() : navigate('/chat')}
				>
					<ArrowLeft className="h-4 w-4" />
				</Button>
			)}
			
			<div className="flex items-center gap-3 flex-1">
				<div className="relative">
					<Avatar>
						<AvatarImage src={imageUrl} alt={fullName} />
						<AvatarFallback>{fullName.charAt(0)}</AvatarFallback>
					</Avatar>
					{isOnline && (
						<span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
					)}
				</div>
				<div className="flex flex-col">
					<h2 className="font-medium leading-none">{fullName}</h2>
					{isOnline && (
						<span className="text-xs text-muted-foreground mt-1">Online</span>
					)}
				</div>
			</div>

			<Button variant="ghost" size="icon" className="h-8 w-8">
				<MoreVertical className="h-4 w-4" />
			</Button>
		</div>
	);
};
