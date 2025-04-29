
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FormField } from '@/services/api';

interface FormFieldProps {
  field: FormField;
  value: any;
  onChange: (fieldId: string, value: any) => void;
  error: string | null;
}

const DynamicFormField = ({ field, value, onChange, error }: FormFieldProps) => {
  const { fieldId, type, label, placeholder, required, dataTestId, options, maxLength, minLength } = field;
  const [touched, setTouched] = useState(false);

  const handleBlur = () => {
    setTouched(true);
  };

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    return required ? `${label} (Required)` : label;
  };

  const renderField = () => {
    switch (type) {
      case 'text':
      case 'tel':
      case 'email':
        return (
          <Input
            id={fieldId}
            type={type}
            placeholder={getPlaceholder()}
            value={value || ''}
            onChange={(e) => onChange(fieldId, e.target.value)}
            onBlur={handleBlur}
            maxLength={maxLength}
            className={error && touched ? "border-red-500" : ""}
            data-test-id={dataTestId}
            aria-invalid={error && touched ? "true" : "false"}
            aria-describedby={error && touched ? `${fieldId}-error` : undefined}
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            id={fieldId}
            placeholder={getPlaceholder()}
            value={value || ''}
            onChange={(e) => onChange(fieldId, e.target.value)}
            onBlur={handleBlur}
            maxLength={maxLength}
            className={error && touched ? "border-red-500" : ""}
            data-test-id={dataTestId}
          />
        );
      
      case 'date':
        return (
          <Input
            id={fieldId}
            type="date"
            value={value || ''}
            onChange={(e) => onChange(fieldId, e.target.value)}
            onBlur={handleBlur}
            className={error && touched ? "border-red-500" : ""}
            data-test-id={dataTestId}
          />
        );
      
      case 'dropdown':
        return (
          <Select 
            value={value || ''} 
            onValueChange={(value) => onChange(fieldId, value)}
            onOpenChange={() => setTouched(true)}
          >
            <SelectTrigger 
              className={error && touched ? "border-red-500" : ""}
              data-test-id={dataTestId}
            >
              <SelectValue placeholder={getPlaceholder()} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  data-test-id={option.dataTestId}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'radio':
        return (
          <RadioGroup 
            value={value || ''} 
            onValueChange={(value) => onChange(fieldId, value)}
            className="flex flex-col gap-2"
            data-test-id={dataTestId}
          >
            {options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={option.value} 
                  id={`${fieldId}-${option.value}`}
                  data-test-id={option.dataTestId}
                />
                <Label htmlFor={`${fieldId}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      
      case 'checkbox':
        // For a single checkbox
        if (!options || options.length === 0) {
          return (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={fieldId} 
                checked={value === true} 
                onCheckedChange={(checked) => onChange(fieldId, checked)}
                data-test-id={dataTestId}
              />
              <Label htmlFor={fieldId}>{label}</Label>
            </div>
          );
        }
        
        // For multiple checkboxes
        return (
          <div className="flex flex-col gap-2" data-test-id={dataTestId}>
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={`${fieldId}-${option.value}`} 
                  checked={value && Array.isArray(value) ? value.includes(option.value) : false}
                  onCheckedChange={(checked) => {
                    const currentValues = Array.isArray(value) ? [...value] : [];
                    if (checked) {
                      onChange(fieldId, [...currentValues, option.value]);
                    } else {
                      onChange(fieldId, currentValues.filter(v => v !== option.value));
                    }
                  }}
                  data-test-id={option.dataTestId}
                />
                <Label htmlFor={`${fieldId}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        );
      
      default:
        return <p>Unsupported field type: {type}</p>;
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId} className="flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      
      {renderField()}
      
      {error && touched && (
        <p className="text-sm text-red-500" id={`${fieldId}-error`}>{error}</p>
      )}
    </div>
  );
};

export default DynamicFormField;
