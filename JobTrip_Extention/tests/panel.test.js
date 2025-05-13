const { describe, test, expect, beforeEach, afterEach } = require('@jest/globals');
const { setupTestEnvironment, teardownTestEnvironment, setHTML, getElement } = require('./setup.js');
import { updateLocationOptions, formatJobData } from '../panel.js'; // 使用 ES Module 导入

// 由于 panel.js 是一个模块并且直接操作 DOM，我们可能需要导入它，
// 或者在 HTML 中加载它然后测试其效果。
// 暂时我们先专注于可独立测试的函数，如果 panel.js 有导出的话。
// 如果 panel.js 没有导出，我们需要找到一种方式来测试其内部逻辑，
// 可能是通过模拟事件并观察 DOM 变化。

// 从 panel.js 中导入函数。如果 panel.js 没有明确导出，这一步会失败。
// 我们需要确保 panel.js 中的函数在测试环境中是可访问的。
// const { updateLocationOptions, formatJobData } = require('../panel.js'); // 假设这些函数被导出

describe('Panel Logic', () => {
  beforeEach(async () => {
    // 基本的 HTML 结构，模拟 sidepanel.html
    // 注意：setupTestEnvironment 应该会设置 jsdom 环境
    await setupTestEnvironment(); 
    
    // 添加 sidepanel.html 的核心结构到 document.body
    // 你可能需要根据 panel.js 的实际需求调整这里的 HTML
    document.body.innerHTML = `
      <div class="container">
        <h2>jobtrip Assistant</h2>
        <div id="websiteOptions" style="margin: 4px 0 10px 0;"></div>
        <div class="search-section">
          <input type="text" id="searchInput" class="search-input" value="Software Engineer" placeholder="Enter job title or keywords" required>
          <div class="search-row">
            <select id="country" class="location-select" required>
              <option value="">Select Country</option>
              <option value="United States">United States</option>
              <option value="Australia">Australia</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="New Zealand" selected>New Zealand</option>
            </select>
          </div>
          <div class="search-row">
            <select id="location" class="location-select" required disabled>
              <option value="">Select a location</option>
            </select>
          </div>
          <div class="search-row">
            <button id="searchBtn" style="width: 100%;">Search</button>
          </div>
        </div>

        <template id="usLocations">
          <option value="New York, NY, United States">New York, NY</option>
          <option value="San Jose, CA, United States">San Jose, CA</option>
        </template>
        <template id="australiaLocations">
          <option value="Sydney, NSW, Australia">Sydney, NSW</option>
        </template>
        <template id="ukLocations">
          <option value="London, United Kingdom">London</option>
        </template>
        <template id="canadaLocations">
          <option value="Toronto, ON, Canada">Toronto, ON</option>
        </template>
        <template id="newZealandLocations">
          <option value="Auckland, New Zealand" selected>Auckland</option>
          <option value="Wellington, New Zealand">Wellington</option>
        </template>

        <div class="progress-section" id="progressSection" style="display: none;">
          <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
          <div class="progress-text" id="progressText">Scraping jobs...</div>
          <div class="progress-detail" id="progressDetail"></div>
        </div>
        <div id="overlay" class="overlay" style="display: none;">
          <div class="overlay-content">
            <div class="spinner"></div>
            <div class="progress-text" id="overlayText">Scraping in progress...</div>
            <div class="progress-detail" id="overlayDetail"></div>
          </div>
        </div>
        <div id="statusMessage" class="status-message" style="display: none;"></div>
        <div class="job-list" id="jobList"></div>
        <div class="job-actions">
          <button id="showInjobtripBtn">Export Job Results</button>
          <button id="exportByApiBtn">Export Job Results To JobTrip</button>
          <button id="testGetBtn">Test GET Jobs API</button>
          <button id="usertokenBtn">User token</button>
        </div>
        <!-- <script src="../panel.js" type="module"></script> --> 
        <!-- panel.js is now imported, no need for script tag in test HTML -->
      </div>
    `;

    // 需要确保 panel.js 在 DOM 设置后有机会执行其 DOMContentLoaded 监听器
    // Jest/JSDOM 通常会自动处理 DOMContentLoaded，但如果是通过 <script> 标签加载，
    // 我们可能需要等待脚本加载和执行。
    // 对于 ES模块，其执行时机可能与普通脚本不同。

    // 为了让 panel.js 中的 DOMContentLoaded 执行，我们需要模拟事件或等待
    // 这是一个复杂点，因为 panel.js 是通过 <script type="module"> 加载的
    // JSDOM 对 module script 的支持需要特定配置。
    // 暂时，我们将假设 panel.js 中的函数可以被直接导入和测试。
  });

  afterEach(async () => {
    await teardownTestEnvironment();
    jest.resetModules(); // 重置模块，确保测试间的隔离
  });

  // 由于 panel.js 使用了 ES Modules 且没有明确导出 formatJobData 和 updateLocationOptions 供外部调用，
  // 我们需要调整测试策略。
  // 方案1: 修改 panel.js 导出这些函数 (如果项目允许)。
  // 方案2: 在测试中动态加载 panel.js 作为一个模块，并访问其作用域内的函数 (可能需要 babel-plugin-rewire 或类似工具，或者通过全局变量暴露)。
  // 方案3: 测试这些函数的副作用，例如 DOM 更新或 mock 函数的调用。

  // 目前，我们先假设能够通过某种方式调用这些函数。
  // 如果不行，我们会收到错误，然后调整。

  describe('formatJobData', () => {
    // No longer need beforeEach for dynamic import

    test('should correctly format job data and extract sourceId for LinkedIn', () => {
      const jobs = [{
        title: 'Software Engineer',
        company: 'Tech Corp',
        location: 'Remote',
        url: 'https://www.linkedin.com/jobs/view/12345?currentJobId=56789&trk=public_jobs_topcard-title',
        platform: 'LinkedIn'
      }];
      const userToken = 'test-token';
      const formattedData = formatJobData(jobs, userToken); 
      expect(formattedData.totalJobs).toBe(1);
      expect(formattedData.userToken).toBe(userToken);
      expect(formattedData.jobs[0].sourceId).toBe('56789');
      expect(formattedData.jobs[0].platform).toBe('LinkedIn');
    });

    test('should correctly format job data and extract sourceId for Indeed', () => {
      const jobs = [{
        title: 'Product Manager',
        company: 'Innovate Ltd.',
        location: 'London, UK',
        url: 'https://uk.indeed.com/viewjob?jk=abcdef123456&from=serp',
        platform: 'Indeed'
      }];
      const userToken = 'test-token-indeed';
      const formattedData = formatJobData(jobs, userToken);
      expect(formattedData.jobs[0].sourceId).toBe('abcdef123456');
      expect(formattedData.jobs[0].platform).toBe('Indeed');
    });

    test('should correctly format job data and extract sourceId for SEEK', () => {
      const jobs = [{
        title: 'UX Designer',
        company: 'Creative Studio',
        location: 'Sydney, AU',
        url: 'https://www.seek.com.au/job/78901234?tracking=JCA-SAU-0-0-0-0-0',
        platform: 'SEEK'
      }];
      const userToken = 'test-token-seek';
      const formattedData = formatJobData(jobs, userToken);
      expect(formattedData.jobs[0].sourceId).toBe('78901234');
      expect(formattedData.jobs[0].platform).toBe('SEEK');
    });

    test('should handle URL without sourceId gracefully', () => {
      const jobs = [{
        title: 'Data Analyst',
        company: 'Data Inc.',
        location: 'Auckland, NZ',
        url: 'https://www.linkedin.com/jobs/view/invalid-url',
        platform: 'LinkedIn'
      }];
      const userToken = 'test-token-no-id';
      const formattedData = formatJobData(jobs, userToken);
      expect(formattedData.jobs[0].sourceId).toBe('');
    });

  });

  describe('updateLocationOptions', () => {
    // No longer need beforeEach for dynamic import

    test('should populate location dropdown for United States', () => {
      const countrySelect = document.getElementById('country');
      const locationSelect = document.getElementById('location');
      
      countrySelect.value = 'United States';
      updateLocationOptions('United States'); 

      expect(locationSelect.disabled).toBe(false);
      expect(locationSelect.options.length).toBe(1 + 2); // "Select a location" + 2 US cities in template
      const usOption = Array.from(locationSelect.options).find(opt => opt.value === 'New York, NY, United States');
      expect(usOption).not.toBeUndefined();
      if (usOption) {
          expect(usOption.textContent).toBe('New York, NY');
      }
    });

    test('should correctly create website options for New Zealand (including SEEK)', () => {
      updateLocationOptions('New Zealand'); 
      const websiteOptions = document.getElementById('websiteOptions');
      const seekCheckbox = websiteOptions.querySelector('input#seek');
      const indeedCheckbox = websiteOptions.querySelector('input#indeed');
      const linkedinCheckbox = websiteOptions.querySelector('input#linkedin');
      
      expect(seekCheckbox).not.toBeNull();
      expect(seekCheckbox.checked).toBe(true); // Assuming default is checked
      expect(websiteOptions.textContent).toContain('SEEK NZ');
      expect(indeedCheckbox).not.toBeNull();
      expect(indeedCheckbox.checked).toBe(true);
      expect(websiteOptions.textContent).toContain('Indeed (New Zealand)');
      expect(linkedinCheckbox).not.toBeNull();
      expect(linkedinCheckbox.checked).toBe(true);
    });

    test('should correctly create website options for Australia (including SEEK)', () => {
        updateLocationOptions('Australia'); 
        const websiteOptions = document.getElementById('websiteOptions');
        const seekCheckbox = websiteOptions.querySelector('input#seek');
        expect(seekCheckbox).not.toBeNull();
        expect(websiteOptions.textContent).toContain('SEEK '); // SEEK without NZ
        expect(websiteOptions.textContent).not.toContain('SEEK NZ');
      });

    test('should not include SEEK for United States', () => {
      updateLocationOptions('United States'); 
      const websiteOptions = document.getElementById('websiteOptions');
      const seekCheckbox = websiteOptions.querySelector('input#seek');
      expect(seekCheckbox).toBeNull();
      expect(websiteOptions.textContent).toContain('Indeed (United States)');
    });

    test('should disable location select if no country is provided', () => {
        const locationSelect = document.getElementById('location');
        updateLocationOptions(''); 
        expect(locationSelect.disabled).toBe(true);
        expect(locationSelect.options.length).toBe(1); // Only "Select a location"
        const websiteOptions = document.getElementById('websiteOptions');
        expect(websiteOptions.textContent).toContain('Indeed '); // Indeed without country
        expect(websiteOptions.textContent).not.toContain('Indeed (');
      });
  });

  // 更多测试可以添加在这里，例如：
  // - 测试 searchBtn 点击事件是否触发了预期的行为 (可能需要 spyOn chrome.runtime.sendMessage)
  // - 测试 displayJobs 和 showEmptyState 是否正确更新 #jobList
  // - 测试 API 调用按钮 (exportByApiBtn, testGetBtn) 的行为，mock fetch
}); 