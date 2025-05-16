import React, { Fragment, useRef, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';

// 定义选项类型，至少需要id和label
export interface SelectOption {
  id: string | number;
  label: string;
  icon?: string;
  [key: string]: any; // 允许其他自定义属性
}

interface GenericListboxProps<T extends SelectOption> {
  // 基本属性
  options: T[];
  value: T | null;
  onChange: (value: T | null) => void;
  placeholder?: string;
  label?: string;
  // 自定义渲染函数
  renderOption?: (option: T, active: boolean, selected: boolean) => React.ReactNode;
  renderButtonLabel?: (selectedOption: T | null) => React.ReactNode;
  // 样式和状态
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  optionsClassName?: string;
  optionClassName?: string;
  // 表单属性
  name?: string;
  required?: boolean;
  error?: string;
  // 其他功能
  usePortal?: boolean;
  ariaLabel?: string;
}

interface ListboxRenderPropArg {
  open: boolean;
}

interface OptionRenderPropArg {
  selected: boolean;
  active: boolean;
}

/**
 * 通用下拉选择组件
 * 基于Headless UI的Listbox实现可定制的下拉选择功能
 */
function GenericListbox<T extends SelectOption>({
  options,
  value,
  onChange,
  placeholder = '请选择',
  label,
  renderOption,
  renderButtonLabel,
  disabled = false,
  className = '',
  buttonClassName = '',
  optionsClassName = '',
  optionClassName = '',
  name,
  required,
  error,
  usePortal = true,
  ariaLabel,
}: GenericListboxProps<T>) {
  const { t } = useTranslation();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [buttonPosition, setButtonPosition] = useState<{width: number; top: number; left: number} | null>(null);
  
  // 查找当前选中的选项
  const selectedOption = value || null;
  
  // 更新按钮位置
  const updateButtonPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        width: rect.width,
        top: rect.bottom + window.scrollY + 4, // 添加4px的间距
        left: rect.left + window.scrollX
      });
    }
  };
  
  // 渲染下拉选项列表
  const renderListboxOptions = () => (
    <Transition
      as={Fragment}
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      afterEnter={updateButtonPosition} // 动画完成后再次更新位置，确保位置准确
    >
      <Listbox.Options 
        className={`z-[9999] py-2 mt-1 overflow-auto text-base bg-white dark:bg-gray-800 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 ${
          usePortal ? 'fixed' : 'absolute'
        } ${optionsClassName}`}
        style={usePortal && buttonPosition ? {
          width: buttonPosition.width + 'px',
          top: buttonPosition.top + 'px',
          left: buttonPosition.left + 'px'
        } : undefined}
      >
        {options.map((option) => (
          <Listbox.Option
            key={option.id}
            className={({ active }: OptionRenderPropArg) =>
              `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                active ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'bg-transparent'
              } ${optionClassName}`
            }
            value={option}
          >
            {({ selected, active }: OptionRenderPropArg) => (
              <>
                {renderOption ? (
                  renderOption(option, active, selected)
                ) : (
                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                    {option.label}
                  </span>
                )}
                {selected ? (
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600 dark:text-indigo-400">
                    <Check className="w-5 h-5" aria-hidden="true" />
                  </span>
                ) : null}
              </>
            )}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Transition>
  );

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <Listbox 
        value={selectedOption} 
        onChange={onChange} 
        name={name}
        disabled={disabled}
      >
        {({ open }: ListboxRenderPropArg) => {
          // 打开时更新按钮位置
          useEffect(() => {
            if (open) {
              updateButtonPosition();
              
              // 添加窗口大小改变监听
              window.addEventListener('resize', updateButtonPosition);
              window.addEventListener('scroll', updateButtonPosition, true);
              
              return () => {
                window.removeEventListener('resize', updateButtonPosition);
                window.removeEventListener('scroll', updateButtonPosition, true);
              };
            }
          }, [open]);
          
          return (
            <div>
              <Listbox.Button 
                ref={buttonRef}
                className={`relative w-full h-11 pl-4 pr-10 text-left bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ${
                  error 
                    ? 'ring-red-500 focus:ring-red-500' 
                    : 'ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500'
                } transition-shadow flex items-center ${
                  disabled ? 'opacity-60 cursor-not-allowed' : ''
                } ${buttonClassName}`}
                aria-label={ariaLabel}
                aria-haspopup="listbox"
              >
                {renderButtonLabel ? (
                  renderButtonLabel(selectedOption)
                ) : (
                  <span className="block truncate">
                    {selectedOption?.label || placeholder}
                  </span>
                )}
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown
                    className="w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              
              {open && usePortal && buttonPosition ? 
                createPortal(renderListboxOptions(), document.body) : 
                open ? renderListboxOptions() : null}
            </div>
          );
        }}
      </Listbox>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export default GenericListbox; 