import React from 'react';

interface Step {
  title: string;
  description: string;
}

interface WizardStepsProps {
  steps: Step[];
  currentStep: number;
}

const WizardSteps: React.FC<WizardStepsProps> = ({ steps, currentStep }) => {
  return (
    <div className="overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="步骤导航">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                index === currentStep
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : index < currentStep
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400'
              }`}
            >
              <div className="flex items-center">
                <span className={`mr-2 flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                  index === currentStep 
                    ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400'
                    : index < currentStep
                    ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {index < currentStep ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </span>
                {step.title}
              </div>
            </div>
          ))}
        </nav>
      </div>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {steps[currentStep].description}
      </p>
    </div>
  );
};

export default WizardSteps; 