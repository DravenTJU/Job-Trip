import endpoints from './endpoints.js'

// Configuration for the Jobtip extension
const config = {
  // Development environment
  development: {
    baseUrl: endpoints.DEV_CONFIG.FRONTEND.BASE_URL
  },
  // Production environment ，擴展程序中的各種功能（如發送工作數據、檢查版本更新等）會基於這個URL構建完整的API請求地址
  production: {
    baseUrl: endpoints.PROD_CONFIG.FRONTEND.BASE_URL
  }
}

async function getBaseUrl () {
  try {
    const environment = await endpoints.detectEnvironment()
    return environment.FRONTEND.BASE_URL
  } catch (error) {
    console.log('Error checking environment, defaulting to production:', error)
    return endpoints.PROD_CONFIG.FRONTEND.BASE_URL
  }
}

export default {
  getBaseUrl
} 