// // 常量定义
// const API_ENDPOINT = 'http://localhost:3000/api/jobs'
// const API_GET_JOBS = 'http://localhost:3000/api/jobs'

// // DOM 元素
// let elements = {
//   exportByApiBtn: null,
//   statusMessage: null,
//   testGetBtn: null
// }

// // 工具函数
// const utils = {
//   showStatusMessage: (message, type) => {
//     if (elements.statusMessage) {
//       elements.statusMessage.textContent = message
//       elements.statusMessage.className = `status-message ${type}`
//       elements.statusMessage.style.display = 'block'
      
//       setTimeout(() => {
//         elements.statusMessage.style.display = 'none'
//       }, 3000)
//     }
//   }
// }

// // API 测试功能
// const apiTester = {
//   testGetJobs: async () => {
//     console.log('Testing GET jobs API')
//     try {
//       const response = await fetch(API_GET_JOBS, {
//         method: 'GET',
//         headers: {
//           'Accept': 'application/json'
//         }
//       })
      
//       if (response.ok) {
//         const data = await response.json()
//         console.log('GET response:', data)
//         utils.showStatusMessage(`成功获取 ${data.length} 个工作数据`, 'success')
//       } else {
//         const errorData = await response.json()
//         utils.showStatusMessage(`获取失败: ${errorData.message || '未知错误'}`, 'error')
//       }
//     } catch (error) {
//       console.error('API test error:', error)
//       utils.showStatusMessage(`获取失败: ${error.message}`, 'error')
//     }
//   }
// }

// // API 导出功能
// const apiExporter = {
//   exportJobs: async () => {
//     console.log('Exporting jobs by API')
//     try {
//       // 获取当前页面的工作信息
//       const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
//       const response = await chrome.tabs.sendMessage(tab.id, { action: 'getJobResults' })
//       console.log('____aaaaaaaaaaaaa')

//       // if (response && response.jobs) {
//       //   // 转换数据格式以匹配后端模型
//       //   const jobs = response.jobs.map(job => ({
//       //     title: job.title,
//       //     company: job.company,
//       //     location: job.location,
//       //     jobUrl: job.url,
//       //     description: job.description,
//       //     salary: job.salary || '',
//       //     jobType: job.jobType || '',
//       //     platform: job.platform || 'LinkedIn',
//       //     postedDate: new Date()
//       //   }))
//       //   console.log('Exporting jobs by API___2')

//       //   // 调用后端 API
//       //   const apiResponse = await fetch(API_ENDPOINT, {
//       //     method: 'POST',
//       //     headers: {
//       //       'Content-Type': 'application/json',
//       //       'Accept': 'application/json'
//       //     },
//       //     body: JSON.stringify(jobs)
//       //   })
        
//       //   if (apiResponse.ok) {
//       //     const data = await apiResponse.json()
//       //     utils.showStatusMessage(`成功导出 ${data.length} 个工作到后端`, 'success')
//       //   } else {
//       //     const errorData = await apiResponse.json()
//       //     utils.showStatusMessage(`导出失败: ${errorData.message || '未知错误'}`, 'error')
//       //   }
//       // } else {
//       //   utils.showStatusMessage('没有找到可导出的工作', 'error')
//       // }
//     } catch (error) {
//       console.error('API export error:', error)
//       utils.showStatusMessage(`导出失败: ${error.message}`, 'error')
//     }
//   }
// }

// // 初始化函数
// function initialize() {
//   // 获取DOM元素
//   elements = {
//     exportByApiBtn: document.getElementById('exportByApiBtn'),
//     statusMessage: document.getElementById('statusMessage'),
//     testGetBtn: document.getElementById('testGetBtn')
//   }

//   // 添加事件监听器
//   if (elements.exportByApiBtn) {
//     elements.exportByApiBtn.addEventListener('click', apiExporter.exportJobs)
//   }

//   if (elements.testGetBtn) {
//     elements.testGetBtn.addEventListener('click', apiTester.testGetJobs)
//   }
// }

// // 在DOM加载完成后初始化
// document.addEventListener('DOMContentLoaded', initialize) 