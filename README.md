![Image](https://github.com/user-attachments/assets/c7f78530-c9b9-46a1-b6a9-7f91f81d7071)

# MentiSpammer Script

A Node.js automation tool using [Puppeteer](https://pptr.dev/) to programmatically cast votes on Mentimeter polls. This script creates isolated browser sessions to simulate unique users and bypass basic cookie tracking.

> **⚠️ Disclaimer:** This software is for educational and testing purposes only. Using automation to manipulate live polls likely violates Mentimeter's Terms of Service. Please use responsibly.

---

## 📋 Prerequisites

To run this script, you must have **Node.js** installed on your system.

### Install Node.js & NPM

1. **Download:** Go to [nodejs.org](https://nodejs.org/) and download the "LTS" (Long Term Support) version.
2. **Install:** Run the installer and follow the on-screen instructions.
3. **Verify:** Open your terminal (Command Prompt, PowerShell, or Terminal) and run:

```bash
node -v
npm -v
```

*You should see version numbers (e.g., `v18.16.0`) if installed correctly.*

---

## 🚀 Setup

### 1. Install Dependencies

Install Puppeteer, which is the library used to control the browser:

```bash
npm install puppeteer
```

> **Note:** This command will also download a compatible version of Chromium locally.

### 2. Create the Script File

Create a file named `vote.js` in your project folder and paste your script code into it.

or

```bash
git clone https://github.com/pamindu-fernando/MentiSpammer.git
cd MentiSpammer

```

---

## ⚙️ Configuration

Before running the bot, you must configure the target poll and option in `vote.js`.

Open `vote.js` and edit the **User Configuration** section at the top:

```javascript
// --- User Configuration ---
const MENTI_URL = 'https://www.menti.com/YOUR_CODE_HERE'; // <-- menti.com url 
const CHOICE_SELECTOR = 'input[id="YOUR_TARGET_ID"]'; // <-- ID you found from inspect element
const VOTE_COUNT = 10; // <-- No. of votes you need 
// --------------------------
```
You can find the ID through inspect element manually and finding the ID related to the your selection or just paste this in to the browser console tab and press enter and all the available IDs will appear

```javascript

// Paste this into the Console to see all IDs
const options = document.querySelectorAll('input[type="radio"]');
console.clear();
console.log('%c Found ' + options.length + ' voting options:', 'font-size: 14px; color: #00ff00; font-weight: bold;');

options.forEach((opt, index) => {
    // Try to find the text label nearby (this logic attempts to grab the closest text)
    // Menti structure: Input -> Span -> Div -> Div (sibling) -> Text
    let label = "Option " + (index + 1); 
    console.log(`${label} | ID to copy: "${opt.id}"`);
});

```

---

## 🔎 How to find the `CHOICE_SELECTOR`

Mentimeter uses dynamic (random) IDs, so you must find the current ID for your target option:

1. Open the Menti voting link in Chrome or Edge.
2. Right-click the radio button/option you want to vote for.
3. Select **Inspect** to open Developer Tools.
4. Find the `<input type="radio">` tag.

- **Copy the ID:** If you see `id="019c..."`, update your config to:

```javascript
const CHOICE_SELECTOR = 'input[id="019c..."]';
```

- **Alternative (Vote by order):** If IDs are changing too fast, you can modify the script to vote by position (e.g., "always click the 3rd option") rather than by ID.

---

## ▶️ Usage

To start the voting process, run:

```bash
node vote.js
```

### What happens next?

1. **Initialization:** The script prepares the browser instances.
2. **Voting Loop:** It will launch a hidden browser for every vote defined in `VOTE_COUNT`.
3. **Cookie Consent:** It attempts to click "Accept Cookies" if the banner appears.
4. **Voting:** It selects your configured option and submits the vote.
5. **Logs:** You will see real-time progress in your terminal:

```
[Vote 1] ✅ Vote cast successfully!
```

---

## 🛠️ Troubleshooting

| Issue | Solution |
|---|---|
| `Error: Could not find the choice element` | The `CHOICE_SELECTOR` is incorrect or the ID has changed. Re-inspect the page and update the ID in `vote.js`. |
| Script hangs / Timeouts | Your internet connection may be slow, or the site is loading slowly. Increase `timeout: 30000` to `60000` in the script. |
| Votes are not counting | Mentimeter has anti-bot protections. If you vote too fast from one IP, votes may be discarded. Try increasing `VOTE_DELAY_MS` to `5000` (5 seconds) or use a VPN. |

---

## 📝 License

This project is open-source. Feel free to modify it for your own testing needs.
