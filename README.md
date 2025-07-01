# LanguageWire Translate – Playwright Automation Suite

This project contains automated UI tests written in [Playwright](https://playwright.dev/) to validate key translation workflows on the [LanguageWire Translate](https://www.languagewire.com/products/languagewire-translate) platform.

---

## 📂 Project Structure

```
automation-challenge/
├── tests/
│   ├── copy_and_paste.spec.js
│   ├── language_swap.spec.js
│   └── translation_from_file.spec.js
├── doc_upload/
│   └── sample1.docx
├── playwright.config.js
└── README.md
```

---

## ✅ Test Coverage

### 1. `copy_and_paste.spec.js`
- Translates typed English text into Danish
- Validates translation output
- Simulates copy-paste interaction from output to input
- Re-verifies translation into Danish after paste

### 2. `translation_from_file.spec.js`
- Uploads a `.docx` file for translation from English to Danish
- Validates presence of translation progress indicators
- Downloads translated document once complete

### 3. `language_swap.spec.js`
- Verifies behavior of the source/target language swap feature
- Confirms translation still functions correctly after swapping languages

---

## 🧪 Getting Started

### Prerequisites

- Node.js >= 16
- npm or yarn

### Install Dependencies

```bash
npm install
# or
yarn
```

### Run All Tests

```bash
npx playwright test
```

### Run Specific Test

```bash
npx playwright test tests/copy_and_paste.spec.js
```

---

## ⚙️ Configuration

The `playwright.config.js` file is configured with:

- **Test directory**: `./tests`
- **Fully parallel execution**: enabled
- **Retries**: 
  - `2` on CI
  - `0` locally
- **Test runner**: HTML reporter enabled (`reporter: 'html'`)
- **Base URL**: `https://www.languagewire.com/`
- **Tracing**: enabled on first retry (`trace: 'on-first-retry'`)
- **Browser project**:
  - Chromium (Desktop Chrome)
- **Environment-sensitive settings**:
  - `forbidOnly`, `retries`, and `workers` are conditionally set based on `process.env.CI`

> 🔧 Other projects (Firefox, WebKit, mobile) are included as comments and can be enabled as needed.

---

## 📎 Notes

- The `.docx` file used in upload tests is located in `doc_upload/`.
- File upload targets a hidden `<input type="file">` element.
- Download validation uses `page.waitForEvent('download')`.

---

## 📩 Contact

For questions, reach out to the QA Automation contributor of this project.
