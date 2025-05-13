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
    API_ENDPOINT: 'http://localhost:5001/api/v1/jobs',
    BATCH_ENDPOINT: 'http://localhost:5001/api/v1/jobs/batch'
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
    BASE_URL: 'https://api.jobtrip.draven.best',
    API_ENDPOINT: 'https://api.jobtrip.draven.best/api/v1/jobs',
    BATCH_ENDPOINT: 'https://api.jobtrip.draven.best/api/v1/jobs/batch'
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