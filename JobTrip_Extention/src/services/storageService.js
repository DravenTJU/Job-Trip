import endpoints from '../config/endpoints.js'

// Function to load last used location
async function loadLastLocation () {
  return new Promise((resolve) => {
    chrome.storage.local.get(['lastLocation', 'lastCountry'], (result) => {
      resolve(result.lastLocation || null)
    })
  })
}

// Function to save last used location
async function saveLastLocation (location) {
  const country = location.split(', ').pop() // Get country from full location
  return chrome.storage.local.set({
    lastLocation: location,
    lastCountry: country
  })
}

// Function to load last used country
async function loadLastCountry () {
  return new Promise((resolve) => {
    chrome.storage.local.get(['lastCountry'], (result) => {
      resolve(result.lastCountry || null)
    })
  })
}

// Function to save the country directly
async function saveLastCountry (country) {
  return chrome.storage.local.set({
    lastCountry: country
  })
}

// Function to load website settings
async function loadWebsiteSettings () {
  const settings = await chrome.storage.sync.get('websiteSettings')
  return settings.websiteSettings || {}
}

// Function to save website settings
async function saveWebsiteSettings (newSettings) {
  return chrome.storage.sync.set({ websiteSettings: newSettings })
}

// Function to update scraping state
async function updateScrapingState (isActive) {
  return chrome.storage.local.set({ isScrapingActive: isActive })
}

// Function to get user token from localStorage (新增抓localstorage功能)////////////
async function getUserToken() {
  const config = await endpoints.detectEnvironment()
  const getLocalstorageTokenUrl = config.FRONTEND.jobtrip_URL
  const getLocalstorageTokenKey = config.FRONTEND.TOKEN_KEY

  return new Promise(async (resolve) => {
    try {
      // 首先查找所有与jobtrip相关的标签页
      const tabs = await chrome.tabs.query({})
      const jobtripTabs = tabs.filter(tab => 
        tab.url && tab.url.includes(getLocalstorageTokenUrl)
      )
      
      if (jobtripTabs.length === 0) {
        console.log('No jobtrip tabs found')
        resolve(null)
        return
      }
      
      // 尝试从每个标签页获取token，直到成功
      for (const tab of jobtripTabs) {
        try {
          const results = await chrome.scripting.executeScript({
            target: {tabId: tab.id},
            function: (tokenKey) => {
              return localStorage.getItem(tokenKey)
            },
            args: [getLocalstorageTokenKey]
          })
          
          if (results && results[0] && results[0].result) {
            console.log('Token found in tab:', tab.url)
            resolve(results[0].result)
            return
          }
        } catch (err) {
          console.warn(`Failed to get token from tab ${tab.id}:`, err)
          // 继续尝试下一个标签页
        }
      }
      
      // 如果所有标签页都没有找到token
      console.log('No token found in any jobtrip tab')
      resolve(null)
    } catch (error) {
      console.error('Error getting user token:', error)
      resolve(null)
    }
  })
}

export default {
  loadLastLocation,
  saveLastLocation,
  loadLastCountry,
  saveLastCountry,
  loadWebsiteSettings,
  saveWebsiteSettings,
  updateScrapingState,
  getUserToken
} 