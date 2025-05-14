import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// 支持的语言列表
export const supportedLanguages = {
  'en-US': 'English',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文'
};

// 默认语言
export const defaultLanguage = 'en-US';

// 初始化i18next
i18n
  // 加载翻译文件的后端
  .use(Backend)
  // 检测用户语言
  .use(LanguageDetector)
  // 将i18n实例传递给react-i18next
  .use(initReactI18next)
  // 初始化i18next
  .init({
    // 可用语言
    supportedLngs: Object.keys(supportedLanguages),
    // 默认语言
    fallbackLng: defaultLanguage,
    // 调试模式
    debug: process.env.NODE_ENV === 'development',
    // 翻译文件加载配置
    backend: {
      // 加载路径
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    // 默认命名空间
    defaultNS: 'common',
    // 使用的命名空间
    ns: ['common', 'auth', 'profile', 'jobs'],
    // 插值配置
    interpolation: {
      // 转义输出，防止XSS攻击
      escapeValue: false, 
    },
    // 检测语言配置
    detection: {
      // 存储选项
      order: ['localStorage', 'cookie', 'navigator'],
      // 缓存用户语言选择
      caches: ['localStorage', 'cookie'],
    },
    // 用于在开发中禁用暂未翻译的文本
    react: { 
      useSuspense: true 
    }
  });

// 导出i18n实例
export default i18n; 