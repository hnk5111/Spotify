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
    <div className="h-screen bg-background text-foreground flex flex-col relative">
      <AnimatedBackground />
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 flex h-full overflow-hidden p-2 gap-2 relative z-10"
      >
        <AudioPlayer />

        {/* Mobile Menu Button */}
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <button className="fixed top-5 right-4 z-50 p-2 bg-card hover:bg-secondary/80 rounded-lg md:hidden border border-border/50 shadow-sm transition-all duration-200">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[300px] p-0 bg-background/95 backdrop-blur-sm border-r border-border"
            >
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <LeftSidebar />
            </SheetContent>
          </Sheet>
        ) : (
          // Desktop sidebar
          <ResizablePanel defaultSize={20} minSize={10} maxSize={30}>
            <LeftSidebar />
          </ResizablePanel>
        )}

        <ResizableHandle
          className={`w-2 bg-border/10 rounded-full transition-colors hover:bg-border/20 ${
            isMobile ? "hidden" : ""
          }`}
        />

        {/* Main content */}
        <ResizablePanel defaultSize={isMobile ? 100 : 60}>
          <Outlet />
        </ResizablePanel>

        {!isMobile && (
          <>
            <ResizableHandle className="w-2 bg-border/10 rounded-full transition-colors hover:bg-border/20" />
            <ResizablePanel
              defaultSize={20}
              minSize={0}
              maxSize={25}
              collapsedSize={0}
            >
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
