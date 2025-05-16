import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/landing/Navbar';
import HeroBanner from '@/components/landing/HeroBanner';
import ClientLogos from '@/components/landing/ClientLogos';
import FeatureSection from '@/components/landing/FeatureSection';
import Testimonial from '@/components/landing/Testimonial';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

/**
 * 滚动背景色过渡自定义Hook
 * 根据当前可见的FeatureSection组件确定背景色
 */
const useScrollBackgroundColor = (featuresCount: number) => {
  // 定义背景色数组 - 使用低饱和度协调色系
  const scrollColors = [
    'bg-indigo-200 dark:bg-indigo-800/50',
    'bg-sky-200 dark:bg-sky-800/50',
    'bg-violet-200 dark:bg-violet-800/50',
    'bg-purple-200 dark:bg-purple-800/50',
    'bg-fuchsia-200 dark:bg-fuchsia-800/50',
    'bg-rose-200 dark:bg-rose-800/50',
  ];

  // 确保有足够的颜色
  if (featuresCount > scrollColors.length) {
    console.warn('Not enough background colors defined for features count');
  }

  // 当前活跃特性索引
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  // 观察器参考
  const observerRefs = useRef<(HTMLDivElement | null)[]>(Array(featuresCount).fill(null));

  // 设置Intersection Observer
  useEffect(() => {
    // 观察者选项
    const options = {
      root: null, // 使用视口作为根
      rootMargin: '0px',
      threshold: 1, // 当元素100%可见时触发回调
    };

    // 创建观察者实例
    const observers = observerRefs.current.map((_, index) => {
      return new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          // 当元素进入视口
          if (entry.isIntersecting) {
            setActiveFeatureIndex(index);
          }
        });
      }, options);
    });

    // 开始观察每个特性节点
    observerRefs.current.forEach((ref, index) => {
      if (ref && observers[index]) {
        observers[index].observe(ref);
      }
    });

    // 清理函数
    return () => {
      observers.forEach((observer, index) => {
        if (observerRefs.current[index]) {
          observer.disconnect();
        }
      });
    };
  }, [featuresCount]);

  // 返回当前背景色类名和ref设置函数
  return {
    currentBgColor: scrollColors[activeFeatureIndex % scrollColors.length],
    setRef: (index: number) => (node: HTMLDivElement | null) => {
      observerRefs.current[index] = node;
    }
  };
};

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

  // 使用自定义hook
  const { currentBgColor, setRef } = useScrollBackgroundColor(features.length);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      <HeroBanner />
      {/* <ClientLogos /> */}
      
      <div className={`py-12 md:py-20 transition-colors duration-500 ${currentBgColor}`}>
        {features.map((feature, index) => (
          <div key={feature.id} ref={setRef(index)}>
            <FeatureSection 
              {...feature}
              imagePosition={index % 2 === 0 ? 'right' : 'left'}
            />
          </div>
        ))}
      </div>
      
      <Testimonial />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage; 