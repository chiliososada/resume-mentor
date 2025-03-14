
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { profileService, ProfileData } from '@/services/profileService';
import { authService, ChangePasswordRequest } from '@/services/authService';

const SettingsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<ProfileData>({
    fullName: '',
    birthDate: '',
    birthPlace: '',
    introduction: '',
    hobbies: '',
  });
  
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const profileData = await profileService.getProfile();
        setUser(profileData);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        toast({
          title: "Error loading profile",
          description: "Failed to load your profile information. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [toast]);
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      const response = await profileService.updateProfile(user);
      
      toast({
        title: "Profile updated",
        description: response.message || "Your profile information has been updated successfully.",
      });
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Update failed",
        description: "An error occurred while updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation don't match.",
        variant: "destructive",
      });
      return;
    }
    
    if (passwords.new.length < 8) {
      toast({
        title: "Password too short",
        description: "New password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const passwordData: ChangePasswordRequest = {
        currentPassword: passwords.current,
        newPassword: passwords.new
      };
      
      const response = await authService.changePassword(passwordData);
      
      toast({
        title: "Password updated",
        description: response.message || "Your password has been updated successfully.",
      });
      
      setPasswords({
        current: '',
        new: '',
        confirm: '',
      });
    } catch (error) {
      console.error('Password update error:', error);
      // Error is already handled in the API service
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    try {
      setIsLoading(true);
      
      const response = await profileService.uploadAvatar(file);
      
      toast({
        title: "Avatar uploaded",
        description: response.message || "Your avatar has been uploaded successfully.",
      });
      
      // You might want to update the avatar display here
    } catch (error) {
      console.error('Avatar upload error:', error);
      // Error is already handled in the API service
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-transition">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="glass-card animate-in">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User size={18} className="text-muted-foreground" />
                <CardTitle>Profile Information</CardTitle>
              </div>
              <CardDescription>
                Update your profile information and email address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="flex flex-col items-center mb-6">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="" alt="Avatar" />
                    <AvatarFallback className="text-2xl">
                      {user.fullName?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                  />
                  <label htmlFor="avatar-upload">
                    <Button variant="outline" size="sm" className="cursor-pointer" type="button">
                      Change Avatar
                    </Button>
                  </label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={user.fullName}
                    onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Birth Date</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={user.birthDate || ''}
                    onChange={(e) => setUser({ ...user, birthDate: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="birthPlace">Birth Place</Label>
                  <Input
                    id="birthPlace"
                    value={user.birthPlace || ''}
                    onChange={(e) => setUser({ ...user, birthPlace: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="introduction">Introduction</Label>
                  <Textarea
                    id="introduction"
                    rows={3}
                    value={user.introduction || ''}
                    onChange={(e) => setUser({ ...user, introduction: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hobbies">Hobbies</Label>
                  <Textarea
                    id="hobbies"
                    rows={2}
                    value={user.hobbies || ''}
                    onChange={(e) => setUser({ ...user, hobbies: e.target.value })}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card className="glass-card animate-in">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock size={18} className="text-muted-foreground" />
                <CardTitle>Change Password</CardTitle>
              </div>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !passwords.current || !passwords.new || !passwords.confirm}
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
