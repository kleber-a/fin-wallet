import { RegisterOptions, UseFormRegister } from "react-hook-form";

export interface Cards {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export interface User {
    email: string;
    name: string;
    wallet: number;
    _id: string;
}

export interface DashboardHeaderProps {
    heading: string
    text?: string
}

export interface InputProps {
  type: string;
  placeholder: string;
  name: string;
  label?: string;
  register: UseFormRegister<any>;
  error?: string;
  rules?: RegisterOptions;
}

export interface Transaction {
  _id: string;
  type: string;
  from: string | null;
  to: string;
  amount: number;
  description: string;
  status: string;
  createdAt: Date;
}


export interface Option {
  value: string;
  label: string;
}

export interface SelectProps {
  name: string;
  label?: string;
  options: Option[];
  register: any;
  error?: string;
  rules?: object;
  defaultValue?: string;
}

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
};

export type FormData = {
    name: string;
};
