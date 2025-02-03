import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import FriendsActivity from "./components/FriendsActivity";
import AudioPlayer from "./components/AudioPlayer";
import { PlaybackControls } from "./components/PlaybackControls";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
// import { VisuallyHidden } from "@/components/ui/visually-hidden";

const MainLayout = () => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	return (
		<div className='h-screen bg-black text-white flex flex-col'>
			<ResizablePanelGroup direction='horizontal' className='flex-1 flex h-full overflow-hidden p-2'>
				<AudioPlayer />
				
				{/* Mobile Menu Button - Adjusted positioning */}
				{isMobile ? (
					<Sheet>
						<SheetTrigger asChild>
							<button className="fixed top-5 right-4 z-50 p-2 bg-zinc-900 rounded-lg md:hidden">
								<Menu className="h-6 w-6" />
							</button>
						</SheetTrigger>
						<SheetContent side="left" className="w-[300px] p-0 bg-zinc-900 border-r-zinc-700">
							<SheetTitle className="sr-only">
								Navigation Menu
							</SheetTitle>
							<LeftSidebar />
						</SheetContent>
					</Sheet>
				) : (
					// Desktop sidebar
					<ResizablePanel defaultSize={20} minSize={10} maxSize={30}>
						<LeftSidebar />
					</ResizablePanel>
				)}

				<ResizableHandle className={`w-2 bg-black rounded-lg transition-colors ${isMobile ? 'hidden' : ''}`} />

				{/* Main content */}
				<ResizablePanel defaultSize={isMobile ? 100 : 60}>
					<Outlet />
				</ResizablePanel>

				{!isMobile && (
					<>
						<ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />
						<ResizablePanel defaultSize={20} minSize={0} maxSize={25} collapsedSize={0}>
							<FriendsActivity />
						</ResizablePanel>
					</>
				)}
			</ResizablePanelGroup>

			<PlaybackControls />
		</div>
	);
};
export default MainLayout;
