
import { useState } from 'react';
import LoginForm from '@/components/LoginForm';
import DynamicForm from '@/components/DynamicForm';
import { getForm, FormData } from '@/services/api';
import { toast } from 'sonner';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<{ rollNumber: string; name: string } | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSuccess = async (rollNumber: string, name: string) => {
    setUserData({ rollNumber, name });
    setIsLoading(true);
    
    try {
      const response = await getForm(rollNumber);
      setFormData(response.form);
      setIsLoggedIn(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading your form...</p>
          </div>
        ) : isLoggedIn && formData ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
              <div>
                <h2 className="font-medium">Welcome, {userData?.name}</h2>
                <p className="text-sm text-gray-500">Roll Number: {userData?.rollNumber}</p>
              </div>
              <button 
                onClick={() => {
                  setIsLoggedIn(false); 
                  setFormData(null);
                }}
                className="text-sm text-blue-500 hover:underline"
              >
                Logout
              </button>
            </div>
            
            <DynamicForm formData={formData} />
          </div>
        ) : (
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    </div>
  );
};

export default Index;
