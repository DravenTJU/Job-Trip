import React from 'react';
import { Link } from 'react-router-dom';
import { BriefcaseIcon } from 'lucide-react';

/**
 * 应用程序页脚组件
 */
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 py-12 mt-auto border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-12">
          <div className="flex flex-col mb-8 md:mb-0">
            <div className="flex items-center space-x-2 mb-4">
              <BriefcaseIcon className="h-6 w-6 text-[#6366F1]" />
              <span className="font-bold text-xl text-gray-800 dark:text-white">JobTrip</span>
            </div>
            <p className="text-gray-500 text-sm max-w-xs mb-4 dark:text-gray-400">
              为求职者提供一站式职业发展解决方案，帮助您高效追踪求职进程并获得理想工作。
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center dark:bg-gray-800">
                <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center dark:bg-gray-800">
                <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center dark:bg-gray-800">
                <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 10h-2v2h2v6h3v-6h1.82l.18-2h-2v-.833c0-.478.096-.667.558-.667h1.442v-2.5h-2.404c-1.798 0-2.596.792-2.596 2.308v1.692z"></path>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center dark:bg-gray-800">
                <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-gray-800 mb-4 dark:text-white">产品</h3>
              <ul className="space-y-2">
                <li><Link to="/jobs" className="text-gray-500 hover:text-gray-700 text-sm dark:text-gray-400 dark:hover:text-white">职位追踪器</Link></li>
                <li><Link to="/resume-builder" className="text-gray-500 hover:text-gray-700 text-sm dark:text-gray-400 dark:hover:text-white">AI简历生成器</Link></li>
                <li><Link to="/cover-letter" className="text-gray-500 hover:text-gray-700 text-sm dark:text-gray-400 dark:hover:text-white">求职信生成器</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-4 dark:text-white">公司</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-500 hover:text-gray-700 text-sm dark:text-gray-400 dark:hover:text-white">关于我们</Link></li>
                <li><Link to="/team" className="text-gray-500 hover:text-gray-700 text-sm dark:text-gray-400 dark:hover:text-white">团队</Link></li>
                <li><Link to="/careers" className="text-gray-500 hover:text-gray-700 text-sm dark:text-gray-400 dark:hover:text-white">工作机会</Link></li>
                <li><Link to="/blog" className="text-gray-500 hover:text-gray-700 text-sm dark:text-gray-400 dark:hover:text-white">博客</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-4 dark:text-white">资源</h3>
              <ul className="space-y-2">
                <li><Link to="/documentation" className="text-gray-500 hover:text-gray-700 text-sm dark:text-gray-400 dark:hover:text-white">文档</Link></li>
                <li><Link to="/guides" className="text-gray-500 hover:text-gray-700 text-sm dark:text-gray-400 dark:hover:text-white">指南</Link></li>
                <li><Link to="/support" className="text-gray-500 hover:text-gray-700 text-sm dark:text-gray-400 dark:hover:text-white">支持</Link></li>
                <li><Link to="/faq" className="text-gray-500 hover:text-gray-700 text-sm dark:text-gray-400 dark:hover:text-white">常见问题</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-4 dark:text-white">法律</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-500 hover:text-gray-700 text-sm dark:text-gray-400 dark:hover:text-white">隐私政策</Link></li>
                <li><Link to="/terms" className="text-gray-500 hover:text-gray-700 text-sm dark:text-gray-400 dark:hover:text-white">使用条款</Link></li>
                <li><Link to="/cookies" className="text-gray-500 hover:text-gray-700 text-sm dark:text-gray-400 dark:hover:text-white">Cookie 政策</Link></li>
                <li><Link to="/gdpr" className="text-gray-500 hover:text-gray-700 text-sm dark:text-gray-400 dark:hover:text-white">GDPR</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0 dark:text-gray-400">
              © {currentYear} JobTrip 职途助手 - 404 Not Found 团队开发
            </p>
            <div className="flex flex-wrap justify-center space-x-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg" alt="Spotify" className="h-5 opacity-70" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" alt="Microsoft" className="h-5 opacity-70" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" alt="IBM" className="h-5 opacity-70" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Uber_logo_2018.svg" alt="Uber" className="h-4 opacity-70" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" alt="Salesforce" className="h-5 opacity-70" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 