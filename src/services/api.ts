
// API service for handling requests to the backend

interface CreateUserRequest {
  rollNumber: string;
  name: string;
}

interface CreateUserResponse {
  message: string;
  success: boolean;
}

interface FormOption {
  value: string;
  label: string;
  dataTestId?: string;
}

export interface FormField {
  fieldId: string;
  type: "text" | "tel" | "email" | "textarea" | "date" | "dropdown" | "radio" | "checkbox";
  label: string;
  placeholder?: string;
  required: boolean;
  dataTestId: string;
  validation?: {
    message: string;
  };
  options?: FormOption[];
  maxLength?: number;
  minLength?: number;
}

export interface FormSection {
  sectionId: number;
  title: string;
  description: string;
  fields: FormField[];
}

export interface FormData {
  formTitle: string;
  formId: string;
  version: string;
  sections: FormSection[];
}

export interface FormResponse {
  message: string;
  form: FormData;
}

const API_BASE_URL = 'https://dynamic-form-generator-9rl7.onrender.com';

export const createUser = async (userData: CreateUserRequest): Promise<CreateUserResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getForm = async (rollNumber: string): Promise<FormResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/get-form?rollNumber=${rollNumber}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch form');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching form:', error);
    throw error;
  }
};
