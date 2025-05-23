import { supportedWebsites } from './websites.js'
import versionService from './src/services/versionService.js'
import tabService from './src/services/tabService.js'
import jobService from './src/services/jobService.js'
import scraperService from './src/services/scraperService.js'
import uiService from './src/services/uiService.js'
import storageService from './src/services/storageService.js'
import endpoints from './src/config/endpoints.js'

// Notify background script that side panel is loaded
if (window.location.pathname.includes('sidepanel.html')) {
  chrome.runtime.sendMessage({ action: 'sidePanelLoaded' })
}

// Event handler for platform checkboxes
const handleCheckboxChange = async (e) => {
  if (e.target.type === 'checkbox' && e.target.closest('.website-option')) {
    const newSettings = {}
    supportedWebsites.forEach(website => {
      const checkbox = document.getElementById(website.id)
      if (checkbox) {
        newSettings[website.id] = checkbox.checked
      }
    })
    await storageService.saveWebsiteSettings(newSettings)
    // const statusMessage = document.getElementById('statusMessage')
    // if (statusMessage) {
    //   uiService.showMessage(statusMessage, 'Settings saved')
    // }
  }
}

// Function to update location options based on country selection
export function updateLocationOptions (country) {
  const locationSelect = document.getElementById('location')
  const templateId = {
    'United States': 'usLocations',
    'Australia': 'australiaLocations',
    'United Kingdom': 'ukLocations',
    'Canada': 'canadaLocations',
    'New Zealand': 'newZealandLocations'
  }[country]

  // Clear current options except the first one
  while (locationSelect.options.length > 1) {
    locationSelect.remove(1)
  }

  if (templateId) {
    const template = document.getElementById(templateId)
    const options = template.content.cloneNode(true)
    locationSelect.appendChild(options)
    locationSelect.disabled = false
  } else {
    locationSelect.disabled = true
  }

  // Update website options based on country
  const websiteOptions = document.getElementById('websiteOptions')
  websiteOptions.innerHTML = '' // Clear current options

  // LinkedIn is always available
  const linkedinDiv = document.createElement('div')
  linkedinDiv.className = 'website-option'
  linkedinDiv.innerHTML = `
    <label>
      <input type="checkbox" 
             id="linkedin" 
             checked>
      LinkedIn
    </label>
  `
  websiteOptions.appendChild(linkedinDiv)

  // Indeed is always available
  const indeedDiv = document.createElement('div')
  indeedDiv.className = 'website-option'
  indeedDiv.innerHTML = `
    <label>
      <input type="checkbox" 
             id="indeed" 
             checked>
      Indeed ${country ? `(${country})` : ''}
    </label>
  `
  websiteOptions.appendChild(indeedDiv)

  // SEEK is available for Australia and New Zealand
  if (country === 'Australia' || country === 'New Zealand') {
    const seekDiv = document.createElement('div')
    seekDiv.className = 'website-option'
    seekDiv.innerHTML = `
      <label>
        <input type="checkbox" 
               id="seek" 
               checked>
        SEEK ${country === 'New Zealand' ? 'NZ' : ''}
      </label>
    `
    websiteOptions.appendChild(seekDiv)
  }
}

// Function to display empty state
function showEmptyState (jobList, message = 'No jobs found', subMessage = 'Try adjusting your search criteria or select different job platforms') {
  // Clear any existing content
  jobList.innerHTML = ''

  // Create empty state container
  const emptyState = document.createElement('div')
  emptyState.className = 'empty-state'

  // Add icon
  const icon = document.createElement('div')
  icon.className = 'empty-state-icon'
  icon.textContent = '🔍'

  // Add main text
  const text = document.createElement('div')
  text.className = 'empty-state-text'
  text.textContent = message

  // Add subtext
  const subtext = document.createElement('div')
  subtext.className = 'empty-state-subtext'
  subtext.textContent = subMessage

  // Assemble the empty state
  emptyState.appendChild(icon)
  emptyState.appendChild(text)
  emptyState.appendChild(subtext)

  // Add to job list
  jobList.appendChild(emptyState)
}

// Display jobs in the UI
function displayJobs (jobs) {
  const jobList = document.getElementById('jobList')
  jobList.innerHTML = ''

  if (!jobs || jobs.length === 0) {
    showEmptyState(jobList)
    return
  }

  jobs.forEach(job => {
    jobList.appendChild(uiService.createJobCard(job))
  })
}

// API 端点定义
let API_ENDPOINT = null
let API_GET_JOBS = null

// 初始化 API 端点
async function initializeEndpoints() {
  try {
    const config = await endpoints.detectEnvironment()
    API_ENDPOINT = config.BACKEND.API_ENDPOINT
    API_GET_JOBS = config.BACKEND.API_ENDPOINT
    console.log('API endpoints initialized:', { API_ENDPOINT, API_GET_JOBS })
  } catch (error) {
    console.error('Error initializing endpoints:', error)
    // 默认使用生产环境配置
    API_ENDPOINT = endpoints.PROD_CONFIG.BACKEND.API_ENDPOINT
    API_GET_JOBS = endpoints.PROD_CONFIG.BACKEND.API_ENDPOINT
  }
}

// 立即初始化端点
initializeEndpoints()

// 全局变量
let scrapedJobs = []

// 全局常量定義
const JOB_DATA_STRUCTURE = {
  totalJobs: 0,
  timestamp: '',
  jobs: [{
    platform: '',
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: [],
    salary: '',
    jobType: '',
    source: '',
    sourceId: '',
    sourceUrl: '',
    deadline: null,
    notes: '',
    createdAt: '',
    updatedAt: ''
  }]
};

// 格式化工作數據的函數
export const formatJobData = (jobs) => {
  return {
    ...JOB_DATA_STRUCTURE,
    totalJobs: jobs.length,
    timestamp: new Date().toISOString(),
    jobs: jobs.map(job => {
      // 从 sourceUrl 提取 ID
      let sourceId = '';
      const sourceUrl = job.url || job.sourceUrl || '';
      
      if (job.platform === 'LinkedIn') {
        // LinkedIn: 从 currentJobId 参数提取
        const match = sourceUrl.match(/currentJobId=(\d+)/);
        sourceId = match ? match[1] : '';
      } else if (job.platform === 'Indeed') {
        // Indeed: 从 ad 参数提取
        const match = sourceUrl.match(/jk=([^&]+)/);
        sourceId = match ? match[1] : '';
      } else if (job.platform === 'SEEK') {
        // Seek: 从 URL 中提取 job ID
        const match = sourceUrl.match(/\/job\/(\d+)(?:\?|#|$)/);
        sourceId = match ? match[1] : '';
      }

      // 处理jobType，确保空字符串变为N/A
      let jobType = job.jobType || '';
      if (jobType === '') {
        jobType = 'n-a'; // 将空字符串转为N/A
      }

      return {
        platform: job.platform,
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description || '',
        requirements: job.requirements || [],
        salary: job.salary || '',
        jobType: jobType,
        source: job.platform,
        sourceId: sourceId,
        sourceUrl: sourceUrl,
        deadline: null,
        notes: '',
        createdAt: job.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    })
  };
};

// API 测试功能
const apiTester = {
  testGetJobs: async () => {
    console.log('Testing GET jobs API')
    try {
      const statusMessage = document.getElementById('statusMessage')
      const response = await fetch(API_GET_JOBS, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('GET response:', data)
        uiService.showMessage(statusMessage, `Successfully retrieved`, 'success')

        // uiService.showMessage(statusMessage, `成功获取 ${data.length} 个工作数据`, 'success')
      } else {
        const errorData = await response.json()
        uiService.showMessage(statusMessage, `Retrieval failed`, 'error')

        // uiService.showMessage(statusMessage, `获取失败: ${errorData.message || '未知错误'}`, 'error')
      }
    } catch (error) {
      console.error('API test error:', error)
      const statusMessage = document.getElementById('statusMessage')
      uiService.showMessage(statusMessage, `Retrieval failed: ${error.message}`, 'error')
    }
  }
}

// API 导出功能
const apiExporter = {
  exportJobs: async () => {
    console.log('Exporting jobs by API')
    try {
      const statusMessage = document.getElementById('statusMessage')
      if (scrapedJobs.length > 0) {
        // 尝试获取用户令牌
        let userToken = await storageService.getUserToken();
        
        // 如果没有令牌，尝试打开jobtrip网站并重新获取
        if (!userToken) {
          uiService.showMessage(statusMessage, 'No user token found. Opening jobtrip login page...', 'warning');
          const tab = await tabService.ensurejobtripWebsite(false);
          
          // 等待用户登录
          uiService.showMessage(statusMessage, 'Please log in to jobtrip. Waiting for authentication...', 'info');
          
          // 等待5秒后再次尝试获取令牌
          await new Promise(resolve => setTimeout(resolve, 5000));
          userToken = await storageService.getUserToken();
          
          if (!userToken) {
            uiService.showMessage(statusMessage, 'Please log in to jobtrip first to get userToken, or keep the jobtrip page open', 'error');
            return;
          }
        }

        // 将 userToken 从请求体中移除，因为它将通过 Authorization header 发送
        const exportData = formatJobData(scrapedJobs); 
        console.log('Exporting jobs (without token in body):', exportData)
        
        // 获取当前环境的API端点
        const config = await endpoints.detectEnvironment();
        const API_ENDPOINT = config.BACKEND.API_ENDPOINT;
        console.log('Using API_ENDPOINT:', API_ENDPOINT);
        
        uiService.showMessage(statusMessage, 'Exporting jobs to backend...', 'info');
        
        // 发送请求
        const apiResponse = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${userToken}` // 在这里添加 Authorization header
          },
          body: JSON.stringify(exportData)
        });
        
        console.log('API Response status:', apiResponse.status);
        
        if (apiResponse.ok) {
          const data = await apiResponse.json();
          console.log('Export successful:', data);
          uiService.showMessage(statusMessage, `Successfully exported ${scrapedJobs.length} jobs to backend with user token`);
          
          // 添加2秒延迟后跳转到joblist页面
          setTimeout(async () => {
            try {
              // 获取当前环境的配置
              const config = await endpoints.detectEnvironment();
              const baseUrl = config.FRONTEND.BASE_URL;
              
              // 构建joblist页面的URL
              const joblistUrl = baseUrl.endsWith('/') ? `${baseUrl}jobs` : `${baseUrl}/jobs`;
              
              // 直接创建新标签页打开joblist页面
              chrome.tabs.create({ url: joblistUrl, active: true }, (tab) => {
                console.log('Created new tab for joblist page:', tab);
              });
              
              console.log('Redirected to joblist page:', joblistUrl);
            } catch (error) {
              console.error('Failed to redirect to joblist page:', error);
            }
          }, 2000); // 2秒延迟
        } else {
          // 处理各种错误状态码
          let errorMessage = 'Unknown error';
          
          try {
            const errorData = await apiResponse.json();
            errorMessage = errorData.message || `HTTP Error: ${apiResponse.status}`;
          } catch (e) {
            errorMessage = `HTTP Error: ${apiResponse.status} - ${apiResponse.statusText}`;
          }
          
          console.error('API export error:', errorMessage);
          
          // 如果是认证错误，尝试重新获取令牌
          if (apiResponse.status === 401 || apiResponse.status === 403) {
            uiService.showMessage(statusMessage, 'Authentication failed. Trying to refresh login...', 'warning');
            await tabService.ensurejobtripWebsite(false);
            
            // 等待用户重新登录
            uiService.showMessage(statusMessage, 'Please log in again to jobtrip', 'info');
          } else {
            uiService.showMessage(statusMessage, `Export failed: ${errorMessage}`, 'error');
          }
        }
      } else {
        uiService.showMessage(statusMessage, 'No jobs found to export', 'error');
      }
    } catch (error) {
      console.error('API export error:', error);
      const statusMessage = document.getElementById('statusMessage');
      uiService.showMessage(statusMessage, `Export failed: ${error.message || 'Unknown error'}`, 'error');
    }
  }
};

// Helper function to close tab if auto close is enabled
function closeTabIfEnabled(tabId) {
  const autoCloseTab = document.getElementById('autoCloseTab');
  if (autoCloseTab && autoCloseTab.checked) {
    chrome.tabs.remove(tabId).catch(err => console.error('Failed to close tab:', err));
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM Content Loaded')
  
  // 确保 jobtrip 网站已打开//////////////////////////////
  const tab = await tabService.ensurejobtripWebsite(false)
  console.log('jobtrip 网站已打开:', tab)

  // 注释掉版本检查部分
  // const versionCheck = await versionService.checkVersion(false)
  // if (!versionCheck.isCompatible || versionCheck.requireUpdate) {
  //   versionService.showUpdateUI({
  //     currentVersion: versionCheck.currentVersion,
  //     minimumVersion: versionCheck.minimumVersion,
  //     message: versionCheck.message
  //   })
  //   return // Stop further initialization if version is incompatible
  // }

  const locationInput = document.getElementById('location')
  const searchBtn = document.getElementById('searchBtn')
  const scrapeBtn = document.getElementById('scrapeBtn')
  const showInjobtripBtn = document.getElementById('showInjobtripBtn')
  const jobList = document.getElementById('jobList')
  const statusMessage = document.getElementById('statusMessage')
  const progressSection = document.getElementById('progressSection')
  const progressFill = document.getElementById('progressFill')
  const progressText = document.getElementById('progressText')
  const progressDetail = document.getElementById('progressDetail')
  const overlay = document.getElementById('overlay')
  const overlayText = document.getElementById('overlayText')
  const overlayDetail = document.getElementById('overlayDetail')
  const websiteOptions = document.getElementById('websiteOptions')
  const countrySelect = document.getElementById('country')
  const locationSelect = document.getElementById('location')
  const exportByApiBtn = document.getElementById('exportByApiBtn')
  const testGetBtn = document.getElementById('testGetBtn')
  const usertokenBtn = document.getElementById('usertokenBtn')////////////////

  // 初始化国家和地点下拉菜单
  updateLocationOptions(countrySelect.value);

  // 添加工作数量限制输入框
  const maxJobsContainer = document.createElement('div')
  maxJobsContainer.className = 'search-row'
  maxJobsContainer.style.marginTop = '8px'
  maxJobsContainer.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <label for="maxJobs" style="white-space: nowrap;">Maximum job limit:</label>
      <input type="number" id="maxJobs" min="1" max="100" value="3" style="flex: 1; padding: 8px;">
    </div>
  `
  // 将输入框添加到搜索区域
  const searchSection = document.querySelector('.search-section')
  searchSection.insertBefore(maxJobsContainer, document.querySelector('.search-row:last-child'))

  // 添加自动关闭Tab选项
  const autoCloseContainer = document.createElement('div')
  autoCloseContainer.className = 'search-row'
  autoCloseContainer.style.marginTop = '8px'
  autoCloseContainer.innerHTML = `
    <div style="display: flex; align-items: center;">
      <label for="autoCloseTab" style="white-space: nowrap;">Auto close tab after scraping:</label>
      <input type="checkbox" id="autoCloseTab" style="margin-left: 8px;">
    </div>
  `
  // 将自动关闭选项添加到搜索区域，放在最大工作数量输入框下方
  searchSection.insertBefore(autoCloseContainer, document.querySelector('.search-row:last-child'))

  console.log('websiteOptions element:', websiteOptions)
  console.log('supportedWebsites:', supportedWebsites)

  // let scrapedJobs = []///////////////////////////////////////////////

  // Add country change handler
  countrySelect.addEventListener('change', (e) => {
    const country = e.target.value
    updateLocationOptions(country)
    // Save the country selection
    if (country) {
      storageService.saveLastCountry(country)
    }
  })

  // Load last used country and location
  const [lastCountry, lastLocation] = await Promise.all([
    storageService.loadLastCountry(),
    storageService.loadLastLocation()
  ])

  // First set the country and update location options
  // if (lastCountry) {
  //   // countrySelect.value = lastCountry
  //   updateLocationOptions(lastCountry)
  // } else {
  //   // If no country is selected, initialize with empty website options
  //   updateLocationOptions('')
  // }

  // // Then set the location if it exists
  // if (lastLocation) {
  //   // locationSelect.value = lastLocation
  // }

  // Load saved settings
  const savedSettings = await storageService.loadWebsiteSettings()
  console.log('savedSettings:', savedSettings)

  // Add the change event listener to the websiteOptions container
  if (websiteOptions) {
    websiteOptions.addEventListener('change', handleCheckboxChange)
  }

  // Update show in jobtrip button handler
  // 在本地導出Json文件//////////////////////////////
  showInjobtripBtn.addEventListener('click', async () => {
    console.log('Export JSON button clicked')
    console.log('Jobs to export:', scrapedJobs)

    try {
      if (scrapedJobs.length === 0) {
        uiService.showMessage(statusMessage, 'No jobs to export', true)
        return
      }

      // 尝试获取用户令牌
      let userToken = await storageService.getUserToken();
      
      // 如果没有令牌，尝试打开jobtrip网站并重新获取
      if (!userToken) {
        uiService.showMessage(statusMessage, 'No user token found. Opening jobtrip login page...', 'warning');
        const tab = await tabService.ensurejobtripWebsite(false);
        
        // 等待用户登录
        uiService.showMessage(statusMessage, 'Please log in to jobtrip. Waiting for authentication...', 'info');
        
        // 等待5秒后再次尝试获取令牌
        await new Promise(resolve => setTimeout(resolve, 5000));
        userToken = await storageService.getUserToken();
        
        if (!userToken) {
          uiService.showMessage(statusMessage, 'Please log in to jobtrip first to get userToken, or keep the jobtrip page open', 'error');
          return;
        }
      }

      const jsonData = formatJobData(scrapedJobs);
      
      const jsonString = JSON.stringify(jsonData, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `jobtrip_results_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      uiService.showMessage(statusMessage, 'Job results exported successfully with user token');
    } catch (error) {
      console.error('Error exporting job results:', error)
      uiService.showMessage(statusMessage, 'Error occurred while exporting results', true)
    }
  })

  // Update search button click handler
  searchBtn.addEventListener('click', async () => {
    const locationSelect = document.getElementById('location')
    const searchInput = document.getElementById('searchInput')
    const countrySelect = document.getElementById('country')
    const maxJobsInput = document.getElementById('maxJobs')
    const location = locationSelect.value.trim()
    const searchTerm = searchInput.value.trim()
    const country = countrySelect.value.trim()
    const maxJobs = parseInt(maxJobsInput.value) || 30 // 默认最大爬取30个工作

    // Get the current extension window
    const currentWindow = await chrome.windows.getCurrent()

    if (!location) {
      uiService.showMessage(statusMessage, 'Please select a location', true)
      return
    }

    if (!searchTerm) {
      uiService.showMessage(statusMessage, 'Please enter search keywords', true)
      return
    }

    console.log('=== Starting Job Search ===')
    console.log('Search Term:', searchTerm)
    console.log('Location:', location)
    console.log('Country:', country)
    console.log('Max Jobs:', maxJobs)

    // 注释掉与后端通信的代码
    // Send scraping started message to frontend
    // await tabService.ensurejobtripWebsite().then(tab => {
    //   chrome.scripting.executeScript({
    //     target: { tabId: tab.id },
    //     func: (message) => {
    //       window.postMessage(message, '*')
    //     },
    //     args: [{
    //       type: 'SCRAPING_STATUS',
    //       data: {
    //         status: 'started',
    //         message: 'Started scraping jobs'
    //       }
    //     }]
    //   })
    // })

    // Show overlay and disable interaction
    uiService.showOverlay(overlay, true)

    // Save location and country to storage
    await Promise.all([
      storageService.saveLastLocation(location),
      storageService.saveLastCountry(country)
    ])

    // Reset state
    scrapedJobs = []
    jobList.innerHTML = ''

    // Show progress section
    progressSection.style.display = 'block'
    uiService.updateProgress(progressFill, progressText, overlayText, progressDetail, overlayDetail, 0, 'Starting job search...')

    try {
      // Clear any existing scraping state at the start
      await storageService.updateScrapingState(false)

      // Get current website settings
      const savedSettings = await storageService.loadWebsiteSettings()
      console.log('Current website settings:', savedSettings)

      // Get sites to scrape based on checkbox selection
      const sites = scraperService.createJobSearchUrls(searchTerm, location)
        .filter(site => {
          const checkbox = document.getElementById(site.id)
          return checkbox && checkbox.checked
        })

      if (sites.length === 0) {
        uiService.showMessage(statusMessage, 'Please select at least one website', true)
        progressSection.style.display = 'none'
        uiService.showOverlay(overlay, false)
        return
      }

      console.log('Sites to scrape after filtering:', sites)
      let completedSites = 0
      const totalSites = sites.length

      // Get all windows to find the main browser window
      const windows = await chrome.windows.getAll({ windowTypes: ['normal'] })
      console.log('Found browser windows:', windows.length)

      const mainWindow = windows.find(w => w.type === 'normal')
      if (!mainWindow) {
        throw new Error('Could not find main browser window')
      }

      for (const site of sites) {
        // 检查是否已经达到最大工作数量
        if (scrapedJobs.length >= maxJobs) {
          console.log(`Reached maximum job limit (${maxJobs}), stopping further scraping`)
          closeTabIfEnabled(tab.id);
          break
        }

        console.log(`\n=== Processing ${site.platform} ===`)
        const progress = (completedSites / totalSites) * 100
        uiService.updateProgress(
          progressFill,
          progressText,
          overlayText,
          progressDetail,
          overlayDetail,
          progress,
          `Scraping ${site.platform}...`,
          `Starting scrape for ${site.platform}`
        )

        const tab = await chrome.tabs.create({
          url: site.url,
          windowId: mainWindow.id,
          active: true
        })

        // Add tab close listener
        const tabClosedPromise = new Promise(resolve => {
          const listener = (tabId) => {
            if (tabId === tab.id) {
              chrome.tabs.onRemoved.removeListener(listener)
              resolve()
            }
          }
          chrome.tabs.onRemoved.addListener(listener)
        })

        try {
          await scraperService.waitForPageLoad(tab.id)

          // Race between scraping and tab closure
          const jobs = await Promise.race([
            scraperService.scrapeWithPagination(tab, site.platform, (currentPage) => {
              uiService.updateProgress(
                progressFill,
                progressText,
                overlayText,
                progressDetail,
                overlayDetail,
                progress,
                `Scraping ${site.platform}...`,
                `Processing page ${currentPage} in ${site.platform}`
              )
            }, maxJobs - scrapedJobs.length), // 传递剩余可爬取的工作数量
            tabClosedPromise.then(async () => {
              console.log(`Tab closed for ${site.platform}`)
              // Clear scraping state if tab is closed
              await storageService.updateScrapingState(false)
              return [] // Return empty array if tab was closed
            })
          ])

          scrapedJobs.push(...jobs)
          completedSites++
          const progressPercent = (completedSites / totalSites) * 100
          uiService.updateProgress(
            progressFill,
            progressText,
            overlayText,
            progressDetail,
            overlayDetail,
            progressPercent,
            `Completed ${site.platform}`,
            `Found ${jobs.length} jobs from ${site.platform}`
          )
          uiService.showMessage(statusMessage, `Scraped ${jobs.length} jobs from ${site.platform}`)

          // Update UI
          jobList.innerHTML = ''
          scrapedJobs.forEach(job => {
            jobList.appendChild(uiService.createJobCard(job))
          })
          closeTabIfEnabled(tab.id);

          // 检查是否已达到最大工作数量
          if (scrapedJobs.length >= maxJobs) {
            console.log(`Reached maximum job limit (${maxJobs}), stopping further scraping`)
            closeTabIfEnabled(tab.id);
            break
          }
        } catch (error) {
          console.error(`Error processing ${site.platform}:`, error)
          // Clear scraping state on error
          await storageService.updateScrapingState(false)
          completedSites++
        }
      }

      console.log('=== Scraping Complete ===')
      console.log('Total jobs scraped:', scrapedJobs.length)
      uiService.updateProgress(
        progressFill,
        progressText,
        overlayText,
        progressDetail,
        overlayDetail,
        100,
        `Scraping Complete!`,
        `Found ${scrapedJobs.length} jobs from ${totalSites} sites`
      )
      uiService.showMessage(statusMessage, `Successfully scraped ${scrapedJobs.length} jobs!`)
      
      // 自動生成並下載JSON文件///////////////////////////
      // const userToken = await storageService.getUserToken() || '';
      // const exportData = formatJobData(scrapedJobs, userToken);
      
      // const jsonString = JSON.stringify(exportData, null, 2)
      // const blob = new Blob([jsonString], { type: 'application/json' })
      // const url = URL.createObjectURL(blob)
      
      // const a = document.createElement('a')
      // a.href = url
      // a.download = `jobtrip_jobs_${new Date().toISOString().split('T')[0]}.json`
      // document.body.appendChild(a)
      // a.click()
      // document.body.removeChild(a)
      // URL.revokeObjectURL(url)
      
      // uiService.updateButtonStates(showInjobtripBtn, scrapedJobs.length > 0)
      
      // if (userToken) {
      //   uiService.showMessage(statusMessage, '工作結果導出成功，包含 user token');
      // } else {
      //   uiService.showMessage(statusMessage, '工作結果導出成功，但未找到 user token，請先登入jobtrip');
      // }



      // 注释掉自动发送到jobtrip的代码
      // Automatically trigger show in jobtrip if jobs were found
      // if (scrapedJobs.length > 0) {
      //   try {
      //     console.log('Attempting to auto-send jobs to jobtrip...')
      //     const response = await jobService.sendJobsTojobtrip(scrapedJobs)
      //     console.log('Auto-sending jobs to jobtrip:', response)

      //     if (response && response.success) {
      //       uiService.showMessage(statusMessage, 'Jobs sent to jobtrip successfully')
      //     } else {
      //       console.error('Failed to auto-send jobs to jobtrip:', {
      //         response,
      //         scrapedJobs
      //       })
      //     }
      //   } catch (error) {
      //     console.error('Error auto-sending jobs to jobtrip:', {
      //       error,
      //       scrapedJobs
      //       })
      //     }
      //   }
      // }

      // 注释掉与后端通信的代码
      // Send scraping completed message to frontend
      // await tabService.ensurejobtripWebsite().then(tab => {
      //   chrome.scripting.executeScript({
      //     target: { tabId: tab.id },
      //     func: (message) => {
      //       window.postMessage(message, '*')
      //     },
      //     args: [{
      //       type: 'SCRAPING_STATUS',
      //       data: {
      //         status: 'completed',
      //         message: `Found ${scrapedJobs.length} jobs`,
      //         totalJobs: scrapedJobs.length
      //       }
      //     }]
      //   })
      // })

      // 隐藏加载中的UI
      progressSection.style.display = 'none'
      uiService.showOverlay(overlay, false)
    } catch (error) {
      console.error('Error during scraping:', error)
      uiService.showMessage(statusMessage, 'An error occurred during scraping', true)
      uiService.updateProgress(progressFill, progressText, overlayText, progressDetail, overlayDetail, 0, 'Scraping failed', error.message)
    } finally {
      // Clear scraping state and clean up
      await storageService.updateScrapingState(false)
      uiService.showOverlay(overlay, false)
      // Focus back on the extension window at the end
      chrome.windows.update(currentWindow.id, { focused: true })
    }
  })

  // 添加 API 相关按钮的事件监听器
  if (exportByApiBtn) {
    exportByApiBtn.addEventListener('click', apiExporter.exportJobs)
  }

  if (testGetBtn) {
    testGetBtn.addEventListener('click', apiTester.testGetJobs)
  }
////////////////////////////////////////////////////////////
  if (usertokenBtn) {
    usertokenBtn.addEventListener('click', async () => {
      try {
        const statusMessage = document.getElementById('statusMessage');
        
        // 尝试获取用户令牌
        let userToken = await storageService.getUserToken();
        
        if (userToken) {
          // 显示令牌的一部分，保护隐私
          const maskedToken = userToken.substring(0, 10) + '...' + userToken.substring(userToken.length - 10);
          uiService.showMessage(statusMessage, `Successfully retrieved user token: ${maskedToken}`, 'success');
          console.log('User token found');
        } else {
          // 如果没有找到令牌，尝试打开jobtrip网站
          uiService.showMessage(statusMessage, 'User token not found. Opening jobtrip login page...', 'warning');
          
          // 确保jobtrip网站已打开
          const tab = await tabService.ensurejobtripWebsite(false);
          
          // 等待用户登录
          uiService.showMessage(statusMessage, 'Please log in to jobtrip. Waiting for authentication...', 'info');
          
          // 等待5秒后再次尝试获取令牌
          await new Promise(resolve => setTimeout(resolve, 5000));
          userToken = await storageService.getUserToken();
          
          if (userToken) {
            // 显示令牌的一部分，保护隐私
            const maskedToken = userToken.substring(0, 10) + '...' + userToken.substring(userToken.length - 10);
            uiService.showMessage(statusMessage, `Successfully retrieved user token: ${maskedToken}`, 'success');
            console.log('User token found after retry');
          } else {
            uiService.showMessage(statusMessage, 'User token not found, please ensure you are logged in to jobtrip', 'error');
          }
        }
      } catch (error) {
        console.error('Error retrieving user token:', error);
        const statusMessage = document.getElementById('statusMessage');
        uiService.showMessage(statusMessage, `Failed to retrieve user token: ${error.message}`, 'error');
      }
    });
  }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Panel received message:', request)

  if (request.action === 'START_SCRAPING') {
    const data = request.data

    // Set search input
    const searchInput = document.getElementById('searchInput')
    if (searchInput) searchInput.value = data.jobTitle

    // Set country
    console.log('Setting country:', data.country)
    const countrySelect = document.getElementById('country')
    if (countrySelect) {
      countrySelect.value = data.country
      // Trigger change event to update location options
      countrySelect.dispatchEvent(new Event('change'))
    }

    // Wait for location options to update
    setTimeout(() => {
      // Set location
      const locationSelect = document.getElementById('location')
      if (locationSelect) locationSelect.value = `${data.city}`

      // First uncheck all checkboxes
      const checkboxes = document.querySelectorAll('.website-option input[type="checkbox"]')
      checkboxes.forEach(checkbox => {
        checkbox.checked = false
      })

      // Then only check the platforms we want
      console.log('Setting platforms:', data.platforms)
      data.platforms.forEach(platform => {
        const checkbox = document.getElementById(platform.toLowerCase())
        console.log('Setting checkbox for platform:', platform, checkbox)
        if (checkbox) checkbox.checked = true
      })

      // Trigger search button click
      const searchBtn = document.getElementById('searchBtn')
      if (searchBtn) searchBtn.click()

      sendResponse({ success: true })
    }, 500)

    return true // Keep the message channel open for the async response
  }

  // Remove the auto-send trigger for JOBS_RECEIVED_RESPONSE since it's just a confirmation
  if (request.action === 'JOBS_RECEIVED_RESPONSE') {
    console.log('Received jobs response confirmation:', request.data)
    return true
  }
})

// Update message listener in content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request)

  if (request.action === 'getNextPageUrl') {
    const platform = Object.values(scrapers).find(s => s.isMatch(window.location.href))
    if (platform && platform.getNextPageUrl) {
      const nextUrl = platform.getNextPageUrl()
      sendResponse({ nextUrl })
    } else {
      sendResponse({ nextUrl: null })
    }
    return true
  }

  // ... existing message handling code ...
}) 
