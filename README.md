# 🌊 AquaX – Smart Water & Disaster Management Platform

AquaX is an AI-powered smart platform designed to improve water management, disaster reporting, citizen engagement, and awareness systems for campuses and smart communities.

The platform provides:

* Real-time issue reporting
* AI-powered multilingual assistant
* Live disaster alerts
* Interactive water monitoring system
* Voice-enabled accessibility
* Citizen & authority dashboards
* Awareness and education modules

Built using modern web technologies with real-time communication and AI integration.

---

# 🚀 Features

## 🌐 Citizen Portal

* Report water leakage, flooding, drainage, or disaster issues
* Upload incident details
* Receive real-time updates
* Access awareness resources
* Multilingual support

## 🏛 Authority Dashboard

* Monitor citizen reports
* Manage alerts and incidents
* Track disaster-prone areas
* Real-time notification system

## 🤖 AI Chat Assistant

* Powered using Gemini AI
* Multilingual communication
* Water conservation guidance
* Disaster awareness assistance
* Citizen support chatbot

## 🗺 Live Water Map

* Interactive monitoring interface
* Displays reported incidents
* Real-time tracking system

## 🎙 Voice Accessibility

* Voice commands support
* Inclusive accessibility features
* Multi-language interaction

## 📚 Education Module

* Water conservation awareness
* Disaster preparedness guidance
* Community learning resources

## 📱 Multi-Platform Access

* Web support
* IVR & SMS integration
* Mobile-friendly interface

---

# 🛠 Tech Stack

## Frontend

* HTML5
* CSS3
* JavaScript

## Backend

* Node.js
* Express.js
* Socket.IO

## AI Integration

* Gemini AI API

## Other Technologies

* REST APIs
* Real-time communication
* Responsive UI Design

---

# 📂 Project Structure

```bash
AquaX/
│
├── index.html
├── citizen.html
├── authority.html
├── chat.html
├── education.html
├── leaderboard.html
├── map.html
├── backend.js
├── .env
│
├── scripts/
│   ├── chat.js
│   ├── lang.js
│   ├── map.js
│   ├── splash.js
│   └── voice.js
│
├── styles/
│   ├── base.css
│   ├── chat.css
│   ├── citizen.css
│   ├── authority.css
│   └── education.css
│
└── assets/
```

---

# ⚙ Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/AquaX.git
cd AquaX
```

## 2️⃣ Install Dependencies

```bash
npm install
```

## 3️⃣ Configure Environment Variables

Create a `.env` file and add:

```env
PORT=5000
GEMINI_KEY=your_gemini_api_key
```

---

# ▶ Running the Project

Start the server using:

```bash
node backend.js
```

Or using nodemon:

```bash
npx nodemon backend.js
```

Open in browser:

```bash
http://localhost:5000
```

---

# 🔌 API Endpoints

## AI Chat Endpoint

```http
POST /api/chat
```

### Request Body

```json
{
  "message": "How to save water?",
  "language": "en"
}
```

### Response

```json
{
  "reply": "You can save water by fixing leaks and reducing wastage."
}
```

---

# 📡 Real-Time Features

Using Socket.IO:

* Live issue reporting
* Instant authority notifications
* Real-time alerts
* Dynamic dashboard updates

---

# 🌍 Supported Languages

* English
* தமிழ் (Tamil)
* हिन्दी (Hindi)
* తెలుగు (Telugu)
* ಕನ್ನಡ (Kannada)
* മലയാളം (Malayalam)

---

# 🎯 Use Cases

* Smart Campus Management
* Disaster Reporting Systems
* Water Conservation Platforms
* Smart City Monitoring
* Community Awareness Applications

---

# 🔮 Future Enhancements

* IoT Sensor Integration
* AI-based water consumption prediction
* Flood prediction analytics
* Mobile application release
* Cloud database integration
* GPS-based incident tracking
* Advanced analytics dashboard

---

# 👨‍💻 Team

### Developed By

* SANTHOSA PRIYAN K A
* VIDHYADHAR S

---

# 🏆 Project Highlights

✅ AI-powered assistance
✅ Real-time communication
✅ Smart disaster reporting
✅ Multilingual accessibility
✅ Modern responsive UI
✅ Social impact oriented

---

# 📜 License

This project is developed for academic and educational purposes.

---

# 💡 Vision

AquaX aims to create a smarter, safer, and water-conscious society using AI, real-time communication, and accessible technology.
