import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout";
import ChatPage from "./pages/chat/ChatPage";
import AlbumPage from "./pages/album/AlbumPage";
import AdminPage from "./pages/admin/AdminPage";

import { Toaster } from "react-hot-toast";
import NotFoundPage from "./pages/404/NotFoundPage";
import SearchPage from "./pages/search/SearchPage";
import UserSearchPage from "./pages/users/UserSearchPage";
import UserProfilePage from "./pages/profile/UserProfilePage";
import FriendsActivityPage from "./pages/friends/FriendsActivityPage";
import { ThemeProvider } from "./providers/theme-provider";
import NotificationsPage from "./pages/notifications/NotificationsPage";
import MoodPlaylist from "./components/MoodPlaylist";
import DashboardPage from "./pages/dashboard/DashboardPage";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="beatbond-theme">
      <Routes>
        <Route
          path="/sso-callback"
          element={
            <AuthenticateWithRedirectCallback
              signUpForceRedirectUrl={"/auth-callback"}
            />
          }
        />
        <Route path="/auth-callback" element={<AuthCallbackPage />} />
        <Route path="/admin" element={<AdminPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/users" element={<UserSearchPage />} />
          <Route path="/profile/:userId" element={<UserProfilePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/albums/:albumId" element={<AlbumPage />} />
          <Route path="/friends" element={<FriendsActivityPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/mood" element={<MoodPlaylist />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: "bg-card/95 backdrop-blur-sm border border-border/50",
          style: {
            background: "hsl(var(--card))",
            color: "hsl(var(--card-foreground))",
            border: "1px solid hsl(var(--border))",
            fontSize: "14px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          },
          success: {
            iconTheme: {
              primary: "hsl(var(--primary))",
              secondary: "hsl(var(--primary-foreground))",
            },
            duration: 4000,
          },
          error: {
            iconTheme: {
              primary: "hsl(var(--destructive))",
              secondary: "hsl(var(--destructive-foreground))",
            },
            duration: 4000,
          },
          loading: {
            iconTheme: {
              primary: "hsl(var(--muted-foreground))",
              secondary: "hsl(var(--background))",
            },
          },
        }}
      />
    </ThemeProvider>
  );
}

export default App;
