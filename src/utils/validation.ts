export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: string | number) => boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export const validateField = (
  value: string | number | undefined | null,
  rules: ValidationRule,
  fieldName: string = 'Campo'
): ValidationResult => {
  if (rules.required && (!value || value === '' || value === 0)) {
    return {
      isValid: false,
      errorMessage: `${fieldName} es requerido`,
    };
  }

  if (!value && !rules.required) {
    return { isValid: true };
  }

  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      return {
        isValid: false,
        errorMessage: `${fieldName} debe tener al menos ${rules.minLength} caracteres`,
      };
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return {
        isValid: false,
        errorMessage: `${fieldName} no puede tener más de ${rules.maxLength} caracteres`,
      };
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return {
        isValid: false,
        errorMessage: `${fieldName} no tiene un formato válido`,
      };
    }
  }

  if (typeof value === 'number' || !isNaN(Number(value))) {
    const numValue = Number(value);

    if (rules.min !== undefined && numValue < rules.min) {
      return {
        isValid: false,
        errorMessage: `${fieldName} debe ser mayor o igual a ${rules.min}`,
      };
    }

    if (rules.max !== undefined && numValue > rules.max) {
      return {
        isValid: false,
        errorMessage: `${fieldName} debe ser menor o igual a ${rules.max}`,
      };
    }
  }

  if (rules.custom && value !== undefined && value !== null && !rules.custom(value)) {
    return {
      isValid: false,
      errorMessage: `${fieldName} no es válido`,
    };
  }

  return { isValid: true };
};

export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/.+/,
  phone: /^\+?[\d\s-()]+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
};

export const VALIDATION_RULES = {
  email: {
    required: true,
    pattern: VALIDATION_PATTERNS.email,
  },
  password: {
    required: true,
    minLength: 6,
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  productName: {
    required: true,
    minLength: 3,
    maxLength: 50,
  },
  price: {
    required: true,
    min: 1,
  },
  stock: {
    required: true,
    min: 1,
  },
  imageUrl: {
    required: true,
    pattern: VALIDATION_PATTERNS.url,
  },
};
