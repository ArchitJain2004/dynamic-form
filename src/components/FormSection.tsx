
import { FormSection as FormSectionType } from '@/services/api';
import { Button } from "@/components/ui/button";
import DynamicFormField from './FormField';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface FormSectionProps {
  section: FormSectionType;
  formValues: Record<string, any>;
  errors: Record<string, string | null>;
  onChange: (fieldId: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
  onSubmit?: () => void;
}

const FormSection = ({
  section,
  formValues,
  errors,
  onChange,
  onNext,
  onPrev,
  isFirst,
  isLast,
  onSubmit
}: FormSectionProps) => {
  const { title, description, fields } = section;

  // Check if the section has any errors
  const hasErrors = fields.some(field => errors[field.fieldId] !== null);
  const areAllRequiredFieldsFilled = fields
    .filter(field => field.required)
    .every(field => {
      const value = formValues[field.fieldId];
      // Check if the value exists and is not empty
      if (Array.isArray(value)) {
        return value.length > 0;
      } else if (typeof value === 'boolean') {
        return true; // Boolean values are considered filled
      }
      return value !== undefined && value !== null && value !== '';
    });

  const canAdvance = !hasErrors && areAllRequiredFieldsFilled;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map(field => (
          <DynamicFormField
            key={field.fieldId}
            field={field}
            value={formValues[field.fieldId]}
            onChange={onChange}
            error={errors[field.fieldId]}
          />
        ))}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          disabled={isFirst}
        >
          Previous
        </Button>

        {isLast ? (
          <Button
            type="button"
            disabled={!canAdvance}
            onClick={onSubmit}
            data-test-id="submit-form"
          >
            Submit
          </Button>
        ) : (
          <Button
            type="button"
            disabled={!canAdvance}
            onClick={onNext}
            data-test-id="next-section"
          >
            Next
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default FormSection;
