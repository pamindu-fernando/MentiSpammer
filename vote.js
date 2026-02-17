const puppeteer = require('puppeteer');

// --- User Configuration ---
const MENTI_URL = 'https://www.menti.com/alrog9nw95be';
const CHOICE_SELECTOR = 'input[id="019c6a20-d79b-7bed-a814-9f49c229e400"]';
const VOTE_COUNT = 10;
// --------------------------

// --- Advanced Configuration ---
// Set to 'new' for the new headless mode, 'true' for old headless, false to see the browser UI.
const HEADLESS_MODE = 'new';
// Delay in milliseconds between starting each vote instance.
const VOTE_DELAY_MS = 250;
// --------------------------

async function castVote(instanceNum) {
  console.log(`[Vote ${instanceNum}] Launching browser...`);
  let browser;
  
  try {
    browser = await puppeteer.launch({ headless: HEADLESS_MODE });
    // Create a new incognito-like browser context for each vote to ensure isolation.
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36');

    console.log(`[Vote ${instanceNum}] Navigating to Menti page...`);
    await page.goto(MENTI_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Attempt to accept cookie banner if it appears
    try {
        const acceptButton = await page.waitForSelector('button#onetrust-accept-btn-handler', { timeout: 5000 });
        if (acceptButton) {
          await acceptButton.click();
          console.log(`[Vote ${instanceNum}] Accepted cookie consent.`);
          // Wait for any overlays to disappear
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
    } catch (e) {
        console.log(`[Vote ${instanceNum}] No cookie banner found or it timed out.`);
    }

    console.log(`[Vote ${instanceNum}] Searching for choice with selector: ${CHOICE_SELECTOR}`);
    // Wait for the selector to appear in the DOM. It might not be "visible" if it's a styled radio/checkbox.
    const choiceElement = await page.waitForSelector(CHOICE_SELECTOR, { timeout: 20000 });

    if (!choiceElement) {
      throw new Error('Could not find the choice element on the page.');
    }

    // Use page.evaluate to click the element via the DOM. This is more reliable for
    // custom styled inputs that might not be considered "clickable" by Puppeteer's default checks.
    await page.evaluate(el => el.click(), choiceElement);
    console.log(`[Vote ${instanceNum}] Clicked the choice button.`);
    
    // A confirmation/submit button might appear after selection
    try {
      const submitButton = await page.waitForSelector('button[type="submit"]', { visible: true, timeout: 3000 });
      if (submitButton) {
        await submitButton.click();
        console.log(`[Vote ${instanceNum}] Clicked the submit button.`);
      }
    } catch (e) {
      console.log(`[Vote ${instanceNum}] No separate submit button found, assuming vote is cast.`);
    }

    // Wait a moment for confirmation
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`[Vote ${instanceNum}] ✅ Vote cast successfully!`);

  } catch (error) {
    console.error(`[Vote ${instanceNum}] ❌ An error occurred: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
      console.log(`[Vote ${instanceNum}] Browser closed.`);
    }
  }
}

async function run() {
  console.log('--- Menti Vote Automation Script ---');
  console.log(`Target URL: ${MENTI_URL}`);
  console.log(`Target Selector: ${CHOICE_SELECTOR}`);
  console.log(`Number of Votes: ${VOTE_COUNT}`);
  console.log('------------------------------------\n');

  const votePromises = [];
  for (let i = 1; i <= VOTE_COUNT; i++) {
    // Sequentially push promises with a delay to avoid overwhelming the system/network
    votePromises.push(castVote(i));
    if (i < VOTE_COUNT) {
      await new Promise(resolve => setTimeout(resolve, VOTE_DELAY_MS));
    }
  }
  
  await Promise.all(votePromises);
  
  console.log(`
--- All ${VOTE_COUNT} vote attempts are complete. ---`);
}

run();