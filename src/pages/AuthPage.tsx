
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// Form schemas
const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signUpSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignInFormValues = z.infer<typeof signInSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;

const AuthPage = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const { signIn, signUp, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine mode from URL parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const modeParam = queryParams.get('mode');
    if (modeParam === 'signin' || modeParam === 'signup') {
      setMode(modeParam);
    }
  }, [location]);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Sign In form
  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSignInSubmit = async (values: SignInFormValues) => {
    await signIn(values.email, values.password);
  };

  // Sign Up form
  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSignUpSubmit = async (values: SignUpFormValues) => {
    await signUp(values.email, values.password, values.fullName);
  };

  const toggleMode = () => {
    const newMode = mode === 'signin' ? 'signup' : 'signin';
    setMode(newMode);
    navigate(`/auth?mode=${newMode}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-pink-50 dark:from-solace-dark-purple dark:to-purple-900">
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
      
      <main className="flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-lg border-solace-lavender/20 dark:border-solace-dark-lavender/20 animate-fade-in">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-medium">
              {mode === 'signin' ? 'Welcome Back' : 'Create an Account'}
            </CardTitle>
            <CardDescription>
              {mode === 'signin' 
                ? 'Sign in to your account to continue your journey'
                : 'Join Solace to begin your wellness journey'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {mode === 'signin' ? (
              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-4">
                  <FormField
                    control={signInForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="email@example.com" 
                            {...field}
                            className="bg-white dark:bg-solace-dark-purple/30" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signInForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field}
                            className="bg-white dark:bg-solace-dark-purple/30" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    disabled={signInForm.formState.isSubmitting}
                  >
                    {signInForm.formState.isSubmitting ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-4">
                  <FormField
                    control={signUpForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="John Doe" 
                            {...field}
                            className="bg-white dark:bg-solace-dark-purple/30" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signUpForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="email@example.com" 
                            {...field}
                            className="bg-white dark:bg-solace-dark-purple/30" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signUpForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field}
                            className="bg-white dark:bg-solace-dark-purple/30" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signUpForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field}
                            className="bg-white dark:bg-solace-dark-purple/30" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    disabled={signUpForm.formState.isSubmitting}
                  >
                    {signUpForm.formState.isSubmitting ? 'Signing up...' : 'Sign Up'}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 pt-0">
            <div className="text-center text-sm text-muted-foreground">
              {mode === 'signin' ? (
                <p>Don't have an account?{' '}
                  <button 
                    onClick={toggleMode}
                    className="text-purple-500 hover:text-purple-700 font-medium"
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p>Already have an account?{' '}
                  <button 
                    onClick={toggleMode}
                    className="text-purple-500 hover:text-purple-700 font-medium"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </CardFooter>
        </Card>
      </main>
      
      <footer className="py-4 px-6 text-center text-foreground/60 text-sm border-t border-solace-lavender/20 dark:border-solace-dark-lavender/20">
        <p>Solace — A safe space for emotional well-being.</p>
      </footer>
    </div>
  );
};

export default AuthPage;
