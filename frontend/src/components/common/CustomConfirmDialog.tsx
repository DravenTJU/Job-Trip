import React from 'react';

interface CustomConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * 自定义确认对话框组件
 * 使用Tailwind CSS样式，不依赖第三方UI库
 */
const CustomConfirmDialog: React.FC<CustomConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 p-6">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {message}
        </p>
        <div className="flex justify-end gap-2">
          <button 
            onClick={onCancel}
            className="btn btn-outline"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className="btn btn-danger"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomConfirmDialog; 