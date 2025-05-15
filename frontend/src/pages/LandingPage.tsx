import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/landing/Navbar';
import HeroBanner from '@/components/landing/HeroBanner';
import ClientLogos from '@/components/landing/ClientLogos';
import FeatureSection from '@/components/landing/FeatureSection';
import Testimonial from '@/components/landing/Testimonial';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

const LandingPage: React.FC = () => {
  const { t } = useTranslation('landing');
  
  const features = [
    {
      id: 'chrome-extension',
      title: t('features.extension.title'),
      description: t('features.extension.description'),
      imageUrl: '/assets/images/landing/chrome-extension.png',
      buttonText: t('features.extension.button'),
      buttonLink: '/download',
      imagePosition: 'right'
    },
    {
      id: 'job-list',
      title: t('features.jobList.title'),
      description: t('features.jobList.description'),
      imageUrl: '/assets/images/landing/job-list.png',
      buttonText: t('features.jobList.button'),
      buttonLink: '/jobs',
      imagePosition: 'left'
    },
    {
      id: 'tracking',
      title: t('features.tracking.title'),
      description: t('features.tracking.description'),
      imageUrl: '/assets/images/landing/kanban-board.png',
      buttonText: t('features.tracking.button'),
      buttonLink: '/dashboard',
      imagePosition: 'right'
    },
    {
      id: 'profile',
      title: t('features.profile.title'),
      description: t('features.profile.description'),
      imageUrl: '/assets/images/landing/profile-form.png',
      buttonText: t('features.profile.button'),
      buttonLink: '/profile',
      imagePosition: 'left'
    },
    {
      id: 'resume',
      title: t('features.resume.title'),
      description: t('features.resume.description'),
      imageUrl: '/assets/images/landing/resume-builder.png',
      buttonText: t('features.resume.button'),
      buttonLink: '/resume',
      imagePosition: 'right'
    },
    {
      id: 'coverLetter',
      title: t('features.coverLetter.title'),
      description: t('features.coverLetter.description'),
      imageUrl: '/assets/images/landing/cover-letter.png',
      buttonText: t('features.coverLetter.button'),
      buttonLink: '/cover-letter',
      imagePosition: 'left'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      <HeroBanner />
      {/* <ClientLogos /> */}
      
      <div className="py-12 md:py-20">
        {features.map((feature, index) => (
          <FeatureSection 
            key={feature.id}
            {...feature}
            imagePosition={index % 2 === 0 ? 'right' : 'left'}
          />
        ))}
      </div>
      
      <Testimonial />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage; 