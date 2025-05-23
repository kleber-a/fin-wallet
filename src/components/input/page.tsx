"use client"

import { RegisterOptions, UseFormRegister } from "react-hook-form";

interface InputProps {
  type: string;
  placeholder: string;
  name: string;
  label?: string;
  register: UseFormRegister<any>;
  error?: string;
  rules?: RegisterOptions;
}

export default function Input({
  name,
  placeholder,
  type,
  register,
  rules,
  error,
  label,
}: InputProps) {
  return (
//   <div className="mb-4">
//   {label && (
//     <label htmlFor={name} className="block mb-1 font-medium">
//       {label}
//     </label>
//   )}
//   <input
//     className="w-full border-2 rounded-md h-11 px-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//     placeholder={placeholder}
//     type={type}
//     {...register(name, rules)}
//     id={name}
//   />
//   <p className="text-red-500 text-sm mt-1 min-h-[1.25rem]">
//     {error || "\u00A0"}
//   </p>
// </div>

  <div className="mb-5">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full h-11 px-3 py-2 
          border border-gray-200 rounded-lg 
          text-gray-900 placeholder-gray-400 
          focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 
          transition-all duration-200 
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} `}
        placeholder={placeholder}
        type={type}
        {...register(name, rules)}
        id={name}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      <p id={`${name}-error`} className="text-red-600 text-xs mt-1 min-h-[1.25rem]">
        {error || "\u00A0"}
      </p>
    </div>
  );
}
