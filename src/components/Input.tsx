import { type InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  showError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, showError = false, className = '', ...props }, ref) => {
    const hasError = showError && error;

    return (
      <div className="group relative z-0 transition-all">
        <input
          ref={ref}
          className={`peer block w-full appearance-none border-0 border-b-2 ${
            hasError ? 'border-red-600' : 'border-gray-300'
          } bg-transparent px-0 py-2.5 text-gray-900 focus:border-indigo-600 focus:outline-none focus:ring-0 ${className}`}
          placeholder=" "
          {...props}
        />
        <label
          htmlFor={props.id}
          className={`absolute top-3 -z-10 origin-left -translate-y-6 scale-75 transform duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 ${
            hasError
              ? 'text-red-600'
              : 'text-gray-500 peer-focus:text-indigo-600'
          }`}
        >
          {label}
        </label>
        {hasError && (
          <span className="mt-1 block text-sm text-red-600">{error}</span>
        )}
      </div>
    );
  }
);
