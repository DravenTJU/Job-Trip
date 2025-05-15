import React from 'react';
import { Link } from 'react-router-dom';

interface FeatureSectionProps {
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  imagePosition: 'left' | 'right';
}

const FeatureSection: React.FC<FeatureSectionProps> = ({
  title,
  description,
  imageUrl,
  buttonText,
  buttonLink,
  imagePosition
}) => {
  return (
    <div className="py-16 container-lg">
      <div className={`flex flex-col ${imagePosition === 'right' ? 'md:flex-row' : 'md:flex-row-reverse'} md:items-center gap-12`}>
        <div className="flex-1">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            {description}
          </p>
          <Link
            to={buttonLink}
            className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors"
          >
            {buttonText}
          </Link>
        </div>
        <div className="flex-1">
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 p-1">
            <img
              src={imageUrl}
              alt={title}
              className="w-full rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection; 