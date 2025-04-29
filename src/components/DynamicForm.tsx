
import { useState, useEffect } from 'react';
import { FormData, FormField, FormSection as FormSectionType } from '@/services/api';
import FormSection from './FormSection';
import { toast } from 'sonner';

interface DynamicFormProps {
  formData: FormData;
}

const DynamicForm = ({ formData }: DynamicFormProps) => {
  const { formTitle, sections } = formData;
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  // Initialize errors object for all fields
  useEffect(() => {
    const initialErrors: Record<string, string | null> = {};
    
    sections.forEach(section => {
      section.fields.forEach(field => {
        initialErrors[field.fieldId] = null;
      });
    });
    
    setErrors(initialErrors);
  }, [sections]);

  const validateField = (field: FormField, value: any): string | null => {
    // Check if required but empty
    if (field.required) {
      if (value === undefined || value === null || value === '') {
        return field.validation?.message || 'This field is required';
      }
      
      if (Array.isArray(value) && value.length === 0) {
        return field.validation?.message || 'Please select at least one option';
      }
    }
    
    // Skip further validation if the field is empty and not required
    if (value === undefined || value === null || value === '') {
      return null;
    }
    
    // Check minLength for text fields
    if (field.minLength !== undefined && 
        ['text', 'email', 'tel', 'textarea'].includes(field.type) && 
        typeof value === 'string' && 
        value.length < field.minLength) {
      return `Minimum ${field.minLength} characters required`;
    }
    
    // Check maxLength for text fields
    if (field.maxLength !== undefined && 
        ['text', 'email', 'tel', 'textarea'].includes(field.type) && 
        typeof value === 'string' && 
        value.length > field.maxLength) {
      return `Maximum ${field.maxLength} characters allowed`;
    }
    
    // Check email format
    if (field.type === 'email' && typeof value === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }
    
    // Check phone format for tel
    if (field.type === 'tel' && typeof value === 'string') {
      const phoneRegex = /^\d{10}$/; // Simple 10-digit validation, adjust as needed
      if (!phoneRegex.test(value.replace(/\D/g, ''))) {
        return 'Please enter a valid phone number';
      }
    }
    
    return null;
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    // Update form values
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    // Find the field in the sections
    let targetField: FormField | undefined;
    
    for (const section of sections) {
      const field = section.fields.find(f => f.fieldId === fieldId);
      if (field) {
        targetField = field;
        break;
      }
    }
    
    if (targetField) {
      // Validate and update errors
      const error = validateField(targetField, value);
      setErrors(prev => ({
        ...prev,
        [fieldId]: error
      }));
    }
  };

  const handleNext = () => {
    // Validate all fields in current section
    const currentSection = sections[currentSectionIndex];
    const sectionErrors: Record<string, string | null> = {};
    let hasErrors = false;
    
    currentSection.fields.forEach(field => {
      const error = validateField(field, formValues[field.fieldId]);
      sectionErrors[field.fieldId] = error;
      if (error !== null) {
        hasErrors = true;
      }
    });
    
    // Update errors state
    setErrors(prev => ({
      ...prev,
      ...sectionErrors
    }));
    
    // Only proceed if no errors
    if (!hasErrors) {
      setCurrentSectionIndex(prev => Math.min(prev + 1, sections.length - 1));
      window.scrollTo(0, 0);
    } else {
      toast.error("Please correct the errors before proceeding");
    }
  };

  const handlePrev = () => {
    setCurrentSectionIndex(prev => Math.max(prev - 1, 0));
    window.scrollTo(0, 0);
  };

  const handleSubmit = () => {
    // Validate all fields in the current section
    const currentSection = sections[currentSectionIndex];
    const sectionErrors: Record<string, string | null> = {};
    let hasErrors = false;
    
    currentSection.fields.forEach(field => {
      const error = validateField(field, formValues[field.fieldId]);
      sectionErrors[field.fieldId] = error;
      if (error !== null) {
        hasErrors = true;
      }
    });
    
    // Update errors state
    setErrors(prev => ({
      ...prev,
      ...sectionErrors
    }));
    
    if (hasErrors) {
      toast.error("Please correct the errors before submitting");
      return;
    }
    
    // Console log the form data
    console.log('Form submission data:', formValues);
    toast.success("Form submitted successfully!");
  };
  
  const currentSection = sections[currentSectionIndex];
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{formTitle}</h1>
        <div className="flex justify-center mt-4">
          <div className="flex items-center">
            {sections.map((section, index) => (
              <div key={section.sectionId} className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index <= currentSectionIndex 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
                {index < sections.length - 1 && (
                  <div 
                    className={`w-12 h-1 ${
                      index < currentSectionIndex ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {currentSection && (
        <FormSection
          section={currentSection}
          formValues={formValues}
          errors={errors}
          onChange={handleFieldChange}
          onNext={handleNext}
          onPrev={handlePrev}
          isFirst={currentSectionIndex === 0}
          isLast={currentSectionIndex === sections.length - 1}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default DynamicForm;
