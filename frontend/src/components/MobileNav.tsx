import { Home, Library, MessageCircle, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const MobileNav = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: Library, label: "Library", path: "/library" },
    { icon: MessageCircle, label: "Chat", path: "/chat" },
  ];

  return (
    <nav className="flex justify-around items-center h-full">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex flex-col items-center space-y-1 ${
            location.pathname === item.path ? "text-green-500" : "text-zinc-400"
          }`}
        >
          <item.icon className="h-6 w-6" />
          <span className="text-xs">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default MobileNav; 