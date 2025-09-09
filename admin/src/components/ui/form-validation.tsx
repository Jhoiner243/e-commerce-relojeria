"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

interface ValidationRule {
  test: (value: unknown) => boolean;
  message: string;
  type: 'error' | 'warning' | 'info';
}

interface FormValidationProps {
  value: unknown;
  rules: ValidationRule[];
  showSuccess?: boolean;
  successMessage?: string;
  className?: string;
}

export const FormValidation = ({
  value,
  rules,
  showSuccess = false,
  successMessage = "Campo válido",
  className = "",
}: FormValidationProps) => {
  const validationResults = rules.map(rule => ({
    ...rule,
    isValid: rule.test(value),
  }));

  const errors = validationResults.filter(result => !result.isValid && result.type === 'error');
  const warnings = validationResults.filter(result => !result.isValid && result.type === 'warning');
  const infos = validationResults.filter(result => !result.isValid && result.type === 'info');
  const isValid = errors.length === 0;

  if (!isValid || warnings.length > 0 || infos.length > 0 || (showSuccess && isValid)) {
    return (
      <div className={`space-y-2 ${className}`}>
        {/* Errores */}
        {errors.map((error, index) => (
          <Alert key={index} variant="destructive" className="py-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {error.message}
            </AlertDescription>
          </Alert>
        ))}

        {/* Advertencias */}
        {warnings.map((warning, index) => (
          <Alert key={index} variant="default" className="py-2 border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-sm text-yellow-800">
              {warning.message}
            </AlertDescription>
          </Alert>
        ))}

        {/* Informaciones */}
        {infos.map((info, index) => (
          <Alert key={index} variant="default" className="py-2 border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm text-blue-800">
              {info.message}
            </AlertDescription>
          </Alert>
        ))}

        {/* Éxito */}
        {showSuccess && isValid && (
          <Alert variant="default" className="py-2 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-sm text-green-800">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  return null;
};

// Utilidades para crear reglas de validación comunes
export const validationRules = {
  required: (message = "Este campo es obligatorio"): ValidationRule => ({
    test: (value) => value !== null && value !== undefined && value !== "",
    message,
    type: 'error',
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    test: (value) => !value || value.length >= min,
    message: message || `Debe tener al menos ${min} caracteres`,
    type: 'error',
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    test: (value) => !value || value.length <= max,
    message: message || `No puede tener más de ${max} caracteres`,
    type: 'error',
  }),

  min: (min: number, message?: string): ValidationRule => ({
    test: (value) => !value || Number(value) >= min,
    message: message || `El valor debe ser mayor o igual a ${min}`,
    type: 'error',
  }),

  max: (max: number, message?: string): ValidationRule => ({
    test: (value) => !value || Number(value) <= max,
    message: message || `El valor debe ser menor o igual a ${max}`,
    type: 'error',
  }),

  email: (message = "Debe ser un email válido"): ValidationRule => ({
    test: (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message,
    type: 'error',
  }),

  url: (message = "Debe ser una URL válida"): ValidationRule => ({
    test: (value) => !value || /^https?:\/\/.+/.test(value),
    message,
    type: 'error',
  }),

  positiveNumber: (message = "Debe ser un número positivo"): ValidationRule => ({
    test: (value) => !value || Number(value) > 0,
    message,
    type: 'error',
  }),

  fileSize: (maxSizeMB: number, message?: string): ValidationRule => ({
    test: (value) => !value || !(value instanceof File) || value.size <= maxSizeMB * 1024 * 1024,
    message: message || `El archivo no puede ser mayor a ${maxSizeMB}MB`,
    type: 'error',
  }),

  fileType: (allowedTypes: string[], message?: string): ValidationRule => ({
    test: (value) => !value || !(value instanceof File) || allowedTypes.includes(value.type),
    message: message || `Solo se permiten archivos: ${allowedTypes.join(', ')}`,
    type: 'error',
  }),

  // Reglas de advertencia
  warning: (test: (value: unknown) => boolean, message: string): ValidationRule => ({
    test,
    message,
    type: 'warning',
  }),

  // Reglas informativas
  info: (test: (value: unknown) => boolean, message: string): ValidationRule => ({
    test,
    message,
    type: 'info',
  }),
};
