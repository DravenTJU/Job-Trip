// 開發環境配置
const DEV_CONFIG = {
  // 前端服務器配置
  FRONTEND: {
    BASE_URL: 'http://localhost:3000',
    // 用於檢查 jobtrip 網站是否開啟
    jobtrip_URL: 'http://localhost:3000',
    // 用於獲取 localStorage 中的 token
    TOKEN_KEY: 'token'
  },
  // 後端 API 配置
  BACKEND: {
    BASE_URL: 'http://localhost:5001',
    API_ENDPOINT: 'http://localhost:5001/api/v1/jobs'
  }
}


// 生產環境配置
const PROD_CONFIG = {
  FRONTEND: {
    BASE_URL: 'https://jobtrip.draven.best/',
    jobtrip_URL: 'jobtrip.draven.best',
    TOKEN_KEY: 'token'
  },
  BACKEND: {
    BASE_URL: 'https://jobtrip.draven.best',
    API_ENDPOINT: 'https://jobtrip.draven.best/api/v1/jobs'
  }
}

// 環境檢測函數
async function detectEnvironment() {
  // 检查当前URL是否为生产环境
  if (typeof window !== 'undefined' && window.location && 
      window.location.hostname.includes('draven.best')) {
    console.log('Production domain detected')
    return PROD_CONFIG
  }
  
  // 检查所有标签页是否包含生产环境URL
  try {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      const tabs = await chrome.tabs.query({})
      const prodTabExists = tabs.some(tab => 
        tab.url && tab.url.includes('jobtrip.draven.best')
      )
      
      if (prodTabExists) {
        console.log('Production environment detected (tab found)')
        return PROD_CONFIG
      } else {
        console.log('Development environment detected (no prod tabs)')
        return DEV_CONFIG
      }
    }
  } catch (error) {
    console.log('Error checking tabs, defaulting to production:', error)
  }
  
  // 默认返回生产环境配置
  console.log('Defaulting to production config')
  return PROD_CONFIG
}

export default {
  detectEnvironment,
  DEV_CONFIG,
  PROD_CONFIG
} 