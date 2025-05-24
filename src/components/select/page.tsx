"use client";

import { SelectProps } from "@/types";
import React from "react";

export default function Select({
    name,
    label,
    options,
    register,
    error,
    rules,
    defaultValue = "",
}: SelectProps) {
    return (
        <div className="mb-1">
            {label && (
                <label htmlFor={name} className="block mb-2 font-medium text-gray-700">
                    {label}
                </label>
            )}
            <select
                id={name}
                {...register(name, rules)}
                defaultValue={defaultValue}
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? `${name}-error` : undefined}
                className={`w-full h-11 px-3 py-2
                    border border-gray-200 rounded-lg
                    shadow-sm
                    text-gray-900 placeholder-gray-400
                    focus:outline-none
                    focus:border-green-500
                    focus:ring-2 focus:ring-green-200
                    transition-all duration-300 ease-in-out
                    appearance-none pr-8
                    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                style={{
                    backgroundImage:
                        `url("data:image/svg+xml;utf8,<svg fill='gray' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.75rem center",
                    backgroundSize: "1rem",
                }}
            >
                <option value="" disabled>
                    Selecione...
                </option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            <p
                id={`${name}-error`}
                className="text-red-600 text-xs min-h-[0.25rem] "
                role="alert"
            >
                {error || "\u00A0"}
            </p>
        </div>
    );
}
