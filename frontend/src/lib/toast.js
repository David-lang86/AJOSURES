import { toast } from 'react-hot-toast';

export const showSuccess = (message) => {
  toast.success(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#0F6E56',
      color: '#E1F5EE',
      borderRadius: '8px',
      fontSize: '14px',
    },
  });
};

export const showError = (message) => {
  toast.error(message || 'Something went wrong. Please try again.', {
    duration: 5000,
    position: 'top-right',
    style: {
      background: '#993C1D',
      color: '#FAECE7',
      borderRadius: '8px',
      fontSize: '14px',
    },
  });
};

export const showInfo = (message) => {
  toast(message, {
    duration: 3000,
    position: 'top-right',
    icon: 'ℹ️',
    style: {
      background: '#185FA5',
      color: '#E6F1FB',
      borderRadius: '8px',
      fontSize: '14px',
    },
  });
};

export const showLoading = (message = 'Processing...') => {
  return toast.loading(message, {
    position: 'top-right',
    style: { borderRadius: '8px', fontSize: '14px' },
  });
};

export const dismissToast = (toastId) => toast.dismiss(toastId);
