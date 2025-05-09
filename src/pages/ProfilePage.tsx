
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, ArrowLeft, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const profileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth?mode=signin');
    }
  }, [user, navigate]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      username: profile?.username || '',
    },
  });

  // Update form values when profile loads
  useEffect(() => {
    if (profile) {
      form.reset({
        full_name: profile.full_name || '',
        username: profile.username || '',
      });
    }
  }, [profile, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: values.full_name,
          username: values.username,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      await refreshProfile();
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to update profile",
        description: error.message,
      });
    }
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-4 px-6 flex justify-between items-center border-b border-solace-lavender/20 shadow-sm bg-white/80 backdrop-blur-sm dark:bg-solace-dark-purple/80 dark:border-solace-dark-lavender/20">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-base font-normal">
              <ArrowLeft size={18} />
              <span>Back to Home</span>
            </Button>
          </Link>
          <div className="flex items-center">
            <Heart className="h-6 w-6 mr-2 text-solace-lavender dark:text-solace-dark-lavender" />
            <h1 className="text-2xl font-normal bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Solace
            </h1>
          </div>
        </div>
      </header>
      
      <main className="flex-1 solace-container py-8">
        <div className="max-w-md mx-auto">
          <Card className="shadow-md border-solace-lavender/20 dark:border-solace-dark-lavender/20">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-solace-lavender/10 dark:bg-solace-dark-lavender/10 p-4 rounded-full">
                  <User className="h-12 w-12 text-solace-lavender dark:text-solace-dark-lavender" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-medium">Your Profile</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    disabled={form.formState.isSubmitting || !form.formState.isDirty}
                  >
                    {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </Form>
            </CardContent>
            
            <CardFooter className="flex justify-center border-t border-solace-lavender/10 dark:border-solace-dark-lavender/10 pt-4">
              <Link to="/">
                <Button variant="ghost">Return to Home</Button>
              </Link>
            </CardFooter>
          </Card>
          
          <div className="mt-6 text-center">
            <h3 className="text-lg font-medium mb-2">Account Security</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Need to change your password or email?
            </p>
            <Button variant="outline" onClick={() => toast({
              title: "Feature coming soon",
              description: "Password and email changes will be available soon.",
            })}>
              Update Security Settings
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="py-4 px-6 text-center text-foreground/60 text-sm border-t border-solace-lavender/20 dark:border-solace-dark-lavender/20">
        <p>Solace — A safe space for emotional well-being.</p>
      </footer>
    </div>
  );
};

export default ProfilePage;
