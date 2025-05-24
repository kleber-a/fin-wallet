"use client"

import { InputProps } from "@/types";

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

    <div className="mb-1">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
      className={`w-full h-11 px-3 py-2
      border border-gray-200 rounded-lg /* Borda sutil no estado normal */
      shadow-sm /* Sombra discreta para suavizar */
      text-gray-900 placeholder-gray-400
      focus:outline-none 
      focus:border-green-500 
     focus:ring-2 focus:ring-green-200
      transition-all duration-300 ease-in-out /* Transições mais suaves */
      ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''} `}
        placeholder={placeholder}
        type={type}
        {...register(name, rules)}
        id={name}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      <p id={`${name}-error`} className="text-red-600 text-xs min-h-[0.25rem] ">
        {error || "\u00A0"}
      </p>
    </div>
  );
}
