<div align="center">

# 🛡️ Biasbuster

<img src="https://img.shields.io/badge/🛡️-Biasbuster-blue?style=for-the-badge&logoColor=white" alt="Biasbuster Logo" width="200" height="60">

### 🚀 *Gold-Standard AI-Powered Bias Detection Platform* 🚀

<p align="center">
  <img src="https://img.shields.io/badge/AI-Powered-blue?style=for-the-badge&logo=openai" alt="AI Powered">
  <img src="https://img.shields.io/badge/Chrome-Extension-green?style=for-the-badge&logo=googlechrome" alt="Chrome Extension">
  <img src="https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-purple?style=for-the-badge" alt="Accessibility">
</p>

**🎯 Empowering users to spot, understand, and mitigate bias in news and AI-generated content with real-time, explainable insights**

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="900">

</div>

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🤖 **AI-Powered Analysis**
Leverages Google Gemini API to detect **6 types of bias**:
- 🎭 Framing Bias
- 🕳️ Omission Bias  
- 🌪️ Spin Bias
- 📊 Statistical Bias
- 🎯 Selection Bias
- ⚖️ Confirmation Bias

### 📝 **Explainable Insights**
✅ Clear explanations for each finding  
✅ Unbiased suggestions and alternatives  
✅ Confidence scores and reasoning

### 🌐 **Chrome Extension**
🔍 Analyze text on any webpage  
⚡ Seamless popup UI integration  
🎨 Real-time highlighting

</td>
<td width="50%">

### 🎨 **Customizable Experience**
🏷️ Set custom bias keywords  
🌈 Choose highlight colors  
⚙️ Personalized settings

### 📊 **Analytics Dashboard**
📈 Track your analysis history  
💾 Locally-stored statistics  
🎯 Personal bias detection trends

### 🎓 **Education Hub**
📚 Learn about bias types  
🧠 Interactive knowledge quiz  
🏆 Track learning progress

### ♿ **Accessibility First**
✅ WCAG 2.1 AA compliant  
🔆 High-contrast mode  
📏 Resizable text  
⌨️ Full keyboard navigation

### 🔍 **Transparency**
📊 Public model fairness dashboards  
📈 Performance metrics  
🔬 Open methodology

</td>
</tr>
</table>

---

## 🚀 Tech Stack

<div align="center">

| Technology | Purpose | Badge |
|------------|---------|-------|
| **React** | Frontend Framework | ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) |
| **TypeScript** | Type Safety | ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) |
| **TailwindCSS** | Styling | ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) |
| **Vite** | Build Tool | ![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E) |
| **Google Gemini** | AI Engine | ![Google](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white) |
| **GitHub Actions** | CI/CD | ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white) |

</div>

---

## 🏁 Getting Started

<img src="https://user-images.githubusercontent.com/74038190/212284087-bbe7e430-757e-4901-90bf-4cd2ce3e1852.gif" width="100">

**Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.**

### 📋 Prerequisites

<div align="center">

| Requirement | Version | Status |
|-------------|---------|--------|
| **Node.js** | v18+ | ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white) |
| **npm/yarn/pnpm** | Latest | ![npm](https://img.shields.io/badge/npm-CB3837?style=flat-square&logo=npm&logoColor=white) |
| **Google Gemini API Key** | Active | ![API](https://img.shields.io/badge/API-Key-orange?style=flat-square) |

</div>

### 🔧 Installation

```bash
# 1️⃣ Clone the repository
git clone https://github.com/amarzeus/biasbuster.git
cd biasbuster

# 2️⃣ Install dependencies
npm install

# 3️⃣ Set up environment variables
cp .env.example .env
# Add your Google Gemini API key to .env:
# API_KEY=YOUR_GEMINI_API_KEY_HERE
```

<div align="center">
<img src="https://user-images.githubusercontent.com/74038190/212284158-e840e285-664b-44d7-b79b-e264b5e54825.gif" width="400">
</div>

### 🚀 Running the Development Server

```bash
# Start development server with hot-reloading
npm run dev
```

🌐 **Open [http://localhost:5173](http://localhost:5173)** to view the application in your browser.

<div align="center">
<img src="https://user-images.githubusercontent.com/74038190/212284136-03988914-d899-44b4-b1d9-4eeccf656e44.gif" width="200">
</div>

---

## 🔧 Building for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

📁 **Output**: `dist` directory

### 🌐 Loading the Chrome Extension

<div align="center">

| Step | Action | Description |
|------|--------|-------------|
| 1️⃣ | Navigate | Go to `chrome://extensions` |
| 2️⃣ | Enable | Turn on "Developer mode" |
| 3️⃣ | Load | Click "Load unpacked" |
| 4️⃣ | Select | Choose the `extension` folder |

</div>

<div align="center">
<img src="https://user-images.githubusercontent.com/74038190/212284115-f47cd8ff-2ffb-4b04-b5bf-4d1c14c0247f.gif" width="300">
</div>

---

## 🔧 Backend Setup

### 📋 Prerequisites

<div align="center">

| Requirement | Version | Status |
|-------------|---------|--------|
| **Python** | 3.11+ | ![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white) |
| **PostgreSQL** | 15+ | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white) |
| **Docker** | Latest (optional) | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white) |

</div>

### 🔧 Installation

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### ⚙️ Environment Variables

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL=postgresql://username:password@localhost/biasbuster_db
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 🗄️ Database Setup

```bash
# Run database migrations
alembic upgrade head
```

### 🚀 Running the Backend Server

```bash
# Start the FastAPI server
uvicorn app.main:app --reload

# Server will be available at http://localhost:8000
# API documentation at http://localhost:8000/docs
```

### 🐳 Docker Deployment (Production)

```bash
# Build and run with Docker Compose
docker-compose up --build
```

This will start:
- Backend API on port 8000
- PostgreSQL database on port 5432

### 📚 API Documentation

Once the backend is running, visit:
- **Interactive API Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json

---

## 🤝 Contributing

<div align="center">

**Contributions are what make the open-source community such an amazing place to learn, inspire, and create!**

<img src="https://user-images.githubusercontent.com/74038190/212284145-bf2c01a8-c448-4f1a-b911-99cc33c2b69b.gif" width="300">

### 🌟 **Any contributions you make are greatly appreciated** 🌟

📖 Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

</div>

---

## 📜 License

<div align="center">

**This project is licensed under a Private License**

🔒 **All rights reserved** - see the [LICENSE](LICENSE) file for details.

<img src="https://img.shields.io/badge/License-Private-red?style=for-the-badge" alt="Private License">

</div>

---

## 📧 Contact

<div align="center">

### 👨‍💻 **Amar Mahakal**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/amarmahakal/)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:amarmahakal92@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/amarzeus/biasbuster)

<img src="https://user-images.githubusercontent.com/74038190/212284126-944e5a87-5d85-4f65-b4a4-8e8c6d32c5c6.gif" width="200">

</div>

---

<div align="center">

### Made with ❤️ by Amar

<img src="https://user-images.githubusercontent.com/74038190/212284158-e840e285-664b-44d7-b79b-e264b5e54825.gif" width="100">

**🚀 Empowering a bias-free digital world, one analysis at a time 🚀**

</div>
# Updated Sun 21 Sep 2025 11:32:33 PM IST
