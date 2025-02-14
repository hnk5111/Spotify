import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import { FriendsActivity } from "./components/FriendsActivity";
import AudioPlayer from "./components/AudioPlayer";
import { PlaybackControls } from "./components/PlaybackControls";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { useSidebarStore } from "@/stores/useSidebarStore";
import { cn } from "@/lib/utils";

const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { isVisible } = useSidebarStore();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <AnimatedBackground />
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 h-full p-2 gap-2 z-10 overflow-hidden"
      >
        <AudioPlayer />

        {/* Mobile Menu Button */}
        {isMobile ? (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className={cn(
                "fixed top-5 left-4 z-50 p-2 bg-black/20 hover:bg-black/30 rounded-lg md:hidden shadow-sm transition-all duration-200",
                !isVisible && "hidden" 
                
                )}
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[300px] p-0 bg-black/20 backdrop-blur-sm border-r border-white/10"
            >
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <LeftSidebar onNavigate={handleClose} />
            </SheetContent>
          </Sheet>
        ) : (
          // Desktop sidebar
          <ResizablePanel defaultSize={20} minSize={10} maxSize={30}>
            <div className="h-full overflow-hidden">
              <LeftSidebar />
            </div>
          </ResizablePanel>
        )}

        <ResizableHandle
          className={`w-2 bg-white/10 rounded-full transition-colors hover:bg-white/20 ${
            isMobile ? "hidden" : ""
          }`}
        />

        {/* Main content */}
        <ResizablePanel defaultSize={isMobile ? 100 : 60}>
          <div className="h-full overflow-y-auto">
            <Outlet />
          </div>
        </ResizablePanel>

        {!isMobile && (
          <>
            <ResizableHandle className="w-2 bg-white/10 rounded-full transition-colors hover:bg-white/20" />
            <ResizablePanel
              defaultSize={20}
              minSize={0}
              maxSize={25}
              collapsedSize={0}
            >
              <div className="h-full">
                <FriendsActivity />
              </div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>

      <PlaybackControls />
    </div>
  );
};
export default MainLayout;
