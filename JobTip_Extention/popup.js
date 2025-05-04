import endpoints from './src/config/endpoints.js'

// 導出數據到後端 API
document.getElementById('exportToAPI').addEventListener('click', async () => {
  try {
    const jobs = await chrome.storage.local.get('jobs');
    if (!jobs.jobs || jobs.jobs.length === 0) {
      alert('No jobs to export!');
      return;
    }

    // 顯示導出進度
    const progressDiv = document.getElementById('progress');
    progressDiv.textContent = 'Exporting jobs to backend API...';
    progressDiv.style.display = 'block';

    const config = await endpoints.detectEnvironment()

    // 發送數據到後端 API
    const response = await fetch(config.BACKEND.BATCH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobs.jobs),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    progressDiv.textContent = `Successfully exported ${result.length} jobs to backend API!`;
    
    // 3秒後隱藏進度信息
    setTimeout(() => {
      progressDiv.style.display = 'none';
    }, 3000);

  } catch (error) {
    console.error('Error exporting to API:', error);
    const progressDiv = document.getElementById('progress');
    progressDiv.textContent = `Error exporting to API: ${error.message}`;
    progressDiv.style.color = 'red';
  }
}); 