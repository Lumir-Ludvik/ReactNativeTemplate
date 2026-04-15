import { Toast, ToastDescription, ToastTitle, useToast } from '@/../components/ui/toast';
import { useRef } from 'react';

type ToastOptions = {
  title: string;
  description?: string;
  action?: 'success' | 'error' | 'warning' | 'info';
  placement?: 'top' | 'bottom';
  duration?: number;
};

export function useAppToast() {
  const toast = useToast();

  const toastIdRef = useRef(0);

  const show = (options: ToastOptions) => {
    if (toast.isActive(toastIdRef.current.toString())) {
      return;
    }

    const { 
      title, 
      description, 
      action = 'success', 
      placement = 'top', 
      duration = 4000 
    } = options;

    toastIdRef.current += 1;
    const newId = toastIdRef.current;

    toast.show({
      id: newId.toString(),
      placement,
      duration,
      render: ({ id }) => (
        <Toast nativeID={`toast-${id}`} action={action} variant="solid">
          <ToastTitle>{title}</ToastTitle>
          {description && <ToastDescription>{description}</ToastDescription>}
        </Toast>
      ),
    });
  };

  return { show };
}