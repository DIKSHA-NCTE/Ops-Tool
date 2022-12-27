import { ToastType } from './toaster.type';

export interface Toast {
  type: ToastType;
  title: string;
  body: string;
  delay: number;
}