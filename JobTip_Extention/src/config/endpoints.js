// 開發環境配置
const DEV_CONFIG = {
  // 前端服務器配置
  FRONTEND: {
    BASE_URL: 'http://localhost:3000',
    // 用於檢查 Jobtip 網站是否開啟
    JOBTIP_URL: 'http://localhost:3000',
    // 用於獲取 localStorage 中的 token
    TOKEN_KEY: 'token'
  },
  // 後端 API 配置
  BACKEND: {
    BASE_URL: 'http://localhost:5000',
    API_ENDPOINT: 'http://localhost:5000/api/jobs',
    BATCH_ENDPOINT: 'http://localhost:5000/api/jobs/batch'
  }
}


// 生產環境配置
const PROD_CONFIG = {
  FRONTEND: {
    BASE_URL: 'https://jobtip.com/',
    JOBTIP_URL: 'jobtip.com',
    TOKEN_KEY: 'token'
  },
  BACKEND: {
    BASE_URL: 'https://api.jobtip.com',
    API_ENDPOINT: 'https://api.jobtip.com/api/jobs',
    BATCH_ENDPOINT: 'https://api.jobtip.com/api/jobs/batch'
  }
}

// 環境檢測函數
async function detectEnvironment() {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 1000)

    try {
      await fetch(DEV_CONFIG.FRONTEND.BASE_URL, {
        signal: controller.signal,
        mode: 'no-cors'
      })
      clearTimeout(timeoutId)
      console.log('Development environment detected')
      return DEV_CONFIG
    } catch (error) {
      clearTimeout(timeoutId)
      console.log('Production environment detected')
      return PROD_CONFIG
    }
  } catch (error) {
    console.log('Error checking environment, defaulting to production:', error)
    return PROD_CONFIG
  }
}

export default {
  detectEnvironment,
  DEV_CONFIG,
  PROD_CONFIG
} 