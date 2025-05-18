import React, { useState, useEffect } from 'react';
import { Check, X, AlertTriangle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  duration?: number;
  onClose?: () => void;
}

/**
 * 显示通知消息的Toast组件
 */
const Toast: React.FC<ToastProps> = ({ 
  type = 'info', 
  message, 
  duration = 3000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check className="h-5 w-5 text-white" />;
      case 'error':
        return <X className="h-5 w-5 text-white" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-white" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-white" />;
    }
  };

  const getStyles = () => {
    const baseStyles = 'fixed top-4 right-4 flex items-center shadow-lg rounded-lg px-4 py-3 transition-all duration-300 z-50';
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-500`;
      case 'error':
        return `${baseStyles} bg-red-500`;
      case 'warning':
        return `${baseStyles} bg-yellow-500`;
      case 'info':
      default:
        return `${baseStyles} bg-blue-500`;
    }
  };

  return (
    <div className={getStyles()}>
      <div className="p-1 rounded-full bg-opacity-25 bg-white mr-3">
        {getIcon()}
      </div>
      <p className="text-white">{message}</p>
      <button 
        onClick={() => {
          setIsVisible(false);
          if (onClose) onClose();
        }}
        className="ml-4 p-1 hover:bg-white hover:bg-opacity-20 rounded-full"
      >
        <X className="h-4 w-4 text-white" />
      </button>
    </div>
  );
};

export default Toast; 