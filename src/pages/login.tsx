
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Package } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { USERS } from '@/lib/data';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get redirect URL from query params or default based on role
  const queryParams = new URLSearchParams(location.search);
  const redirectUrl = queryParams.get('redirect') || '/';
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      await login(values.email);
      
      // Find the user to determine where to redirect
      const user = USERS.find(u => u.email === values.email);
      
      if (user) {
        if (redirectUrl !== '/') {
          navigate(redirectUrl);
        } else if (user.role === UserRole.SELLER) {
          navigate('/listings');
        } else {
          navigate('/dashboard/queue');
        }
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsSubmitting(false);
    }
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
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your email to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
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
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Demo Accounts:</h3>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Seller: rahul@example.com</p>
              <p>Staff: vikram@scrapy.in</p>
              <p>Admin: aditya@scrapy.in</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-sm text-muted-foreground text-center">
            In a real application, this would send a magic link to your email.
            <br />
            For demo purposes, just enter any of the above emails to log in.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
