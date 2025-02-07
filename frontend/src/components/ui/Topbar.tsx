import { SignInButton, SignOutButton, UserButton, useUser } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { buttonVariants } from "./button";
import { cn } from "@/lib/utils";
import { NotificationBell } from "../NotificationBell";

const Topbar = () => {
    const { isAdmin } = useAuthStore();
	const { isSignedIn } = useUser();
	console.log({ isAdmin }); 

  return (
    <div className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10">
      <div className="flex gap-2 items-center">
        <img src="/spotify.png " alt="Spotify Logo" className="size-8" />
        Spotify
        </div>

      <div className="flex items-center gap-4">
        {isAdmin && (
          <Link to={"/admin"} className={cn(buttonVariants({variant: "outline"}))}>
            <LayoutDashboardIcon className="size-4 mr-2" />
            Admin Dashboard
          </Link>
        )}

        {isSignedIn ? (
          <>
            <NotificationBell />
            <UserButton afterSignOutUrl='/' />
          </>
        ) : (
          <SignInButton mode='modal'>
            <Button>Sign in</Button>
          </SignInButton>
        )}
      </div>
    </div>
  );
};

export default Topbar;
