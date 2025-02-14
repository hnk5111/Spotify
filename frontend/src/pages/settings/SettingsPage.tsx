import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SettingsFormData {
  fullName: string;
  username: string;
  bio: string;
  email: string;
  theme: string;
  notifications: {
    email: boolean;
    push: boolean;
  };
}

const SettingsPage = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { data: userProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/users/profile/${user?.id}`);
      return data;
    },
    enabled: !!user,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormData>({
    defaultValues: {
      fullName: userProfile?.fullName || "",
      username: userProfile?.username || "",
      bio: userProfile?.bio || "",
      email: userProfile?.email || "",
      theme: "dark",
      notifications: {
        email: true,
        push: true,
      },
    },
  });

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: async (data: SettingsFormData) => {
      const response = await axiosInstance.put(`/users/profile`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  const onSubmit = (data: SettingsFormData) => {
    updateProfile(data);
  };

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="container max-w-4xl py-8">
        <div className="space-y-6">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your profile information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback>
                      {user?.fullName?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">Profile Picture</h3>
                    <p className="text-sm text-muted-foreground">
                      Your profile picture is managed through your Clerk account
                    </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      {...register("fullName", {
                        required: "Full name is required",
                      })}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-destructive">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      {...register("username", {
                        required: "Username is required",
                      })}
                    />
                    {errors.username && (
                      <p className="text-sm text-destructive">
                        {errors.username.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      {...register("bio")}
                      placeholder="Tell us about yourself"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isPending}>
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Preferences Section */}
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your app experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="theme">Theme</Label>
                <Select defaultValue="dark">
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Notification Settings</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="checkbox"
                    id="emailNotifications"
                    className="h-4 w-4"
                    {...register("notifications.email")}
                  />
                  <Label htmlFor="emailNotifications">
                    Email Notifications
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="checkbox"
                    id="pushNotifications"
                    className="h-4 w-4"
                    {...register("notifications.push")}
                  />
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Section */}
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.primaryEmailAddress?.emailAddress}
                  disabled
                />
                <p className="text-sm text-muted-foreground">
                  Email is managed through your Clerk account
                </p>
              </div>

              <div className="space-y-4">
                <Button variant="outline" onClick={() => user?.update({})}>
                  Update Account Details
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (
                      confirm("Are you sure you want to delete your account?")
                    ) {
                      // Handle account deletion
                    }
                  }}
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
