// Test script for SEEK scraper
const fs = require('fs')
const jsdom = require('jsdom')
const { JSDOM } = jsdom

// Read the HTML file
const html = fs.readFileSync('linkedin_pageElement.html', 'utf8')
const dom = new JSDOM(html)
global.document = dom.window.document

// Mock console for debugging
const originalConsole = console.log
console.log = (...args) => {
  originalConsole('TEST LOG:', ...args)
}

// Test scraping function
async function testSeekScraper () {
  try {
    console.log('=== Starting Test Scraping ===')

    // Get all job cards
    const jobCards = document.querySelectorAll('div[class*="l1r1185b l1r118hf l1r1186v"]')
    console.log(`Found ${jobCards.length} job cards`)

    const jobs = []
    jobCards.forEach((card, index) => {
      try {
        // Using the exact class combinations from the HTML structure
        const titleEl = card.querySelector('a[data-automation="jobTitle"]')
        const companyEl = card.querySelector('a[data-automation="jobCompany"]')
        const locationEl = card.querySelector('a[data-automation="jobLocation"]')
        const salaryEl = card.querySelector('span[data-automation="jobSalary"]')
        const logoEl = card.querySelector('img[class*="_1c0pvj0"]')

        // Log raw elements for debugging
        console.log('\nRaw elements found:', {
          titleEl: titleEl?.outerHTML,
          companyEl: companyEl?.outerHTML,
          locationEl: locationEl?.outerHTML,
          salaryEl: salaryEl?.outerHTML,
          logoEl: logoEl?.outerHTML
        })

        // Try alternative selectors if needed
        if (!titleEl) {
          console.log('Trying alternative title selectors...')
          const altTitleEl = card.querySelector('h3 a') ||
            card.querySelector('a[class*="snwpn00"]') ||
            card.querySelector('a[id^="job-title"]')
          if (altTitleEl) console.log('Found title with alternative selector:', altTitleEl.outerHTML)
        }

        // Get bullet points
        const bulletPoints = Array.from(card.querySelectorAll('ul[class*="snwpn03"] li span[class*="_1l99f880"]'))
          .map(el => el.textContent.trim())
          .filter(text => text && !text.includes('at') && !text.includes('ago'))

        console.log('Bullet points found:', bulletPoints)

        // Get job description/teaser
        const descriptionEl = card.querySelector('span[data-testid="job-card-teaser"]')

        if (titleEl && titleEl.href) {
          const job = {
            title: titleEl.textContent.trim(),
            company: companyEl?.textContent?.trim() || 'Unknown Company',
            location: locationEl?.textContent?.trim() || '',
            jobUrl: titleEl.href,
            platform: 'SEEK',
            salary: salaryEl?.textContent?.trim() || '',
            companyLogoUrl: logoEl?.src || '',
            description: descriptionEl?.textContent?.trim() || '',
            bulletPoints: bulletPoints.join(' | ')
          }

          console.log(`\nSuccessfully scraped job ${index + 1}:`, job)
          jobs.push(job)
        }
      } catch (error) {
        console.error(`Error processing job card ${index}:`, error)
      }
    })

    console.log('\n=== Test Results ===')
    console.log(`Total jobs found: ${jobs.length}`)
    console.log('Jobs:', JSON.stringify(jobs, null, 2))
  } catch (error) {
    console.error('Test error:', error)
  }
}

// Run the test
testSeekScraper().then(() => console.log('Test complete')) 