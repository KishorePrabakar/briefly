# Briefly – AI Meeting Summarizer

Transform your meeting notes into concise summaries and action items in seconds.

## 👉 [Visit Briefly](https://briefly24.vercel.app)

## Overview

Briefly is a web application that uses AI to automatically summarize meeting notes and extract key action items. Simply paste your meeting transcript or notes, and get back a clean, organized summary with actionable tasks.

## 🛠 Tech Stack

**Frontend:**
- React 19
- Vite (build tool)
- Axios (HTTP client)
- React Markdown (formatted output)

**Backend:**
- Node.js + Express
- Groq API (AI processing)
- CORS enabled

**Deployment:**
- Vercel (frontend + backend)
- MongoDB (optional data storage)

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/KishorePrabakar/briefly.git
cd briefly
```

2. **Install dependencies**
```bash
npm install
cd client && npm install && cd ..
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
GROQ_API_KEY=your_groq_api_key_here
MONGODB_URI=your_mongodb_uri_here
```

4. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the app in action.

5. **Build for production**
```bash
npm run build
npm start
```

## 📁 Project Structure

```
briefly/
├── api/                    # Vercel serverless functions
│   └── index.js           # Express app
├── client/                # React frontend
│   ├── src/
│   │   ├── App.jsx        # Main component
│   │   ├── App.css        # Styles
│   │   └── main.jsx       # Entry point
│   ├── dist/              # Built files (generated)
│   └── package.json
├── server.js              # Local dev server
├── vercel.json            # Vercel config
├── package.json           # Root dependencies
└── .env                   # Environment variables (not committed)
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/summarize` | Summarize meeting notes |
| GET | `/api/health` | Health check |

### POST `/api/summarize`

**Request:**
```json
{
  "text": "Meeting transcript or notes..."
}
```

**Response:**
```json
{
  "summary": "AI-generated summary with action items..."
}
```

## 📖 How to Use

1. Visit [https://briefly24.vercel.app](https://briefly24.vercel.app)
2. Paste your meeting notes in the text area
3. Click "Get Summary"
4. View the AI-generated summary and action items
5. Copy results or toggle dark mode as needed

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Groq API key for AI processing | Yes |
| `MONGODB_URI` | MongoDB connection string | No |

## 🌐 Deploy Your Own

1. Fork this repository on GitHub
2. Create a [Vercel](https://vercel.com) account
3. Import your fork in Vercel
4. Add environment variables in Vercel dashboard
5. Push to main branch to auto-deploy

## 📝 Scripts

```bash
npm start      # Run local dev server
npm run dev    # Run dev server with both client and server
npm run build  # Build React client for production
npm run client # Run only React dev server
```

## 📄 License

ISC

## 👤 Author

[Kishore Prabakar](https://github.com/KishorePrabakar/)

---

