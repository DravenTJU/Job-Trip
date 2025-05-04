import endpoints from '../config/endpoints.js'

// Function to check if jobtrip tab exists and is ready
async function findjobtripTab () {
  const config = await endpoints.detectEnvironment()
  const tabs = await chrome.tabs.query({})
  return tabs.find(tab =>
    tab.url && tab.url.includes(config.FRONTEND.jobtrip_URL)
  )
}

// Function to ensure jobtrip website is open
async function ensurejobtripWebsite (shouldFocusPopup = true) {
  console.group('ensurejobtripWebsite')
  try {
    const existingTab = await findjobtripTab()
    console.log('Existing jobtrip tab:', existingTab)

    if (!existingTab) {
      console.log('No existing tab found, creating new tab')
      try {
        // Get base URL and open new tab / 獲取基礎URL並打開新標籤 /////////////////////////
        const baseUrl = await chrome.runtime.sendMessage({ action: 'getBaseUrl' })
        console.log('Got base URL:', baseUrl)

        if (!baseUrl) {
          throw new Error('Failed to get jobtrip URL - base URL is undefined')
        }

        const manifest = chrome.runtime.getManifest()
        //跳出擴充功能頁面/////////////////////////
        const url = `${baseUrl}/login`
        console.log('Opening jobtrip URL:', url)

        const tab = await chrome.tabs.create({
          url: url,
          active: true
        })
        console.log('Created new tab:', tab)

        // Wait for tab to load
        console.log('Waiting for tab to load...')
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            chrome.tabs.onUpdated.removeListener(listener)
            reject(new Error('Timeout waiting for tab to load'))
          }, 10000) // 10 second timeout

          const listener = function (tabId, info) {
            console.log('Tab update event:', { tabId, info })
            if (tabId === tab.id && info.status === 'complete') {
              console.log('Tab loaded successfully')
              chrome.tabs.onUpdated.removeListener(listener)
              clearTimeout(timeout)
              setTimeout(() => {
                if (shouldFocusPopup) {
                  // Get the popup window and focus it
                  chrome.windows.getCurrent(window => {
                    chrome.windows.update(window.id, { focused: true })
                  })
                }
                resolve(tab)
              }, 1000) // Give extra time for scripts to initialize
            }
          }
          chrome.tabs.onUpdated.addListener(listener)
        })
        console.log('Tab fully loaded')
        return tab
      } catch (error) {
        console.error('Error ensuring jobtrip website:', error)
        throw error // Re-throw to be handled by caller
      }
    }
    console.log('Using existing tab')
    return existingTab
  } finally {
    console.groupEnd()
  }
}

export default {
  findjobtripTab,
  ensurejobtripWebsite
} 