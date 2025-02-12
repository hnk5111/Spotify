import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";
import { Loader2 } from "lucide-react";

export function EditProfileDialog() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    username: user?.username || "",
    bio: "",
    imageUrl: user?.imageUrl || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || "",
        username: user.username || "",
        imageUrl: user.imageUrl || "",
        email: user.primaryEmailAddress?.emailAddress || "",
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error("User not found");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.put(
        `/users/profile/${user.id}`,
        formData
      );

      if (response.status === 200) {
        toast.success("Profile updated successfully");
        setIsOpen(false);
        
        await user.update({
          firstName: formData.fullName.split(" ")[0],
          lastName: formData.fullName.split(" ").slice(1).join(" "),
          username: formData.username,
        });
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-card hover:bg-secondary/80 border-border transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border border-border shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Profile</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-foreground">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              disabled={isLoading}
              className="bg-background border-border focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username" className="text-foreground">Username</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
              className="bg-background border-border focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Enter your email"
              className="bg-background border-border focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-foreground">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              disabled={isLoading}
              className="bg-background border-border focus:ring-primary resize-none min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-foreground">Profile Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              disabled={isLoading}
              className="bg-background border-border focus:ring-primary"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
              className="bg-card hover:bg-secondary/80 border-border transition-all duration-200"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
