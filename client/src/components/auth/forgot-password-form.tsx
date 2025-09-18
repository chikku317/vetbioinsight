import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { forgotPasswordSchema, ForgotPasswordData } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Mail } from "lucide-react";

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
  onResetTokenReceived: (token: string) => void;
}

export function ForgotPasswordForm({ onBackToLogin, onResetTokenReceived }: ForgotPasswordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setMessage(null);

      const response = await apiRequest("POST", "/api/auth/forgot-password", data);

      const result = await response.json();
      
      if (response.ok) {
        setMessage(result.message);
        
        // For demo purposes without email, show the reset token
        if (result.resetToken) {
          onResetTokenReceived(result.resetToken);
        }
      } else {
        setError(result.error || "Failed to process request");
      }
    } catch (err) {
      setError("Failed to send reset email");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Reset Password
        </CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="forgot-password-form">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                      data-testid="input-email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription data-testid="error-message">{error}</AlertDescription>
              </Alert>
            )}
            
            {message && (
              <Alert>
                <AlertDescription data-testid="success-message">{message}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex flex-col gap-2">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
                data-testid="button-send-reset"
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={onBackToLogin}
                data-testid="button-back-login"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}