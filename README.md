# 🎓 Student Study Assistant

<div align="center">

![Project Banner](https://img.shields.io/badge/AI--Powered-Study_Assistant-667eea?style=for-the-badge)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

**Your AI-powered companion for learning anything!**

A modern, intelligent web application that helps students find educational content across multiple sources using AI and real-time search APIs.

[🚀 Live Demo](https://ai-study-assistant-buddy.netlify.app/) • [📝 Report Bug](https://github.com/YOUR-USERNAME/student-study-assistant/issues) • [✨ Request Feature](https://github.com/YOUR-USERNAME/student-study-assistant/issues)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Key Features](#-key-features)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Configuration](#-api-configuration)
- [Deployment](#-deployment)
- [Usage](#-usage)
- [Limitations](#-limitations)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## 📖 About

**Student Study Assistant** is an intelligent web application designed to help students learn efficiently by aggregating educational content from multiple sources. Simply enter any topic, and get:

- 🤖 **AI-generated explanations** from Groq's Llama 3.3 model
- 📺 **Top educational YouTube videos** 
- 📰 **Relevant articles and resources**
- 📚 **Study materials** (PDFs, presentations)
- 📋 **Quick reference cheat sheets**

Built with vanilla HTML, CSS, and JavaScript, this project demonstrates modern web development practices including responsive design, API integration, and deployment automation.

---

## ✨ Key Features

### Core Functionality
- **🔍 Intelligent Search** - One search bar for comprehensive results across 5 content types
- **🤖 AI Explanations** - Powered by Groq's Llama 3.3 70B model (14,400 free requests/day)
- **📺 Video Learning** - Curated YouTube educational videos via YouTube Data API
- **📰 Web Results** - Articles and web resources via Serper.dev API (2,500 free searches/month)
- **📚 Study Materials** - PDF and PPT file searches for in-depth learning
- **📋 Cheat Sheets** - Quick reference guides and summaries

### UI/UX
- **📱 Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- **✨ Smooth Animations** - Modern, professional animations and transitions
- **🎨 Beautiful Gradients** - Eye-catching purple/blue color scheme
- **⚡ Fast Loading** - Optimized performance with async API calls
- **♿ Accessible** - Keyboard navigation, screen reader support, reduced motion options

### Technical
- **🔄 Auto-Deploy** - Continuous deployment via Netlify on GitHub push
- **🔒 Secure API Keys** - Domain-restricted API keys for production
- **🎯 Error Handling** - Comprehensive error messages and fallbacks
- **📊 API Optimization** - Concurrent requests for faster results
- **💾 Clean Code** - Well-structured, commented, maintainable codebase

---

## 🎥 Demo

### Live Demo
👉 **[Try it live here](https://ai-study-assistant-buddy.netlify.app/)**

---

## 🛠 Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients, animations, flexbox
- **JavaScript (ES6+)** - Vanilla JS, async/await, fetch API

### APIs & Services
| API | Purpose | Free Tier |
|-----|---------|-----------|
| [Groq API](https://console.groq.com) | AI explanations (Llama 3.3) | 14,400 requests/day |
| [YouTube Data API](https://developers.google.com/youtube/v3) | Video search | 10,000 quota units/day |
| [Serper.dev API](https://serper.dev) | Web search results | 2,500 searches/month |

### Deployment & Hosting
- **Netlify** - Hosting and continuous deployment
- **GitHub** - Version control and code repository

### Development Tools
- **Git** - Version control
- **VS Code** - Code editor
- **Browser DevTools** - Testing and debugging

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Git installed on your computer
- Text editor (VS Code recommended)
- API keys (instructions below)

### Installation

1. **Clone the repository**
git clone https://github.com/YOUR-USERNAME/student-study-assistant.git
cd student-study-assistant

text

2. **Create config.js file**
touch config.js

text

3. **Add your API keys to config.js**
const CONFIG = {
GROQ_API_KEY: 'your-groq-api-key-here',
YOUTUBE_API_KEY: 'your-youtube-api-key-here',
SERPER_API_KEY: 'your-serper-api-key-here'
};

text

4. **Open in browser**
- Simply open `index.html` in your browser
- Or use a local server:
  ```
  # Using Python 3
  python -m http.server 8000
  
  # Using Node.js (http-server)
  npx http-server
  ```

5. **Start searching!**
- Enter any topic (e.g., "photosynthesis", "machine learning")
- Click Search and watch the magic happen! ✨

---

## 📁 Project Structure
<pre>
student-study-assistant/
├── index.html # Main HTML file
├── config.js # API keys configuration (gitignored)
├── css/
│ └── style.css # All styling (responsive, animations)
├── js/
│ └── script.js # JavaScript logic (search, API calls)
├── .gitignore # Git ignore rules
├── README.md # Project documentation (this file)
└── LICENSE # MIT License
</pre>

text

### Key Files

- **index.html** - Structure, search input, results containers
- **css/style.css** - Responsive design, animations, mobile optimization
- **js/script.js** - Search logic, API integrations, error handling
- **config.js** - API keys (keep secure, not committed to Git)

---

## 🔑 API Configuration

### 1. Groq API (AI Explanations)

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up (email only, no credit card)
3. Navigate to API Keys
4. Create new API key
5. Copy key (starts with `gsk_`)

**Limits:** 14,400 requests/day (free forever)

### 2. YouTube Data API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable "YouTube Data API v3"
4. Create credentials → API Key
5. Restrict key:
   - **Application restrictions:** HTTP referrers
   - Add: `https://*.netlify.app/*`
   - **API restrictions:** YouTube Data API v3

**Limits:** 10,000 quota units/day (~300-500 searches)

### 3. Serper.dev API (Web Search)

1. Go to [serper.dev](https://serper.dev)
2. Sign up (email only, no credit card)
3. Copy API key from dashboard

**Limits:** 2,500 searches/month (free tier)

### Security Best Practices

- ✅ Add domain restrictions to all API keys
- ✅ Never commit `config.js` to Git
- ✅ Monitor API usage in respective dashboards
- ✅ Regenerate keys if exposed or compromised

---

## 🌐 Deployment

### Deploy to Netlify (Recommended)

1. **Push to GitHub**
Remove config.js from .gitignore (for deployment)
git add config.js
git commit -m "Deploy with API keys"
git push origin main

text

2. **Connect to Netlify**
- Go to [netlify.com](https://netlify.com)
- Sign up with GitHub
- Click "Add new site" → "Import an existing project"
- Select your GitHub repository
- Configure:
  - Branch: `main`
  - Build command: (leave empty)
  - Publish directory: `.`
- Click "Deploy site"

3. **Update API Restrictions**
- Add your Netlify URL to YouTube API restrictions
- Format: `https://your-site-name.netlify.app/*`

4. **Done!** Your site is live 🎉

---

## 💡 Usage

### Basic Search

1. Open the application
2. Enter a topic in the search bar (e.g., "Python programming")
3. Click the 🔍 Search button
4. Wait for results to load (5-10 seconds)
5. Explore:
- AI explanation at the top
- YouTube videos
- Related articles
- Study materials (PDFs)
- Cheat sheets

### Mobile Usage

- Fully optimized for mobile devices
- Touch-friendly buttons
- Responsive layout
- Swipe-friendly sections
- Works perfectly on phones and tablets

---

## ⚠️ Limitations

### API Quotas

- **Groq:** 14,400 requests/day (~480 user searches)
- **YouTube:** 10,000 units/day (~300-500 searches)
- **Serper:** 2,500 searches/month (~83/day)

### Known Issues

1. **429 Errors:** If you exceed daily quota, wait until next day (resets at midnight Pacific Time)
2. **API Keys Visible:** Client-side JavaScript exposes API keys in browser (acceptable for free-tier learning projects with domain restrictions)
3. **No Caching:** Each search makes fresh API calls (could add localStorage caching)

### Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ IE11 not supported (uses modern JavaScript features)

---

## 🚀 Future Enhancements

### Planned Features

- [ ] **Search History** - Save and revisit past searches
- [ ] **Bookmarks** - Save favorite results
- [ ] **Share Results** - Generate shareable links
- [ ] **Voice Search** - Speech-to-text input
- [ ] **Multi-language** - Support for non-English queries
- [ ] **Export to PDF** - Save search results
- [ ] **Flashcards** - Auto-generate study flashcards
- [ ] **Quiz Mode** - Test knowledge with AI questions

### Technical Improvements

- [ ] **Caching** - localStorage to reduce API calls
- [ ] **Service Worker** - Offline support
- [ ] **Backend Proxy** - Hide API keys securely
- [ ] **Rate Limiting** - Client-side throttling
- [ ] **Analytics** - Track popular searches
- [ ] **Dark Mode** - Optional theme toggle

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
git checkout -b feature/AmazingFeature

text
3. **Commit your changes**
git commit -m 'Add some AmazingFeature'

text
4. **Push to the branch**
git push origin feature/AmazingFeature

text
5. **Open a Pull Request**

### Contribution Guidelines

- Follow existing code style
- Add comments for complex logic
- Test on multiple browsers
- Update README if needed

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**TL;DR:** You can use, modify, and distribute this project freely. Just include the original license.

---

## 🙏 Acknowledgments

### APIs & Services
- [Groq](https://groq.com) - Lightning-fast LLM inference
- [Google YouTube API](https://developers.google.com/youtube) - Video search capabilities
- [Serper.dev](https://serper.dev) - Web search API
- [Netlify](https://netlify.com) - Free hosting and deployment

### Inspiration & Resources
- Built as a learning project for web development
- Inspired by modern search interfaces
- Educational content aggregation concept
