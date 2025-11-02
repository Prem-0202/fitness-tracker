# 💪 Fitness Tracker API

> A modern REST API for tracking workouts, nutrition, and fitness progress

## ✨ Features

🔐 **Authentication** - Secure JWT-based user system  
🏋️ **Workouts** - Track exercises with detailed metrics  
🥗 **Nutrition** - Monitor daily food intake & calories  
📊 **Progress** - Analyze fitness goals & achievements  

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start development server
npm run dev
```

## 🛠️ Tech Stack

- **Node.js** + **Express** - Backend framework
- **MongoDB** + **Mongoose** - Database & ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/workouts` | Get workouts |
| POST | `/api/workouts` | Create workout |
| GET | `/api/nutrition` | Get nutrition |
| POST | `/api/nutrition` | Add nutrition |

## 🏃♂️ Usage

**Register a new user:**
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Create a workout:**
```json
POST /api/workouts
{
  "name": "Morning Run",
  "type": "cardio",
  "duration": 30,
  "caloriesBurned": 300
}
```

## 📁 Project Structure

```
fitness-tracker/
├── 📁 config/       # Database config
├── 📁 controllers/  # Route handlers
├── 📁 middleware/   # Auth & validation
├── 📁 models/       # MongoDB schemas
├── 📁 routes/       # API routes
├── 📁 utils/        # Helper functions
└── 📄 app.js        # Main app file
```

## 🔍 Health Check

Visit `http://localhost:3000/health` for server status

---

**Made with ❤️ for fitness enthusiasts**