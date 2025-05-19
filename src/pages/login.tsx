import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Package } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = loginSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  role: z.enum([UserRole.SELLER, UserRole.STAFF, UserRole.ADMIN]).default(UserRole.SELLER),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

export default function Login() {
  const { user, login, signup, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  
  // Get redirect URL from query params or default based on role
  const queryParams = new URLSearchParams(location.search);
  const redirectUrl = queryParams.get('redirect') || '/';
  
  console.log('Login page:', { redirectUrl, userLoggedIn: !!user, authLoading });

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      console.log(`User already logged in as ${user.email} with role ${user.role}, redirecting to:`, redirectUrl);
      navigate(redirectUrl);
    }
  }, [user, navigate, redirectUrl, authLoading]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      phone: '',
      role: UserRole.SELLER,
    },
  });

  async function onLoginSubmit(values: LoginFormValues) {
    setIsSubmitting(true);
    
    try {
      console.log('Login form submitted:', values.email);
      await login(values.email, values.password);
      console.log('Login successful, redirecting to:', redirectUrl);
      navigate(redirectUrl);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onSignupSubmit(values: SignupFormValues) {
    setIsSubmitting(true);
    console.log("Submitting signup with values:", values);
    
    try {
      await signup(
        values.email, 
        values.password, 
        values.name, 
        values.phone, 
        values.role || UserRole.SELLER
      );
      // For new signups, redirect to listings page instead of potentially protected area
      const defaultRedirect = '/listings';
      console.log('Signup successful, redirecting to:', defaultRedirect);
      navigate(defaultRedirect);
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // If we're already logged in and not loading, don't show the login form
  if (user && !authLoading) {
    return (
      <div className="container max-w-md py-12 flex flex-col items-center">
        <div className="text-center mb-4">
          <p>You are already logged in.</p>
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
        <Button onClick={() => navigate(redirectUrl)}>
          Continue to {redirectUrl}
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-md py-12">
      <div className="flex justify-center mb-8">
        <div className="rounded-md bg-scrapy-500 p-2">
          <Package className="h-8 w-8 text-white" />
        </div>
      </div>
      
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Welcome to Scrapy</CardTitle>
          <CardDescription className="text-center">
            {activeTab === 'login' 
              ? 'Log in to your account to manage your scrap pickups' 
              : 'Create an account to start selling your scrap'}
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="login" value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'signup')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <CardContent className="pt-6">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="email@example.com" 
                            type="email" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="••••••••" 
                            type="password" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button className="w-full" type="submit" disabled={isSubmitting || authLoading}>
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </Form>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Demo Accounts:</h3>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>For testing purposes only.</p>
                  <p>Seller: rahul@example.com / password123</p>
                  <p>Staff: vikram@scrapy.in / password123</p>
                  <p>Admin: aditya@scrapy.in / password123</p>
                </div>
              </div>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="signup">
            <CardContent className="pt-6">
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                  <FormField
                    control={signupForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Full Name" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="email@example.com" 
                            type="email" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="••••••••" 
                            type="password" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="9876543210" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Add a hidden role field that defaults to SELLER */}
                  <FormField
                    control={signupForm.control}
                    name="role"
                    render={({ field }) => (
                      <input type="hidden" {...field} value={UserRole.SELLER} />
                    )}
                  />
                  
                  <Button className="w-full" type="submit" disabled={isSubmitting || authLoading}>
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </TabsContent>
        </Tabs>
        
        <CardFooter className="flex flex-col pt-0">
          <p className="text-sm text-muted-foreground text-center">
            By continuing, you agree to Scrapy's Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
