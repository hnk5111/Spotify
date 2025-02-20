import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Smile } from "lucide-react";
import { FormEvent, useState } from "react";
import EmojiPicker from 'emoji-picker-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface MessageInputProps {
	message: string;
	onChange: (value: string) => void;
	onSubmit: (e: FormEvent) => void;
	isSending?: boolean;
	placeholder?: string;
}

export const MessageInput = ({
	message,
	onChange,
	onSubmit,
	isSending = false,
	placeholder = "Type a message..."
}: MessageInputProps) => {
	const [] = useState(false);

	const onEmojiClick = (emojiData: any) => {
		onChange(message + emojiData.emoji);
	};

	return (
		<div className="p-4 border-t bg-card/30 backdrop-blur-sm">
			<form 
				onSubmit={onSubmit}
				className="flex items-center gap-2 max-w-4xl mx-auto relative"
			>
				<Popover>
					<PopoverTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="flex-shrink-0"
						>
							<Smile className="h-5 w-5 text-muted-foreground" />
						</Button>
					</PopoverTrigger>
					<PopoverContent 
						side="top" 
						align="start" 
						className="w-full p-0 border-none"
					>
						<EmojiPicker
							onEmojiClick={onEmojiClick}
							width="100%"
							height={400}
						/>
					</PopoverContent>
				</Popover>

				<Input
					value={message}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
					className="flex-1 py-6"
					disabled={isSending}
				/>

				<Button 
					type="submit" 
					size="icon"
					variant="default"
					className="flex-shrink-0"
					disabled={!message.trim() || isSending}
				>
					{isSending ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<Send className="h-4 w-4" />
					)}
				</Button>
			</form>
		</div>
	);
};
