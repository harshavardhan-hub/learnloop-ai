# 🎓 LearnLoop AI

LearnLoop AI is an **AI-powered test preparation platform** designed to help students master concepts through **continuous learning loops**.  
The system analyzes mistakes, generates personalized AI-based practice questions, and ensures concept mastery through adaptive repetition.

---

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Sample Test JSON](#-sample-test-json)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)
- [Support](#-support)

---

## ✨ Features

### 👨‍🎓 For Students
- 📝 Take domain-specific tests  
- 📊 Detailed performance analytics  
- 🤖 AI-generated practice questions based on mistakes  
- 🔄 Continuous learning loops until 80% mastery  
- 📈 Progress tracking over time  
- 🎯 Clear mistake analysis with explanations  

### 🧑‍💼 For Admins
- 📤 Upload tests using JSON format  
- 👥 Manage students  
- 📊 View analytics dashboard  
- 🔍 Monitor learning loops  
- 📈 Track AI usage statistics  

### 🤖 AI Capabilities
- Smart question generation (OpenRouter – DeepSeek)
- Concept-based learning
- Adaptive difficulty
- Topic mastery tracking

---

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Axios
- Recharts
- Lucide Icons

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- OpenRouter API (DeepSeek)

---

## 📁 Project Structure

```
LearnLoop AI/
│
├── learnloop-backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       └── server.js
│
├── learnloop-frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── context/
│       ├── hooks/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
│
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- Node.js v18+
- MongoDB (Local or Atlas)
- OpenRouter API Key

---

### 1️⃣ Clone Repository
```bash
git clone https://github.com/yourusername/learnloop-ai.git
cd learnloop-ai
```

---

### 2️⃣ Backend Setup
```bash
cd learnloop-backend
npm install
touch .env
```

#### Backend `.env`
```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/learnloop

JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d

OPENROUTER_API_KEY=sk-or-v1-xxxx
OPENROUTER_MODEL=deepseek/deepseek-chat

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=300

FRONTEND_URL=http://localhost:3000
```

```bash
npm run dev
```

Backend runs at: **http://localhost:5000**

---

### 3️⃣ Frontend Setup
```bash
cd ../learnloop-frontend
npm install
touch .env
```

#### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=LearnLoop AI
```

```bash
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## 🔐 Environment Variables

### Backend
| Variable | Description |
|--------|------------|
| PORT | Server Port |
| MONGODB_URI | MongoDB connection |
| JWT_SECRET | JWT signing key |
| OPENROUTER_API_KEY | AI API key |
| OPENROUTER_MODEL | AI model |

### Frontend
| Variable | Description |
|--------|------------|
| VITE_API_URL | Backend API URL |
| VITE_APP_NAME | App name |

---

## 📖 Usage

### Student Flow
1. Register & Login  
2. Select a test  
3. Attempt questions  
4. View results  
5. Practice AI-generated questions  
6. Achieve mastery  

### Admin Flow
- Login as Admin  
- Upload tests (JSON)  
- Monitor students and analytics  

---

## 🔌 API Documentation

### Authentication
```http
POST /api/auth/register
POST /api/auth/login
```

### Tests
```http
GET /api/tests
POST /api/tests/:id/start
POST /api/tests/attempt/:attemptId/submit
```

### AI
```http
POST /api/ai/generate/:attemptId
GET /api/ai/questions/:learningLoopId
POST /api/ai/submit/:learningLoopId
```

---

## 📤 Sample Test JSON

```json
{
  "title": "React Fundamentals",
  "domain": "Frontend Developer",
  "duration": 30,
  "questions": [
    {
      "questionText": "What is React?",
      "options": [
        { "text": "JavaScript library", "isCorrect": true },
        { "text": "Database", "isCorrect": false }
      ],
      "explanation": "React is a UI library",
      "difficulty": "Easy"
    }
  ]
}
```

---

## 🚀 Deployment

### Backend (Render)
- Build Command: `npm install`
- Start Command: `npm start`

### Frontend (Vercel)
```bash
vercel
```

---

## 🤝 Contributing
1. Fork the repo  
2. Create a feature branch  
3. Commit changes  
4. Open a Pull Request  

---

## 👨‍💻 Author
**Harsha Vardhan Yanakandla**  
📧 yanakandlaharshavardhan@gmail.com  

---

## 📞 Support
For help, open an issue or email the author.

---

Made with ❤️ by **LearnLoop AI**
