import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { JOB_STATUS_OPTIONS, getStatusStyle, getStatusIcon } from '@/utils/jobStatusUtils';
import { createPortal } from 'react-dom';

interface StatusSelectProps {
  value: string;
  onChange: (value: string) => void;
  name?: string;
  className?: string;
  error?: string;
  includeAllOption?: boolean;
}

interface ListboxRenderPropArg {
  open: boolean;
}

interface OptionRenderPropArg {
  selected: boolean;
  active: boolean;
}

/**
 * 自定义状态选择组件
 * 使用Headless UI的Listbox实现带图标的下拉选择
 */
const StatusSelect: React.FC<StatusSelectProps> = ({ 
  value, 
  onChange, 
  name, 
  className = '',
  error,
  includeAllOption = false
}) => {
  // 构建选项列表，包括可选的"所有状态"选项
  const options = includeAllOption 
    ? [{ value: '', label: '所有状态', icon: 'Filter' }, ...JOB_STATUS_OPTIONS]
    : JOB_STATUS_OPTIONS;
  
  // 查找当前选中的选项
  const selectedOption = options.find(option => option.value === value) || options[0];
  
  // 获取选项对应的图标组件
  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;
    return <Icon className="w-4 h-4" />;
  };
  
  // 获取选项的样式类名
  const getOptionStyleClass = (optionValue: string) => {
    // 对于"所有状态"选项，使用默认样式
    if (optionValue === '') {
      return 'badge-default';
    }
    return getStatusStyle(optionValue);
  };

  return (
    <div className={`relative ${className}`}>
      <Listbox value={value} onChange={onChange} name={name}>
        {({ open }: ListboxRenderPropArg) => (
          <>
            <Listbox.Button 
              className={`relative w-full h-11 pl-4 pr-10 text-left bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ${
                error 
                  ? 'ring-red-500 focus:ring-red-500' 
                  : 'ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500'
              } transition-shadow flex items-center`}
              aria-label="选择职位状态"
              aria-haspopup="listbox"
            >
              <span className={`inline-flex items-center rounded-full pl-1 pr-3 py-1 ${getOptionStyleClass(selectedOption.value)}`}>
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 mr-1.5">
                  {getIconComponent(selectedOption.icon)}
                </span>
                <span className="truncate font-medium">
                  {selectedOption.label}
                </span>
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown
                  className="w-5 h-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            
            {open && createPortal(
              <Transition
                show={true}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options 
                  className="fixed z-[9999] py-2 mt-1 overflow-auto text-base bg-white dark:bg-gray-800 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60"
                  style={{
                    width: document.querySelector('[aria-label="选择职位状态"]')?.getBoundingClientRect().width + 'px',
                    top: (document.querySelector('[aria-label="选择职位状态"]')?.getBoundingClientRect().bottom || 0) + 4 + 'px',
                    left: document.querySelector('[aria-label="选择职位状态"]')?.getBoundingClientRect().left + 'px'
                  }}
                >
                  {options.map((option) => (
                    <Listbox.Option
                      key={option.value}
                      className={({ active }: OptionRenderPropArg) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-indigo-50 dark:bg-indigo-900/20' : 
                          'bg-transparent'
                        }`
                      }
                      value={option.value}
                    >
                      {({ selected, active }: OptionRenderPropArg) => (
                        <>
                          <span className={`inline-flex items-center rounded-full pl-1 pr-3 py-1 ${getOptionStyleClass(option.value)}`}>
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 mr-1.5">
                              {getIconComponent(option.icon)}
                            </span>
                            <span className={`truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                              {option.label}
                            </span>
                          </span>
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
              </Transition>,
              document.body
            )}
          </>
        )}
      </Listbox>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default StatusSelect; 