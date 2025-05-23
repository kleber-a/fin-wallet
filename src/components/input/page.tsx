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
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block mb-1 font-medium">
          {label}
        </label>
      )}
      <input
        className="w-full border-2 rounded-md h-11 px-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder={placeholder}
        type={type}
        {...register(name, rules)}
        id={name}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
