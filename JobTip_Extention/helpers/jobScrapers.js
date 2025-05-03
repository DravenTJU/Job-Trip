const enableLogFileDownload = false; // 设置为 true 以启用日志文件下载

class Job {
  constructor({
    title,
    company,
    location,
    description = '',
    requirements = [],
    salary = '',
    jobType = '',
    status = 'unapplied',
    source = '',
    sourceId = '',
    sourceUrl = '',
    appliedDate = null,
    deadline = null,
    notes = '',
    platform,
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.title = title?.trim() || ''
    this.company = company?.trim() || ''
    this.location = location?.trim() || ''
    this.description = description?.trim() || ''
    this.requirements = Array.isArray(requirements) ? requirements : []
    this.salary = salary?.trim() || ''
    this.jobType = jobType?.trim() || ''
    this.status = status?.trim() || 'unapplied'
    this.source = source?.trim() || ''
    this.sourceId = sourceId?.trim() || ''
    this.sourceUrl = sourceUrl || ''
    this.appliedDate = appliedDate || null
    this.deadline = deadline || null
    this.notes = notes?.trim() || ''
    this.platform = platform || ''
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  static createFromLinkedIn(data) {
    return new Job({
      title: data.title,
      company: data.company,
      location: data.location,
      description: data.description,
      requirements: data.requirements || [],
      salary: data.salary,
      jobType: data.jobType,
      source: 'LinkedIn',
      sourceId: data.sourceId || '',
      sourceUrl: data.jobUrl,
      platform: 'LinkedIn',
      createdAt: data.createdAt || new Date(),
      updatedAt: new Date()
    })
  }

  static createFromSEEK(data) {
    return new Job({
      title: data.title,
      company: data.company,
      location: data.location,
      description: data.description,
      requirements: data.requirements || [],
      salary: data.salary,
      jobType: data.jobType || '',
      source: 'SEEK',
      sourceId: data.sourceId || '',
      sourceUrl: data.jobUrl,
      platform: 'SEEK',
      createdAt: data.createdAt || new Date(),
      updatedAt: new Date()
    })
  }

  static createFromIndeed(data) {
    return new Job({
      title: data.title,
      company: data.company,
      location: data.location,
      description: data.description,
      requirements: data.requirements || [],
      salary: data.salary,
      jobType: data.jobType,
      source: 'Indeed',
      sourceId: data.sourceId || '',
      sourceUrl: data.jobUrl,
      platform: 'Indeed',
      createdAt: data.createdAt || new Date(),
      updatedAt: new Date()
    })
  }
}

// Job scraping functions for different platforms
const scrapers = {
  linkedin: {
    isMatch: (url) => url.includes('linkedin.com'),
    scrapeJobList: async () => {
      let jobs = []
      const logMessages = []
      
      const log = (message) => {
        console.log(message)
        logMessages.push(message)
      }

      log('=== LinkedIn Scraping Started ===')
      log(`Current URL: ${window.location.href}`)
      log(`Document readyState: ${document.readyState}`)
      log(`Page content length: ${document.body.innerHTML.length}`)
      log(`Page title: ${document.title}`)

      // Wait for page to be fully loaded
      if (document.readyState !== 'complete') {
        log('Waiting for page to load...')
        await new Promise(resolve => {
          window.addEventListener('load', resolve, { once: true })
        })
        log('Page loaded')
      }

      // Check if we're on the login page
      const loginForm = document.querySelector('form.login-form')
      if (loginForm) {
        log('Detected login page. Please log in first.')
        return { jobs, nextUrl: null, error: 'Login required' }
      }

      // Try multiple selectors to find job nodes
      const selectors = [
        'div[data-job-id]',
        'div[data-view-name="job-card"]',
        'div[class*="job-card"]',
        'div.jobs-search-results__list-item',
        'div.job-card-container',
        'div.job-card-job-posting-card-wrapper'
      ]

      let jobNodes = []
      for (const selector of selectors) {
        const nodes = document.querySelectorAll(selector)
        if (nodes.length > 0) {
          jobNodes = nodes
          log(`Using selector: ${selector}`)
          log(`Found ${nodes.length} job nodes with this selector`)
          break
        }
      }

      if (jobNodes.length === 0) {
        log('No job nodes found with any selector')
        return { jobs, nextUrl: null, error: 'No job nodes found' }
      }

      // Find next page URL
      let nextUrl = null
      const nextButton = document.querySelector('.jobs-search-pagination__button--next')
      if (nextButton) {
        const currentUrl = new URL(window.location.href)
        const currentPage = parseInt(currentUrl.searchParams.get('start') || '0')
        const nextPage = currentPage + 25 // LinkedIn每页显示25个职位
        currentUrl.searchParams.set('start', nextPage.toString())
        nextUrl = currentUrl.toString()
        log(`Found next page URL: ${nextUrl}`)
      } else {
        log('No next page button found')
      }

      // 使用 for...of 循環處理每個職位
      for (const node of jobNodes) {
        try {
          log(`\nProcessing LinkedIn job:`)
          log(`Node HTML: ${node.outerHTML.substring(0, 200)}...`)

          const titleNode = node.querySelector([
            'a[class*="job-card-list__title"]',
            'a[class*="job-card-container__link"]',
            'a[class*="job-card-job-posting-card"]',
            'a[class*="job-card-list__entity"]',
            'a[class*="job-card-container"]',
            'a[class*="job-posting-card"]',
            'a[class*="zwsPhDvTGeELvNkMMaTI"]'
          ].join(','))

          const companyNode = node.querySelector([
            'span[class*="company-name"]',
            'span[class*="subtitle"]',
            'span[class*="entity-lockup__subtitle"]',
            'span[class*="job-card-container__company-name"]',
            'span[class*="job-card-list__company-name"]',
            'div[class*="job-card-container__company-name"]',
            'div[class*="job-card-list__company-name"]',
            'div[class*="entity-lockup__subtitle"]'
          ].join(','))

          const locationNode = node.querySelector([
            'span[class*="location"]',
            'span[class*="metadata"]',
            'span[class*="job-card-container__metadata"]',
            'span[class*="job-card-list__metadata"]',
            'span[class*="entity-lockup__caption"]',
            'div[class*="job-card-container__metadata"]',
            'div[class*="job-card-list__metadata"]',
            'div[class*="entity-lockup__caption"]'
          ].join(','))

          const jobUrlNode = node.querySelector([
            'a[class*="job-card-list__title"]',
            'a[class*="job-card-container__link"]',
            'a[class*="job-card-job-posting-card"]',
            'a[class*="job-card-list__entity"]',
            'a[class*="job-card-container"]',
            'a[class*="job-posting-card"]',
            'a[class*="zwsPhDvTGeELvNkMMaTI"]'
          ].join(','))

          const logoNode = node.querySelector([
            'img[class*="logo"]',
            'img[class*="image"]',
            'img[class*="company-logo"]',
            'img[class*="entity-lockup__image"]',
            'img[class*="job-card-list__logo"]',
            'img[class*="job-card-container__logo"]'
          ].join(','))

          log(`Title node found: ${!!titleNode}`)
          log(`Company node found: ${!!companyNode}`)
          log(`Location node found: ${!!locationNode}`)
          log(`Job URL node found: ${!!jobUrlNode}`)
          log(`Logo node found: ${!!logoNode}`)

          // Get metadata items for salary and job type
          const metadataItems = Array.from(node.querySelectorAll([
            'span[class*="metadata"]',
            'li[class*="metadata"]',
            'span[class*="job-card-container__metadata"]',
            'span[class*="job-card-list__metadata"]',
            'span[class*="entity-lockup__metadata"]',
            'div[class*="job-card-container__metadata"]',
            'div[class*="job-card-list__metadata"]',
            'div[class*="entity-lockup__metadata"]'
          ].join(',')))
            .map(el => el.textContent.trim())
            .filter(text => text)
          log(`Found ${metadataItems.length} metadata items`)

          let jobUrl = jobUrlNode?.href || '';
          let salaryText = '';
          let jobType = '';
          let description = '';

          // 如果有職位詳情頁面URL，嘗試獲取更多資訊
          if (jobUrl) {
            log(`-----------------sdsdddddddddddddddddddddddddddddddd`);
            log(`Fetching job details from: ${jobUrl}`);

            try {
              // 使用 Promise 處理詳情頁面數據獲取
              const detailData = await new Promise((resolve, reject) => {
                chrome.runtime.sendMessage(
                  {
                    action: 'fetchJobDetail',
                    url: jobUrl
                  },
                  (response) => {
                    if (response && response.html) {
                      const parser = new DOMParser();
                      const doc = parser.parseFromString(response.html, 'text/html');
                      
                      // 尝试从HTML中提取JSON数据
                      let createdAt = new Date();
                      try {
                        const html = doc.documentElement.outerHTML;
                        // 查找包含时间信息的JSON数据
                        const jsonMatches = html.match(/"text":"[^"]*(\d+)\s*(days?|weeks?|months?|hours?|minutes?)\s*ago[^"]*"/g);
                        
                        log(`======jsonMatches: ${jsonMatches}`);
                        if (jsonMatches) {
                          let earliestDate = new Date();
                          let foundDate = false; // 添加标志，表示是否已找到日期
                          
                          for (const match of jsonMatches) {
                            const timeMatch = match.match(/(\d+)\s*(days?|weeks?|months?|hours?|minutes?)\s*ago/);
                            if (timeMatch) {
                              log(`======timeMatch: ${timeMatch}`);
                              const amount = parseInt(timeMatch[1]);
                              const unit = timeMatch[2].toLowerCase();
                              
                              log(`======amount: ${amount}`);
                              log(`======unit: ${unit}`);
                              
                              // 根据时间单位计算createdAt
                              if (unit.startsWith('day')) {
                                const now = new Date();
                                const calculatedDate = new Date(now.getTime() - (amount * 24 * 60 * 60 * 1000));
                                log(`======calculated date: ${calculatedDate.toISOString()}`);
                                
                                // 如果计算出的日期比当前最早的日期更早，则更新
                                if (calculatedDate < earliestDate) {
                                  earliestDate = calculatedDate;
                                  log(`======New earliest date: ${earliestDate.toISOString()}`);
                                }
                                
                                foundDate = true; // 标记已找到日期
                                break; // 找到第一个日期后就停止
                              } else if (unit.startsWith('week')) {
                                const now = new Date();
                                const calculatedDate = new Date(now.getTime() - (amount * 7 * 24 * 60 * 60 * 1000));
                                log(`======calculated date (weeks): ${calculatedDate.toISOString()}`);
                                
                                // 如果计算出的日期比当前最早的日期更早，则更新
                                if (calculatedDate < earliestDate) {
                                  earliestDate = calculatedDate;
                                  log(`======New earliest date: ${earliestDate.toISOString()}`);
                                }
                                
                                foundDate = true; // 标记已找到日期
                                break; // 找到第一个日期后就停止
                              } else if (unit.startsWith('month')) {
                                const now = new Date();
                                // 使用30天作为一个月
                                const calculatedDate = new Date(now.getTime() - (amount * 30 * 24 * 60 * 60 * 1000));
                                log(`======calculated date (months): ${calculatedDate.toISOString()}`);
                                
                                // 如果计算出的日期比当前最早的日期更早，则更新
                                if (calculatedDate < earliestDate) {
                                  earliestDate = calculatedDate;
                                  log(`======New earliest date: ${earliestDate.toISOString()}`);
                                }
                                
                                foundDate = true; // 标记已找到日期
                                break; // 找到第一个日期后就停止
                              }
                            }
                          }
                          
                          // 只有在找到日期时才更新createdAt
                          if (foundDate) {
                            createdAt = earliestDate;
                            log(`======Final createdAt (earliest): ${createdAt.toISOString()}`);
                          }
                        }
                      } catch (error) {
                        log(`Error extracting posted time from JSON: ${error.message}`);
                      }

                      // 輸出完整的 HTML 文檔
                      log('=== Full HTML Document ===')
                      log(doc.documentElement.outerHTML)
                      log('=== End of HTML Document ===')

                      // 在詳情頁面查找薪資資訊
                      const salarySelectors = [
                        'span.ui-label.text-body-small',
                        'span[class*="salary"]',
                        'span[class*="compensation"]',
                        'div[class*="salary"]',
                        'div[class*="compensation"]',
                        'span[data-testid="job-detail-salary"]',
                        'div[data-testid="job-detail-salary"]',
                        'span[data-testid="job-detail-remuneration"]',
                        'div[data-testid="job-detail-remuneration"]'
                      ];

                      // 在詳情頁面查找工作類型
                      const jobTypeSelectors = [
                        'span.ui-label.text-body-small',
                        'span[class*="workplace-type"]',
                        'span[class*="job-type"]',
                        'div[class*="workplace-type"]',
                        'div[class*="job-type"]',
                        'span[data-testid="job-detail-work-type"]',
                        'div[data-testid="job-detail-work-type"]',
                        'span[class*="ui-label"]',
                        'span[class*="text-body-small"]',
                        'span[class*="job-type"]',
                        'div[class*="job-type"]'
                      ];

                      // 使用正則表達式從 HTML 中提取工作描述
                      let description = '';
                      try {
                        const html = doc.documentElement.outerHTML;
                        // 定義關鍵字正則表達式
                        const descriptionKeywords = /(Join|experience|We are|Be part of|At [A-Za-z ]+|Our company|Our mission|Our services|Our products|Our solutions|We strive|We believe|We provide|We deliver|We support|We build|We develop|We lead|We empower|We care|We value diversity|Our culture|Our commitment|Working with|As part of|TCS follows|Founded in|Headquartered in|Since \d{4}|Across [A-Za-z ]+)/i;
                        
                        // 找出所有 "text" 區塊
                        const textBlocks = html.match(/"text":"([^"]*)"/g) || [];
                        
                        // 遍歷每個文本區塊
                        for (const block of textBlocks) {
                          // 提取文本內容
                          const text = block.match(/"text":"([^"]*)"/)[1];
                          
                          // 檢查文本是否符合條件
                          if (text.length > 200 && // 長度超過 200 字
                              !text.match(/^(Role|Responsibilities|Requirements|Qualifications|Skills|Experience|Education|Benefits|About|Overview):/i) && // 不是小節開頭
                              descriptionKeywords.test(text)) { // 包含關鍵字
                            description = text.replace(/\\n/g, '\n');
                            break; // 找到符合條件的文本後停止
                          }
                        }
                      } catch (error) {
                        log(`Error extracting job description with regex: ${error.message}`);
                      }

                      // 如果正則表達式匹配失敗，嘗試使用相對位置
                      if (!description) {
                        try {
                          // 首先找到工作類型元素
                          const jobTypeElement = doc.querySelector('span.description__job-criteria-text');
                          if (jobTypeElement) {
                            // 找到工作類型元素的父元素
                            const parentElement = jobTypeElement.closest('div.description__job-criteria');
                            if (parentElement) {
                              // 找到父元素的下一個兄弟元素，這通常是工作描述
                              const descriptionElement = parentElement.nextElementSibling;
                              if (descriptionElement) {
                                // 獲取所有段落
                                const paragraphs = descriptionElement.querySelectorAll('p');
                                description = Array.from(paragraphs)
                                  .map(p => p.textContent.trim())
                                  .filter(text => text)
                                  .join('\n');
                              }
                            }
                          }
                        } catch (error) {
                          log(`Error extracting job description with relative position: ${error.message}`);
                        }
                      }

                      // 如果相對位置也失敗，嘗試使用選擇器
                      if (!description) {
                        const descriptionNode = doc.querySelector([
                          'div.jobs-box__html-content',
                          'div[data-testid="job-detail-description"]',
                          'div[class*="job-description"]',
                          'div[class*="description"]',
                          'div[class*="jobs-box__html-content"]',
                          'div[class*="jobs-description"]'
                        ].join(','));
                        
                        if (descriptionNode) {
                          const paragraphs = descriptionNode.querySelectorAll('p');
                          description = Array.from(paragraphs)
                            .map(p => p.textContent.trim())
                            .filter(text => text)
                            .join('\n');
                        }
                      }

                      // 使用正則表達式從 HTML 中提取工資
                      let salary = '';
                      try {
                        const html = doc.documentElement.outerHTML;
                        const salaryRegex = /"text":"(\$[0-9,]+(\s*-\s*\$[0-9,]+)?(\s*per\s*(year|month|hour|week))?)"/;
                        const match = html.match(salaryRegex);
                        if (match && match[1]) {
                          salary = match[1];
                        }
                      } catch (error) {
                        log(`Error extracting salary with regex: ${error.message}`);
                      }

                      // 如果正則表達式匹配失敗，嘗試使用選擇器
                      if (!salary) {
                        const detailSalaryNode = doc.querySelector(salarySelectors.join(','));
                        salary = detailSalaryNode?.textContent?.trim() || '';
                      }
                      
                      log(`Detail salary node found: ${!!salary}`);

                      // 使用正則表達式從 HTML 中提取工作類型
                      try {
                        const html = doc.documentElement.outerHTML;
                        // 更新正則表達式以匹配更多格式
                        const jobTypeRegex = /"text":"\s*(Full-time|Part-time|Contract|Casual|Permanent|Temporary|Internship|Apprenticeship|Volunteer|Freelance|Seasonal|Fixed-term|Graduate|Entry level|Mid-Senior level|Senior level|Executive|Director|Not Applicable)"/i;
                        const match = html.match(jobTypeRegex);

                        if (match && match[1]) {
                          jobType = match[1];
                        }
                      } catch (error) {
                        log(`Error extracting job type with regex: ${error.message}`);
                      }

                      // 如果正則表達式匹配失敗，嘗試使用選擇器
                      if (!jobType) {
                        const jobTypeSelectors = [
                          'span.description__job-criteria-text',
                          'span.job-details-jobs-unified-top-card__job-type',
                          'span.job-details-jobs-unified-top-card__workplace-type',
                          'span.job-posting-type',
                          'span[class*="job-type"]',
                          'span[class*="workplace-type"]',
                          'span.ui-label.text-body-small'
                        ];
                        const detailJobTypeNode = doc.querySelector(jobTypeSelectors.join(','));
                        jobType = detailJobTypeNode?.textContent?.trim() || '';
                      }

                      log(`==========Job type found: ${jobType}`);


                      // 如果選擇器也失敗，嘗試從 metadata 中提取
                      if (!jobType) {
                        const metadataItems = Array.from(doc.querySelectorAll('span.job-card-container__footer-item'))
                          .map(item => item.textContent.trim())
                          .filter(text => text);
                        
                        log(`==========metadataItems: ${metadataItems}`);
                        const jobTypeText = metadataItems.find(text =>
                          text.match(/\b(Full-time|Part-time|Contract|Temporary|Internship|Casual|Contractor|Graduate)\b/i)
                        );
                        log(`==========Job type text foundjobTypeText: ${jobTypeText}`);
                        if (jobTypeText) {
                          jobType = jobTypeText.match(/\b(Full-time|Part-time|Contract|Temporary|Internship|Casual|Contractor|Graduate)\b/i)[0];
                        }
                      }

                      log(`Job type found: ${jobType}`);

                      resolve({
                        salary: salary,
                        jobType: jobType,
                        description: description,
                        createdAt: createdAt
                      });
                    } else {
                      log(`Error fetching job detail: ${response?.error || 'Unknown error'}`);
                      reject(new Error(response?.error || 'Unknown error'));
                    }
                  }
                );
              });

              // 更新薪資、工作類型、描述和创建时间
              salaryText = detailData.salary;
              jobType = detailData.jobType;
              description = detailData.description;
              createdAt = detailData.createdAt;
              log(`Updated salary from detail page: ${salaryText}`);
              log(`Updated job type from detail page: ${jobType}`);
              log(`Updated description from detail page: ${description.substring(0, 100)}...`);
              log(`Updated createdAt from detail page: ${createdAt.toISOString()}`);

            } catch (error) {
              log(`Error in job detail fetching: ${error.message}`);
            }
          }

          // Get posted date
          const postedDateNode = node.querySelector([
            'span[class*="time"]',
            'span[class*="listed"]',
            'span[class*="job-card-container__footer-item--time"]',
            'span[class*="job-card-list__footer-item--time"]',
            'time',
            'div[class*="job-card-container__footer-item--time"]',
            'div[class*="job-card-list__footer-item--time"]'
          ].join(','))
          log(`Posted date found: ${!!postedDateNode}`)

          log('Found LinkedIn nodes:')
          log(`Title: ${titleNode?.textContent?.trim()}`)
          log(`Company: ${companyNode?.textContent?.trim()}`)
          log(`Location: ${locationNode?.textContent?.trim()}`)
          log(`Salary: ${salaryText}`)
          log(`Description: ${description?.substring(0, 100)}...`)
          log(`Posted Date: ${postedDateNode?.textContent?.trim()}`)
          log(`URL: ${jobUrl}`)
          log(`Logo: ${logoNode?.src}`)
          log(`All Metadata: ${JSON.stringify(metadataItems)}`)

          if (titleNode && companyNode) {
            // Clean up the title by taking only the first line
            let title = titleNode.textContent.trim()
            title = title.split('\n')[0].trim()

            const job = Job.createFromLinkedIn({
              title: title,
              company: companyNode.textContent.trim(),
              location: locationNode?.textContent?.trim(),
              salary: salaryText || '',
              description: description || '',
              postedDate: postedDateNode?.textContent?.trim(),
              jobUrl: jobUrl,
              companyLogoUrl: logoNode?.src,
              jobType: jobType || '',
              createdAt: createdAt
            })
            log('Successfully scraped LinkedIn job')
            jobs.push(job)
          } else {
            log('Skipping job due to missing required fields')
          }
        } catch (error) {
          log(`Error scraping LinkedIn job: ${error.message}`)
          log(`Error stack: ${error.stack}`)
        }
      }

      // Save logs to a file (conditionally)
      if (enableLogFileDownload) {
        const blob = new Blob([logMessages.join('\n')], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'linkedin_scraper_logs.txt'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }

      log(`=== LinkedIn Scraping Complete: ${jobs.length} jobs found ===`)
      return { jobs, nextUrl }
    },
    scrapeJobDetail: () => {
      try {
        const title = document.querySelector('h1.top-card-layout__title')?.textContent.trim()
        const company = document.querySelector('a.topcard__org-name-link')?.textContent.trim()
        const location = document.querySelector('span.topcard__flavor--bullet')?.textContent.trim()
        const description = document.querySelector('div.description__text')?.textContent.trim()
        const logoUrl = document.querySelector('img.artdeco-entity-image')?.src
        const workplaceType = document.querySelector('span.workplace-type')?.textContent.trim()
        const employmentType = document.querySelector('span.job-type')?.textContent.trim()

        const job = {
          title,
          company,
          location,
          description,
          companyLogoUrl: logoUrl,
          jobUrl: window.location.href,
          platform: 'LinkedIn',
          workArrangement: workplaceType || '',
          employmentType: employmentType || ''
        }
        console.log('Scraped LinkedIn job detail:', job)
        return job
      } catch (error) {
        console.error('Error scraping LinkedIn job detail:', error)
        return null
      }
    }
  },
  seek: {
    isMatch: (url) => url.includes('seek.com.au') || url.includes('seek.co.nz'),
    scrapeJobList: async () => {
      const jobs = []
      const seekLogs = []
      
      const log = (message) => {
        console.log(message)
        seekLogs.push(message)
      }

      log('=== SEEK Scraping Started ===')
      log(`Current URL: ${window.location.href}`)
      log(`Document readyState: ${document.readyState}`)
      log(`Page content length: ${document.body.innerHTML.length}`)
      log(`Page title: ${document.title}`)

      // Try multiple possible selectors
      const selectors = [
        '[data-testid="job-card"]',
        'article[data-card-type="JobCard"]',
        'article[role="article"]',
        'a[data-testid="job-card-title"]',
        '[data-automation="job-card"]'
      ]

      let jobNodes = []
      for (const selector of selectors) {
        const nodes = document.querySelectorAll(selector)
        if (nodes.length > 0) {
          jobNodes = nodes
          log(`Using selector: ${selector}`)
          break
        }
      }

      log(`Found SEEK job nodes: ${jobNodes.length}`)

      // 修改為 async 函數，用for就能夠等待，可以點進頁面詳情//////
      for (let i = 0; i < jobNodes.length; i++) {
        const node = jobNodes[i]
        try {
          log(`\nProcessing SEEK job ${i + 1}:`)

          const titleNode =
            node.querySelector('[data-testid="job-card-title"]') ||
            node.querySelector('a[data-automation="jobTitle"]') ||
            node.querySelector('a[class*="job-title"]') ||
            node.querySelector('a[id^="job-title"]')

          const companyNode =
            node.querySelector('[data-automation="jobCompany"]') ||
            node.querySelector('span[class*="l1r1184z"] a[data-automation="jobCompany"]') ||
            node.querySelector('div.snwpn00 a[data-automation="jobCompany"]') ||
            node.querySelector('span._1yyt8p60 a[data-type="company"]')

          const locationNode =
            node.querySelector('span[data-automation="jobCardLocation"]') ||
            node.querySelector('a[data-automation="jobLocation"]') ||
            node.querySelector('span[data-type="location"]')

          const descriptionNode = node.querySelector('span[data-testid="job-card-teaser"]')
          const salaryNode = node.querySelector('span[data-automation="jobSalary"]')
          const postedDateNode = node.querySelector('span[data-automation="jobListingDate"] div._1kme6z20')
          
          // 修改 jobType 的選擇器
          const jobTypeNode = node.querySelector([
            'a[href*="-jobs/full-time"]',
            'a[href*="-jobs/part-time"]',
            'a[href*="-jobs/casual"]',
            'a[href*="-jobs/contract"]',
            'a[href*="-jobs/internship"]',
            'a[href*="-jobs/graduate"]',
            'span[data-automation="jobType"]',
            'span[class*="job-type"]',
            'div[class*="job-type"]'
          ].join(','))
          
          let jobType = jobTypeNode ? jobTypeNode.textContent.trim() : ''

          // 修改 URL 的獲取方式
          let jobUrl = ''
          if (titleNode?.href) {
            jobUrl = titleNode.href
          } else if (titleNode?.closest('a')?.href) {
            jobUrl = titleNode.closest('a').href
          } else if (node.querySelector('a[data-automation="jobTitle"]')?.href) {
            jobUrl = node.querySelector('a[data-automation="jobTitle"]').href
          }

          // 確保 URL 是完整的
          if (jobUrl && !jobUrl.startsWith('http')) {
            jobUrl = 'https://www.seek.com.au' + jobUrl
          }

          // 如果在列表頁面沒有找到 jobType 或 salary，嘗試從詳情頁面獲取
          if ((!jobType || !salaryNode?.textContent?.trim()) && jobUrl) {
            try {
              // 使用 await 等待詳情頁面數據獲取完成
              const detailData = await new Promise((resolve, reject) => {
                chrome.runtime.sendMessage(
                  {
                    action: 'fetchJobDetail',
                    url: jobUrl
                  },
                  (response) => {
                    if (response && response.html) {
                      const parser = new DOMParser()
                      const doc = parser.parseFromString(response.html, 'text/html')
                      
                      // 在詳情頁面查找 jobType
                      const jobTypeSelectors = [
                        'a[href*="-jobs/full-time"]',
                        'a[href*="-jobs/part-time"]',
                        'a[href*="-jobs/casual"]',
                        'a[href*="-jobs/contract"]',
                        'a[href*="-jobs/internship"]',
                        'a[href*="-jobs/graduate"]',
                        'span[data-automation="jobType"]',
                        'span[class*="job-type"]',
                        'div[class*="job-type"]',
                        'span[data-automation="job-work-type"]',
                        'div[data-automation="job-work-type"]',
                        'a[class*="job-type"]',
                        'div[class*="work-type"]',
                        'span[class*="work-type"]',
                        'div[data-automation="job-detail-work-type"]',
                        'span[data-automation="job-detail-work-type"]'
                      ]

                      // 在詳情頁面查找 posted date
                      const postedDateSelectors = [
                        'span[class*="_1ubeeig4z"][class*="_1oxsqkd0"]',
                        'span[class*="gg45di0"][class*="_1ubeeig4z"]',
                        'span[class*="_1oxsqkd22"]',
                        'span[class*="_18ybopc4"]',
                        'span[class*="_1oxsqkd7"]',
                        'span[data-automation="job-detail-date"]',
                        'span[data-automation="jobListingDate"]'
                      ]

                      // 在詳情頁面查找 salary
                      const salarySelectors = [
                        'span[data-automation="jobSalary"]',
                        'div[data-automation="jobSalary"]',
                        'span[class*="salary"]',
                        'div[class*="salary"]',
                        'span[data-automation="job-detail-salary"]',
                        'div[data-automation="job-detail-salary"]',
                        'span[data-automation="job-detail-remuneration"]',
                        'div[data-automation="job-detail-remuneration"]'
                      ]

                      // 記錄每個選擇器的結果
                      jobTypeSelectors.forEach(selector => {
                        const element = doc.querySelector(selector)
                        log(`Job Type Selector ${selector} found: ${!!element}`)
                        if (element) {
                          log(`Job Type Element content: ${element.textContent.trim()}`)
                        }
                      })

                      salarySelectors.forEach(selector => {
                        const element = doc.querySelector(selector)
                        log(`Salary Selector ${selector} found: ${!!element}`)
                        if (element) {
                          log(`Salary Element content: ${element.textContent.trim()}`)
                        }
                      })

                      const detailJobTypeNode = doc.querySelector(jobTypeSelectors.join(','))
                      const detailSalaryNode = doc.querySelector(salarySelectors.join(','))
                      const detailPostedDateNode = doc.querySelector(postedDateSelectors.join(','))
                      
                      log(`detailJobTypeNode found: ${!!detailJobTypeNode}`)
                      log(`detailSalaryNode found: ${!!detailSalaryNode}`)
                      log(`detailPostedDateNode found: ${!!detailPostedDateNode}`)

                      // 將發布日期文字轉換為具體日期
                      let createdAt = new Date()
                      try {
                        const html = doc.documentElement.outerHTML
                        // 查找包含 postedTime 的 JSON 数据
                        const postedTimeMatch = html.match(/"postedTime":"(\d+)([dhm]) ago"/)
                        if (postedTimeMatch) {
                          const amount = parseInt(postedTimeMatch[1])
                          const unit = postedTimeMatch[2]
                          
                          if (unit === 'd') {
                            createdAt = new Date(Date.now() - amount * 24 * 60 * 60 * 1000)
                          } else if (unit === 'h') {
                            createdAt = new Date(Date.now() - amount * 60 * 60 * 1000)
                          } else if (unit === 'm') {
                            createdAt = new Date(Date.now() - amount * 60 * 1000)
                          }
                          
                          log(`Found posted time: ${amount}${unit} ago`)
                          log(`Converted date: ${createdAt.toISOString()}`)
                        }
                      } catch (error) {
                        log(`Error extracting posted time: ${error.message}`)
                      }

                      // 如果没有抓到时间，使用当天的时间（去掉时分秒）
                      if (!createdAt) {
                        createdAt = new Date()
                        log(`Using start of today as createdAt: ${createdAt.toISOString()}`)
                      }
                      
                      resolve({
                        jobType: detailJobTypeNode?.textContent?.trim() || '',
                        salary: detailSalaryNode?.textContent?.trim() || '',
                        createdAt: createdAt
                      })
                    } else {
                      log(`Error fetching job detail: ${response?.error || 'Unknown error'}`)
                      reject(new Error(response?.error || 'Unknown error'))
                    }
                  }
                )
              })

              
              // 更新 jobType、salary 和 createdAt
              if (!jobType) {
                jobType = detailData.jobType
                log(`Updated job type from detail page: ${jobType}`)
              }
              
              if (!salaryNode?.textContent?.trim()) {
                salaryNode = { textContent: detailData.salary }
                log(`Updated salary from detail page: ${detailData.salary}`)
              }

              // 更新 createdAt
              createdAt = detailData.createdAt
              log(`Updated createdAt from detail page: ${createdAt.toISOString()}`)

            } catch (error) {
              log(`Error in job detail fetching: ${error.message}`)
            }
          }

          // 格式化 jobType
          log(`============================jobType: ${jobType}`)
          // 格式化 jobType
          if (jobType) {
            // 将 "full time" 转换为 "Full-time"
            jobType = jobType.replace(/full\s*time/i, 'Full-time')
            // 将 "part time" 转换为 "Part-time"
            jobType = jobType.replace(/part\s*time/i, 'Part-time')
            // 将 "casual" 转换为 "Casual"
            jobType = jobType.replace(/casual/i, 'Casual')
            // 将 "contract" 转换为 "Contract"
            jobType = jobType.replace(/contract/i, 'Contract')
            // 将 "internship" 转换为 "Internship"
            jobType = jobType.replace(/internship/i, 'Internship')
            // 将 "graduate" 转换为 "Graduate"
            jobType = jobType.replace(/graduate/i, 'Graduate')
            // 将 "Contract/Temp" 转换为 "Contract"
            jobType = jobType.replace(/contract\/temp/i, 'Contract')
          }

          log(`Title found: ${!!titleNode}`)
          log(`Company found: ${!!companyNode}`)
          log(`Location found: ${!!locationNode}`)
          log(`Description found: ${!!descriptionNode}`)
          log(`Salary found: ${!!salaryNode}`)
          log(`Job Type found: ${!!jobTypeNode}`)
          log(`Posted Date found: ${!!postedDateNode}`)
          log(`Job URL: ${jobUrl}`)

          if (titleNode && companyNode) {
            const job = Job.createFromSEEK({
              title: titleNode.textContent.trim(),
              company: companyNode.textContent.trim(),
              location: locationNode?.textContent?.trim(),
              jobUrl: jobUrl,
              description: descriptionNode?.textContent?.trim(),
              salary: salaryNode?.textContent?.trim(),
              jobType: jobType,
              createdAt: createdAt
            })
            log('Successfully scraped SEEK job:')
            log(`Title: ${job.title}`)
            log(`Company: ${job.company}`)
            log(`Location: ${job.location}`)
            log(`Job Type: ${job.jobType}`)
            log(`URL: ${job.jobUrl}`)
            jobs.push(job)
          } else {
            log('Skipping job due to missing required fields')
          }
        } catch (error) {
          log(`Error scraping SEEK job: ${error.message}`)
        }
      }

      // Check for next page
      const nextButton = document.querySelector([
        'li:last-child a[rel*="next"][aria-hidden="false"]',
        'li:last-child a[data-automation^="page-"]:not([aria-current])'
      ].join(','))

      const nextUrl = nextButton && nextButton.getAttribute('aria-hidden') !== 'true'
        ? nextButton.href
        : null

      log(`Next URL: ${nextUrl || 'No next page available'}`)

      // Save logs to a file (conditionally)
      if (enableLogFileDownload) {
        const blob = new Blob([seekLogs.join('\n')], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'seek_scraper_logs.txt'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }

      log(`=== SEEK Scraping Complete: ${jobs.length} jobs found ===`)
      return { jobs, nextUrl }
    },
    scrapeJobDetail: () => {
      try {
        const title = document.querySelector('[data-automation="job-detail-title"]')?.textContent.trim()
        const company = document.querySelector('[data-automation="advertiser-name"]')?.textContent.trim()
        const location = document.querySelector('[data-automation="job-location"]')?.textContent.trim()
        const description = document.querySelector('[data-automation="jobDescription"]')?.textContent.trim()
        const logoUrl = document.querySelector('[data-automation="advertiser-logo"] img')?.src
        const workType = document.querySelector('[data-automation="job-work-type"]')?.textContent.trim()
        const salary = document.querySelector('[data-automation="job-salary"]')?.textContent.trim()

        const job = {
          title,
          company,
          location,
          description,
          companyLogoUrl: logoUrl,
          jobUrl: window.location.href,
          platform: 'SEEK',
          workType: workType || '',
          salary: salary || ''
        }
        console.log('Scraped SEEK job detail:', job)
        return job
      } catch (error) {
        console.error('Error scraping SEEK job detail:', error)
        return null
      }
    }
  },
  indeed: {
    isMatch: (url) => url.includes('indeed.com'),
    scrapeJobList: async () => {
      let jobs = []
      const logMessages = []
      
      const log = (message) => {
        console.log(message)
        logMessages.push(message)
      }

      log('=== Indeed Scraping Started ===')
      log(`Current URL: ${window.location.href}`)
      log(`Document readyState: ${document.readyState}`)
      log(`Page content length: ${document.body.innerHTML.length}`)
      log(`Page title: ${document.title}`)

      // Wait for page to be fully loaded
      if (document.readyState !== 'complete') {
        log('Waiting for page to load...')
        await new Promise(resolve => {
          window.addEventListener('load', resolve, { once: true })
        })
        log('Page loaded')
      }

      const jobNodes = document.querySelectorAll([
        'div.job_seen_beacon',
        'div[class*="job_seen_"]',
        'div[class*="cardOutline"]',
        'div.resultContent',
        'div[data-testid="job-card"]',
        'td.resultContent'
      ].join(','))

      log(`Found ${jobNodes.length} job nodes on the page`)

      // 使用 Set 来跟踪已处理的职位
      const seenJobIds = new Set()

      // Scrape current page
      for (let index = 0; index < jobNodes.length; index++) {
        const node = jobNodes[index];
        try {
          log(`\nProcessing job ${index + 1}/${jobNodes.length}:`)

          const titleNode = node.querySelector([
            'h2.jobTitle a',
            'h2 a[data-jk]',
            'h2.jobTitle span[title]',
            'a[data-jk] span[title]',
            '[class*="jobTitle"]',
            'a[id^="job_"]'
          ].join(','))

          const companyNode = node.querySelector([
            'span[data-testid="company-name"]',
            'span.css-1h7lukg[data-testid="company-name"]',
            'span.companyName',
            '[data-testid="company-name"]',
            'div[class*="company"] span',
            'span[class*="companyName"]'
          ].join(','))

          const locationNode = node.querySelector([
            'div[data-testid="text-location"]',
            'div.css-1restlb[data-testid="text-location"]',
            'div.companyLocation',
            'div[class*="location"]',
            'div[class*="workplace"]'
          ].join(','))

          const descriptionNode = node.querySelector([
            'div[data-testid="jobsnippet_footer"] ul li',
            '.job-snippet',
            '.underShelfFooter .heading6 ul li'
          ].join(','))

          const postedDateNode = node.querySelector('span.date')

          // Get all metadata items and clean up text content
          const metadataItems = Array.from(node.querySelectorAll([
            '.metadataContainer li .metadata div[data-testid="attribute_snippet_testid"]',
            '.metadataContainer li div[data-testid="attribute_snippet_testid"]',
            '.metadataContainer li div[data-testid^="attribute_snippet"]'
          ].join(',')))
            .map(el => {
              const textContent = Array.from(el.childNodes)
                .filter(node => node.nodeType === Node.TEXT_NODE)
                .map(node => node.textContent.trim())
                .join(' ')
                .split('+')[0]
                .trim()

              return textContent || el.textContent.trim().split('+')[0].trim()
            })
            .filter(text => text)

          log('=======================metadataItems 所有内容:')
          log(JSON.stringify(metadataItems, null, 2))
          log('=======================metadataItems 结束')

          let salaryText = metadataItems.find(text => text.includes('$')) //$ ||'$'||'$'
          const jobTypeText = metadataItems.find(text =>
            /\b(Full-time|Part-time|Contract|Temporary|Internship|Casual|Contractor|Graduate)\b/i.test(text)
          )
          const jobType = jobTypeText?.match(/\b(Full-time|Part-time|Contract|Temporary|Internship|Casual|Contractor|Graduate)\b/i)?.[0] || ''

          const description = descriptionNode?.textContent?.trim()
            .replace(/…$/, '')
            .replace(/\s+/g, ' ')
            .trim()

          log(`Title found: ${!!titleNode}`)
          log(`Company found: ${!!companyNode}`)
          log(`Location found: ${!!locationNode}`)
          log(`Description found: ${!!descriptionNode}`)
          log(`Salary found: ${!!salaryText}`)
          log(`Job Type found: ${!!jobType}`)
          log(`Posted Date found: ${!!postedDateNode}`)

          if (titleNode && companyNode) {
            // 创建职位唯一标识
            const jobId = `${titleNode.textContent.trim()}-${companyNode.textContent.trim()}`
            
            // 检查是否已经处理过这个职位
            if (seenJobIds.has(jobId)) {
              log('Skipping duplicate job')
              continue
            }
            
            seenJobIds.add(jobId)

            let jobUrl = ''
            if (titleNode.href) {
              jobUrl = titleNode.href
            } else if (titleNode.closest('a')?.href) {
              jobUrl = titleNode.closest('a').href
            } else if (node.querySelector('a[data-jk]')?.href) {
              jobUrl = node.querySelector('a[data-jk]').href
            }

            if (!jobUrl.startsWith('http')) {
              jobUrl = 'https://indeed.com' + jobUrl
            }

            let finalJobType = jobType;
            let createdAt = new Date();

            // 如果 jobType 抓不到，進入詳情頁補抓
            if (!finalJobType && jobUrl) {
              try {
                const response = await fetch(jobUrl)
                const html = await response.text()
                const parser = new DOMParser()
                const doc = parser.parseFromString(html, 'text/html')

                log('=== Full HTML Document ===')
                log(doc.documentElement.outerHTML)
                log('=== End of HTML Document ===')

                // 尝试从HTML中提取薪资信息
                try {
                  const salaryMatch = doc.documentElement.outerHTML.match(/class="js-match-insights-provider-[^"]*">([^<]*\$[^<]+)<\/span>/);
                  if (salaryMatch && salaryMatch[1]) {
                    const detailSalary = salaryMatch[1].trim();
                    log(`Found salary in detail page: ${detailSalary}`);
                    if (!salaryText) {
                      salaryText = detailSalary;
                      // return; // 找到第一个薪资信息后立即返回
                    }
                  }
                } catch (error) {
                  log(`Error extracting salary from Indeed HTML: ${error.message}`);
                }

                //尝试从HTML中提取createdAt
                try {
                  // 查找包含jobMetadataFooterModel的JSON数据
                  const jsonMatch = doc.documentElement.outerHTML.match(/"jobMetadataFooterModel":\s*{[^}]*"age":\s*"([^"]+)"/);
                  if (jsonMatch) {
                    const ageText = jsonMatch[1];
                    log(`======Found age text: ${ageText}`);
                    
                    // 解析时间文本
                    const daysMatch = ageText.match(/(\d+)\s*days?/);
                    const weeksMatch = ageText.match(/(\d+)\s*weeks?/);
                    const monthsMatch = ageText.match(/(\d+)\s*months?/);
                    
                    if (daysMatch) {
                      const days = parseInt(daysMatch[1]);
                      createdAt = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
                      log(`======Calculated date from days: ${createdAt.toISOString()}`);
                    } else if (weeksMatch) {
                      const weeks = parseInt(weeksMatch[1]);
                      createdAt = new Date(Date.now() - weeks * 7 * 24 * 60 * 60 * 1000);
                      log(`======Calculated date from weeks: ${createdAt.toISOString()}`);
                    } else if (monthsMatch) {
                      const months = parseInt(monthsMatch[1]);
                      createdAt = new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000);
                      log(`======Calculated date from months: ${createdAt.toISOString()}`);
                    }
                  }
                } catch (error) {
                  log(`Error extracting createdAt from Indeed HTML: ${error.message}`);
                  // 如果提取createdAt失败，使用当前时间
                  createdAt = new Date();
                }


                // 根據 Indeed 詳情頁的 jobType 實際選擇器來抓
                const jobTypeEl = doc.querySelector('div[data-testid="attribute_snippet_job_type"]') ||
                  Array.from(doc.querySelectorAll('span[class*="js-match-insights-provider"]'))
                       .find(el => el.textContent?.match(/full-time|part-time|contract|temporary|intern|graduate/i));

                if (jobTypeEl) {
                  finalJobType = jobTypeEl.textContent.trim();
                  log(`Found jobType element: ${finalJobType}`);
                }
                log(`Fetched jobType from detail page: ${finalJobType}`)
              } catch (error) {
                log('Error fetching jobType from detail page: ' + error)
              }
            }

            let sourceId = '';
            const jkMatch = jobUrl.match(/[?&]jk=([^&]+)/);
            if (jkMatch) {
              sourceId = jkMatch[1];
            }

            const job = Job.createFromIndeed({
              title: titleNode.textContent.trim(),
              company: companyNode.textContent.trim(),
              location: locationNode?.textContent?.trim(),
              jobUrl: jobUrl,
              description: description,
              salary: salaryText || '',
              postedDate: postedDateNode?.textContent?.trim(),
              companyLogoUrl: node.querySelector('img.companyAvatar')?.src || null,
              jobType: finalJobType,
              sourceId: sourceId,
              createdAt: createdAt // 添加createdAt
            })

            log(`Successfully scraped job: ${job.title} at ${job.company}`)
            log(`Job URL: ${jobUrl}`)
            log(`Description: ${job.description.substring(0, 100)}...`)
            log(`Salary: ${job.salary}`)
            log(`Job Type: ${job.jobType}`)
            log(`Posted Date: ${job.postedDate}`)
            jobs.push(job)
          } else {
            log('Skipping job due to missing required fields')
          }
        } catch (error) {
          log(`Error processing job ${index + 1}: ${error.message}`)
        }
      }

      // Get next page URL
      const nextPageLink = document.querySelector('a[data-testid="pagination-page-next"]')
      const nextUrl = nextPageLink ? nextPageLink.href : null

      log(`Scraped ${jobs.length} jobs from current page`)
      log(`Next page URL: ${nextUrl || 'No next page available'}`)

      // Save logs to a file (conditionally)
      if (enableLogFileDownload) {
        const blob = new Blob([logMessages.join('\n')], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'indeed_scraper_logs.txt'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }

      log(`=== Indeed Scraping Complete: ${jobs.length} jobs found ===`)
      return { jobs, nextUrl }
    },
    scrapeJobDetail: () => {
      try {
        const title = document.querySelector('h1.jobsearch-JobInfoHeader-title')?.textContent.trim()
        const company = document.querySelector('div.jobsearch-CompanyInfoContainer a')?.textContent.trim()
        const location = document.querySelector('div.jobsearch-JobInfoHeader-subtitle div')?.textContent.trim()
        const description = document.querySelector('div#jobDescriptionText')?.textContent.trim()
        const logoUrl = document.querySelector('img.jobsearch-CompanyAvatar-image')?.src
        const salary = document.querySelector('div[data-testid="attribute_snippet_compensation"]')?.textContent.trim()
        const jobType = document.querySelector('div[data-testid="attribute_snippet_job_type"]')?.textContent.trim()

        const job = {
          title,
          company,
          location,
          description,
          companyLogoUrl: logoUrl,
          jobUrl: window.location.href,
          platform: 'Indeed',
          salary: salary || '',
          jobType: jobType || ''
        }
        console.log('Scraped Indeed job detail:', job)
        return job
      } catch (error) {
        console.error('Error scraping Indeed job detail:', error)
        return null
      }
    }
  }
}

// Export the objects to make them available in content.js
window.Job = Job
window.scrapers = scrapers 

// 添加日誌收集功能
let indeedLogs = [];

// 修改 log 函數
function log(message) {
  console.log(message);
  indeedLogs.push(message);
}

