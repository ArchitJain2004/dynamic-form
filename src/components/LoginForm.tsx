
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createUser } from '@/services/api';
import { toast } from 'sonner';

interface LoginFormProps {
  onLoginSuccess: (rollNumber: string, name: string) => void;
}

const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [rollNumber, setRollNumber] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    rollNumber: '',
    name: '',
  });

  const validateForm = () => {
    const newErrors = {
      rollNumber: '',
      name: '',
    };
    
    if (!rollNumber.trim()) {
      newErrors.rollNumber = 'Roll Number is required';
    }
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    setErrors(newErrors);
    return !newErrors.rollNumber && !newErrors.name;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await createUser({ rollNumber, name });
      toast.success('Login successful!');
      onLoginSuccess(rollNumber, name);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">Student Login</CardTitle>
        <CardDescription className="text-center">Enter your roll number and name to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="rollNumber" className="text-sm font-medium">
              Roll Number
            </label>
            <Input
              id="rollNumber"
              type="text"
              placeholder="Enter your roll number"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className={errors.rollNumber ? "border-red-500" : ""}
              data-test-id="roll-number-input"
            />
            {errors.rollNumber && (
              <p className="text-sm text-red-500">{errors.rollNumber}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? "border-red-500" : ""}
              data-test-id="name-input"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
            data-test-id="login-button"
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
