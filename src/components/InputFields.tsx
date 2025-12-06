import React from 'react';
import { type LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
}

export const TextInput: React.FC<InputProps> = ({ label, icon: Icon, className, ...props }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
      {Icon && <Icon size={16} className="text-gaming-500" />}
      {label}
    </label>
    <input
      className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-gaming-500 focus:border-transparent outline-none transition-all placeholder-slate-500"
      {...props}
    />
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
  icon?: LucideIcon;
}

export const SelectInput: React.FC<SelectProps> = ({ label, options, icon: Icon, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
      {Icon && <Icon size={16} className="text-gaming-500" />}
      {label}
    </label>
    <div className="relative">
      <select
        className="w-full appearance-none bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-gaming-500 focus:border-transparent outline-none transition-all cursor-pointer"
        {...props}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  </div>
);

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, className, ...props }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="text-sm font-semibold text-gray-300">{label}</label>
    <textarea
      className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-gaming-500 focus:border-transparent outline-none transition-all placeholder-slate-500 min-h-[100px]"
      {...props}
    />
  </div>
);