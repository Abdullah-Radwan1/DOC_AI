import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { Loader2, Settings as SettingsIcon, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { changePassword, updateProfile } from "@/lib/endpoints/user-endpoints";
import { toast } from "sonner";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function ProfileSettings() {
  const { user } = useAuth();
  console.log(user);
  const queryClient = useQueryClient();

  const [fullName, setFullName] = useState(user?.full_name || "");
  const [profileError, setProfileError] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.full_name) {
      setFullName(user.full_name);
    }
  }, [user?.full_name]);

  const profileMutation = useMutation({
    mutationFn: (payload: { fullName: string }) => updateProfile(payload),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["auth", "me"], { user: updatedUser });
      setProfileError(null);
      toast.success("Profile updated successfully.");
    },
    onError: (err: unknown) => {
      const msg =
        (err as Record<string, any>)?.response?.data?.message ??
        "Failed to update profile.";
      setProfileError(msg);
      toast.error(msg);
    },
  });

  const passwordMutation = useMutation({
    mutationFn: (payload: {
      oldPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => changePassword(payload),
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError(null);
      toast.success("Password changed successfully.");
    },
    onError: (err: unknown) => {
      const msg =
        (err as Record<string, any>)?.response?.data?.message ??
        "Failed to change password.";
      setPasswordError(msg);
      toast.error(msg);
    },
  });

  const handleProfileSubmit = () => {
    setProfileError(null);
    if (!fullName.trim() || fullName.trim().length < 2) {
      setProfileError("Name must be at least 2 characters.");
      return;
    }
    profileMutation.mutate({ fullName: fullName.trim() });
  };

  const handlePasswordSubmit = () => {
    setPasswordError(null);

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    passwordMutation.mutate({
      oldPassword: currentPassword,
      newPassword,
      confirmPassword,
    });
  };

  return (
    <div className="space-y-6">
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user?.email || ""}
                  disabled
                  className="bg-muted/50"
                />
              </div>
            </div>

            {profileError && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {profileError}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={handleProfileSubmit}
              disabled={profileMutation.isPending}
            >
              {profileMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <SettingsIcon className="mr-2 h-4 w-4" />
              )}
              Update Profile
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Change your password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                {newPassword.length > 0 && newPassword.length < 8 && (
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {confirmPassword.length > 0 &&
                  newPassword !== confirmPassword && (
                    <p className="text-xs text-destructive">
                      Passwords do not match
                    </p>
                  )}
              </div>
            </div>
            {passwordError && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {passwordError}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={handlePasswordSubmit}
              disabled={passwordMutation.isPending}
            >
              {passwordMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Lock className="mr-2 h-4 w-4" />
              )}
              Update Password
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
