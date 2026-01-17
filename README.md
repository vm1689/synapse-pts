# Synapse PTS Tracker

> AI-powered clinical trial intelligence that watches the market so you don't have to.

![Synapse](https://img.shields.io/badge/Built%20with-Claude%20Opus%204.5-purple)
![Yutori](https://img.shields.io/badge/Powered%20by-Yutori%20Browsing-blue)

## Overview

Synapse is an AI-powered portfolio tracker for clinical trial Probability of Trial Success (PTS). It automatically monitors news sources for trial updates—FDA decisions, safety signals, competitor events—and uses Claude to synthesize findings into actionable intelligence.

### Key Features

- **Automated Research**: Yutori browses the web for recent clinical trial news
- **AI Analysis**: Claude Opus 4.5 merges findings and adjusts PTS scores
- **Change Detection**: Visual highlighting of what changed and why
- **Portfolio View**: 20 Phase III trials with PTS scores, sorted by risk

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **AI**: Claude Opus 4.5 (Anthropic API)
- **Web Browsing**: Yutori Browsing API
- **Data**: Markdown-based content with JSON trial data

## Getting Started

### Prerequisites

- Node.js 18+
- Anthropic API key
- Yutori API key

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/synapse-pts-tracker.git
cd synapse-pts-tracker

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file with:

```
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
VITE_YUTORI_API_KEY=your_yutori_api_key
```

## Usage

1. Open the app at `http://localhost:5173`
2. View the portfolio of 20 clinical trials sorted by PTS
3. Click **Refresh** to:
   - Browse for recent trial news (Yutori)
   - Analyze and merge findings (Claude Opus)
   - Update PTS scores and highlight changes
4. Click **Base** to reset to original data
5. Click **Preview** to load saved research output

## How It Works

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Yutori    │────▶│   Claude    │────▶│     UI      │
│  Browsing   │     │  Opus 4.5   │     │   Update    │
└─────────────┘     └─────────────┘     └─────────────┘
     │                    │                    │
     ▼                    ▼                    ▼
 Searches            Analyzes &           Highlights
 Google News        merges with          changes in
 for trials         base data            purple
```

## Project Structure

```
src/
├── components/       # React components
│   ├── Header.jsx    # Navigation & controls
│   ├── DataTable.jsx # Trial data table
│   └── ...
├── context/          # React Context
│   └── DataContext.jsx
├── data/             # Content files
│   ├── content.base.md
│   └── parseContent.js
├── services/         # API integrations
│   ├── anthropicService.js
│   └── yutoriService.js
└── debug/            # Debug output files
```

## Built at Anthropic Hackathon

Built in 24 hours at the Anthropic Hackathon (January 2026).

## License

MIT
